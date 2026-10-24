'use client';

import React, { useState } from 'react';
import { 
  Database, 
  FileCode, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Terminal,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prisma' | 'sql' | 'ledger' | 'security'>('prisma');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const prismaSnippet = `// Production Prisma Schema for Vidyoday CBSE ERP
model Tenant {
  id               String   @id @default(uuid())
  legalName        String   @map("legal_name")
  subdomain        String   @unique
  campuses         Campus[]
}

model Campus {
  id                 String   @id @default(uuid())
  tenantId           String   @map("tenant_id")
  name               String
  cbseAffiliationNo  String   @map("cbse_affiliation_no")
  udiseSchoolCode    String   @map("udise_school_code")
  students           Student[]
  ledgerEntries      LedgerEntry[]
}

model Student {
  id                   String             @id @default(uuid())
  admissionNumber      String             @map("admission_number")
  penNumber            String?            @map("pen_number") // UDISE+ PEN
  apaarId              String?            @unique @map("apaar_id") // 12-Digit One Nation One Student ID
  apaarConsentStatus   ApaarConsentStatus @default(CONSENT_PENDING)
  fullNameSchool       String             @map("full_name_school")
  fullNameAadhaar      String?            @map("full_name_aadhaar")
  currentClass         String             @map("current_class")
  attendancePercentage Decimal            @db.Decimal(5, 2)
  invoices             FeeInvoice[]
  ledgerEntries        LedgerEntry[]
}

model LedgerEntry {
  id                 String   @id @default(uuid())
  campusId           String   @map("campus_id")
  accountCode        String   @map("account_code")
  accountName        String   @map("account_name")
  debitAmount        Decimal  @db.Decimal(12, 2)
  creditAmount       Decimal  @db.Decimal(12, 2)
  narration          String
  tallySyncStatus    String   @default("PENDING")
}`;

  const sqlSnippet = `-- PostgreSQL 16: Immutability Constraint & Row Level Security
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL,
    account_code VARCHAR(32) NOT NULL,
    debit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    credit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    narration TEXT NOT NULL,
    CONSTRAINT chk_debit_or_credit CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR 
        (credit_amount > 0 AND debit_amount = 0)
    )
);

-- Immutable Ledger Trigger (Ind AS & CBSE Audit Compliance)
CREATE OR REPLACE FUNCTION prevent_ledger_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'CRITICAL: Ledger entries are immutable. Adjust via credit note.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_immutable_ledger
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION prevent_ledger_modification();

-- Row Level Security (RLS) for Multi-Campus Isolation
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY campus_isolation_policy ON ledger_entries
    FOR ALL
    USING (campus_id = NULLIF(current_setting('app.current_campus_id', true), '')::UUID);`;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" />
            Production System Architecture & Database Schema
          </h2>
          <p className="text-xs text-slate-400">
            PostgreSQL 16 Multi-Tenant schema with Row-Level Security (RLS), immutable double-entry ledger triggers, and DPDP Act 2023 compliance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('prisma')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'prisma' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Prisma Schema
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'sql' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            PostgreSQL DDL & RLS
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'ledger' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Double-Entry & Tally
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'security' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            DPDP Privacy & RLS
          </button>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>
              {activeTab === 'prisma'
                ? 'prisma/schema.prisma'
                : activeTab === 'sql'
                ? 'database/cbse_erp_schema.sql'
                : activeTab === 'ledger'
                ? 'accounting/double_entry_spec.md'
                : 'security/dpdp_act_compliance.md'}
            </span>
          </div>

          <button
            onClick={() =>
              handleCopy(activeTab === 'prisma' ? prismaSnippet : activeTab === 'sql' ? sqlSnippet : 'Architecture Spec')
            }
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-6 bg-slate-950/90 overflow-x-auto text-xs font-mono leading-relaxed text-indigo-200">
          {activeTab === 'prisma' && <pre>{prismaSnippet}</pre>}
          {activeTab === 'sql' && <pre className="text-emerald-300">{sqlSnippet}</pre>}
          {activeTab === 'ledger' && (
            <div className="space-y-4 font-sans text-slate-300">
              <h4 className="text-base font-bold text-white font-mono">
                Double-Entry Accounting Architecture & Split Settlements
              </h4>
              <p className="text-xs">
                To guarantee zero revenue leakage and pass CBSE annual financial audits without spreadsheet discrepancies:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <div className="text-indigo-400 font-bold">1. Fee Invoicing Entry:</div>
                  <div>Debit: Student Fee Receivable (Asset)</div>
                  <div>Credit: Tuition Fee Income (Trust Revenue)</div>
                  <div>Credit: Commute & Fleet Income (Logistics Revenue)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <div className="text-emerald-400 font-bold">2. Payment Receipt Entry:</div>
                  <div>Debit: ICICI Educational Trust Bank (82%)</div>
                  <div>Debit: HDFC Fleet Logistics Escrow (18%)</div>
                  <div>Credit: Student Fee Receivable (Asset Cleared)</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="space-y-4 font-sans text-slate-300">
              <h4 className="text-base font-bold text-white font-mono">
                Digital Personal Data Protection (DPDP) Act 2023 Compliance
              </h4>
              <ul className="text-xs space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Raw Aadhaar Storage:</strong> Student Aadhaar numbers are never stored in plaintext. Only SHA-256 demographic hashes are maintained for UIDAI match score calculations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Verifiable Parental Consent Log:</strong> Digital consent for APAAR generation and Digilocker sync is captured with timestamped SMS/Portal OTP tokens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>PostgreSQL Row-Level Security (RLS):</strong> Campus-level tenant isolation prevents branch clerks from accessing student or ledger records from sister campuses.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
