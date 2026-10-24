-- =========================================================================
-- VIDYODAY CBSE ERP: PostgreSQL 16 Production Schema with Row-Level Security
-- Implements Double-Entry Ledger, UDISE+ / APAAR, NEP 2020 360 HPC, AIS-140 GPS
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Enable Row Level Security (RLS) Configuration
-- Multi-branch school trusts isolate data by setting: 
-- SET LOCAL app.current_tenant_id = 'uuid';
-- SET LOCAL app.current_campus_id = 'uuid';

-- 2. Immutable Ledger Constraint Trigger
-- In compliance with CBSE audit norms and Indian Accounting Standards (Ind AS),
-- ledger entries CANNOT be updated or deleted. Reversals must be explicit credit/debit notes.

CREATE OR REPLACE FUNCTION prevent_ledger_modification()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        RAISE EXCEPTION 'CRITICAL AUDIT VIOLATION: Ledger entries are immutable. You must issue a credit note or correction journal entry.';
    ELSIF (TG_OP = 'DELETE') THEN
        RAISE EXCEPTION 'CRITICAL AUDIT VIOLATION: Ledger entries cannot be deleted. Contact system auditor.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Double-Entry Fee Ledger Table
CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL,
    student_id UUID,
    transaction_id UUID,
    entry_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_code VARCHAR(32) NOT NULL,
    account_name VARCHAR(128) NOT NULL,
    debit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (debit_amount >= 0),
    credit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (credit_amount >= 0),
    narration TEXT NOT NULL,
    tally_sync_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_debit_or_credit CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR 
        (credit_amount > 0 AND debit_amount = 0)
    )
);

-- Attach immutability trigger
DROP TRIGGER IF EXISTS trg_immutable_ledger ON ledger_entries;
CREATE TRIGGER trg_immutable_ledger
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_modification();

-- 4. Enable Row Level Security on Sensitive Tables
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY campus_isolation_policy ON ledger_entries
    FOR ALL
    USING (campus_id = NULLIF(current_setting('app.current_campus_id', true), '')::UUID);

-- 5. Automatic Payment Gateway Split Settlement View
CREATE OR REPLACE VIEW view_fee_split_settlement_reconciliation AS
SELECT 
    t.receipt_number,
    t.created_at AS transaction_timestamp,
    s.admission_number,
    s.full_name_school AS student_name,
    s.current_class,
    t.total_paid,
    t.trust_share AS educational_trust_amount,
    t.fleet_share AS transport_logistics_amount,
    t.payment_method,
    t.gateway_ref_number,
    t.settlement_batch_id
FROM fee_transactions t
JOIN fee_invoices i ON t.invoice_id = i.id
JOIN students s ON i.student_id = s.id;

-- 6. Class 9-12 CBSE Board LOC (List of Candidates) Pre-Verification Query
-- Automatically identifies students who fail CBSE Bylaw 13.2 (Mandatory 75% attendance)
-- or have Aadhaar name mismatches before final submission to CBSE OASIS/Pariksha Sangam.

CREATE OR REPLACE VIEW view_cbse_board_loc_exceptions AS
SELECT 
    s.id AS student_id,
    s.admission_number,
    s.full_name_school,
    s.full_name_aadhaar,
    s.current_class,
    s.attendance_percentage,
    s.apaar_consent_status,
    s.apaar_id,
    CASE 
        WHEN s.attendance_percentage < 75.00 THEN 'FAIL_ATTENDANCE_SHORTAGE_CBSE_RULE_13.2'
        WHEN s.full_name_school <> s.full_name_aadhaar THEN 'WARNING_DEMOGRAPHIC_SPELLING_MISMATCH'
        WHEN s.apaar_id IS NULL THEN 'FAIL_APAAR_MANDATORY_NCrF_ABC'
        ELSE 'PASS_LOC_READY'
    END AS loc_precheck_status
FROM students s
WHERE s.current_class IN ('Class 9', 'Class 10', 'Class 11', 'Class 12');

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_campus_class ON students(campus_id, current_class);
CREATE INDEX IF NOT EXISTS idx_ledger_campus_date ON ledger_entries(campus_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_rfid_taps_student_time ON rfid_tap_records(student_id, timestamp DESC);
