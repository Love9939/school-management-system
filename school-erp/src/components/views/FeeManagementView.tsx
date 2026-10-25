'use client';

import React, { useState } from 'react';
import { 
  IndianRupee, 
  Send, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  AlertCircle, 
  ShieldAlert, 
  FileSpreadsheet, 
  Lock, 
  ArrowRight, 
  Check, 
  Copy, 
  ExternalLink,
  MessageCircle,
  FileCheck,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeeDefaulterRecord, FeeTransaction } from '../../types';

interface FeeManagementViewProps {
  defaulters: FeeDefaulterRecord[];
  transactions: FeeTransaction[];
  onDefaultersUpdate: (updated: FeeDefaulterRecord[]) => void;
  onNewTransaction: (tx: FeeTransaction) => void;
}

export const FeeManagementView: React.FC<FeeManagementViewProps> = ({
  defaulters,
  transactions,
  onDefaultersUpdate,
  onNewTransaction,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'defaulters' | 'ledger' | 'maker-checker'>('defaulters');
  const [selectedDefaulter, setSelectedDefaulter] = useState<FeeDefaulterRecord | null>(null);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [makerCheckerApproved, setMakerCheckerApproved] = useState(false);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenWhatsAppModal = (record: FeeDefaulterRecord) => {
    setSelectedDefaulter(record);
    setWhatsappModalOpen(true);
    setCopiedLink(false);
  };

  const handleCopyUpiLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulatePayment = (record: FeeDefaulterRecord) => {
    // Fire confetti celebration!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const trustAmt = record.tuitionFeeDue + record.lateFine;
    const fleetAmt = record.transportFeeDue;
    const totalPaid = record.totalDue + record.lateFine;

    // Create fee transaction with split settlement
    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: `RCP-2026-Q3-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: record.studentId,
      studentName: record.studentName,
      amount: totalPaid,
      paymentMode: 'UPI_DIRECT',
      referenceNumber: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/HDFC`,
      trustAccountAmount: trustAmt,
      fleetAccountAmount: fleetAmt,
      settlementStatus: 'SETTLED_T1',
      timestamp: new Date().toLocaleString('en-IN'),
      verifiedBy: 'Instant Bank Webhook (T+1 Settlement)',
    };

    onNewTransaction(newTx);

    // Update defaulters list
    const updatedList = defaulters.map((item) =>
      item.id === record.id ? { ...item, status: 'PAID' as const, totalDue: 0, lateFine: 0 } : item
    );
    onDefaultersUpdate(updatedList);

    setPaymentSuccessMessage(
      `Instant UPI Settlement Verified for ${record.studentName}! ₹${totalPaid.toLocaleString()} split: Trust ₹${trustAmt.toLocaleString()} | Fleet ₹${fleetAmt.toLocaleString()}`
    );
    setWhatsappModalOpen(false);

    setTimeout(() => setPaymentSuccessMessage(null), 6000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Success Notification Bar */}
      {paymentSuccessMessage && (
        <div className="p-4 rounded-xl bg-[#c7f0da] border border-[#a3e6c2] text-[#103c25] text-xs font-semibold flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#103c25]" />
            <span>{paymentSuccessMessage}</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#c7f0da] px-2 py-0.5 rounded">Tally Prime Synced</span>
        </div>
      )}

      {/* Header and Subtabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-[#103c25]" />
            Double-Entry Fee Engine & 1-Tap Recovery
          </h2>
          <p className="text-xs text-[#62625b]">
            Eliminates fee leakage with immutable double-entry journal vouchers, WhatsApp dynamic UPI links, and automated split settlements.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#f6f6f3] border border-[#dadad3] text-xs">
          <button
            id="subtab-defaulters-btn"
            onClick={() => setActiveSubTab('defaulters')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'defaulters'
                ? 'bg-[#e60023] text-white shadow'
                : 'text-[#62625b] hover:text-[#000000]'
            }`}
          >
            Smart Defaulters ({defaulters.filter((d) => d.status === 'PENDING').length})
          </button>
          <button
            id="subtab-ledger-btn"
            onClick={() => setActiveSubTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'ledger'
                ? 'bg-[#e60023] text-white shadow'
                : 'text-[#62625b] hover:text-[#000000]'
            }`}
          >
            Double-Entry Ledger & Tally
          </button>
          <button
            id="subtab-makerchecker-btn"
            onClick={() => setActiveSubTab('maker-checker')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'maker-checker'
                ? 'bg-[#e60023] text-white shadow'
                : 'text-[#62625b] hover:text-[#000000]'
            }`}
          >
            Maker-Checker (1)
          </button>
        </div>
      </div>

      {/* Subtab 1: Smart Defaulters Workflow */}
      {activeSubTab === 'defaulters' && (
        <div className="space-y-4">
          
          {/* Defaulter Table Card */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[#dadad3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Active Q3 Defaulters Ledger (Tiered Escalation Engine)
                </h3>
                <p className="text-[11px] text-[#62625b]">
                  Late fines calculate automatically. Click "1-Tap WhatsApp" to generate dynamic payment link.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#62625b]">
                  Total Pending: <strong className="text-rose-400">{formatINR(defaulters.reduce((acc, d) => acc + (d.status === 'PENDING' ? d.totalDue + d.lateFine : 0), 0))}</strong>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f6f6f3]/60 text-[#62625b] uppercase text-[10px] font-mono border-b border-[#dadad3]">
                  <tr>
                    <th className="py-3 px-4">Student & Class</th>
                    <th className="py-3 px-4">Parent Details</th>
                    <th className="py-3 px-4">Dues Breakdown</th>
                    <th className="py-3 px-4">Overdue</th>
                    <th className="py-3 px-4">Escalation Tier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {defaulters.map((record) => {
                    const isPaid = record.status === 'PAID';
                    return (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                        
                        {/* Student */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{record.studentName}</div>
                          <div className="text-[11px] text-[#62625b] font-mono">
                            {record.className}-{record.section} • {record.admissionNo}
                          </div>
                        </td>

                        {/* Parent */}
                        <td className="py-3.5 px-4">
                          <div className="text-[#33332e] font-medium">{record.parentName}</div>
                          <div className="text-[11px] text-[#62625b] font-mono">{record.parentPhone}</div>
                        </td>

                        {/* Dues Breakdown */}
                        <td className="py-3.5 px-4 font-mono">
                          {isPaid ? (
                            <span className="text-[#103c25] font-bold">₹0 (Paid in Full)</span>
                          ) : (
                            <div>
                              <div className="font-bold text-rose-300">
                                {formatINR(record.totalDue + record.lateFine)}
                              </div>
                              <div className="text-[10px] text-[#62625b]">
                                Tuition {formatINR(record.tuitionFeeDue)} | Transport {formatINR(record.transportFeeDue)}
                                {record.lateFine > 0 && <span className="text-amber-400"> + Fine {formatINR(record.lateFine)}</span>}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Overdue */}
                        <td className="py-3.5 px-4">
                          {isPaid ? (
                            <span className="text-[#91918c]">—</span>
                          ) : (
                            <div>
                              <span className="font-bold text-rose-400">{record.daysOverdue} Days</span>
                              <div className="text-[10px] text-[#62625b]">Since Oct 10</div>
                            </div>
                          )}
                        </td>

                        {/* Escalation Tier */}
                        <td className="py-3.5 px-4">
                          {isPaid ? (
                            <span className="text-[#103c25] text-[11px] font-semibold">Cleared</span>
                          ) : (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                record.escalationTier === 'PORTAL_LOCK_WARNING'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                                  : record.escalationTier === 'FORMAL_NOTICE'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  : record.escalationTier === 'REMINDER_2'
                                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                  : 'bg-[#c8c8c1]/40 text-[#33332e] border-slate-600/30'
                              }`}
                            >
                              {record.escalationTier.replace('_', ' ')}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#103c25]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              PAID (T+1)
                            </span>
                          ) : record.status === 'CONCESSION_REQUESTED' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                              <Lock className="w-3.5 h-3.5" />
                              Maker-Checker
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-rose-400">Pending</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          {isPaid ? (
                            <button
                              disabled
                              className="px-3 py-1.5 rounded-lg bg-[#f6f6f3] text-[#91918c] text-[11px] cursor-not-allowed"
                            >
                              Receipt Generated
                            </button>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`whatsapp-btn-${record.id}`}
                                onClick={() => handleOpenWhatsAppModal(record)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] transition-all flex items-center gap-1"
                                title="Send WhatsApp Payment Link"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-[#103c25]" />
                                <span>1-Tap WhatsApp</span>
                              </button>
                              <button
                                id={`pay-btn-${record.id}`}
                                onClick={() => handleSimulatePayment(record)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#e60023] hover:bg-indigo-500 text-white font-semibold text-[11px] transition-all flex items-center gap-1"
                                title="Simulate Immediate UPI Payment"
                              >
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Simulate Pay</span>
                              </button>
                            </div>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

          {/* Explanation Callout */}
          <div className="glass-card rounded-2xl p-4 border border-[#dadad3] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#33332e]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-[#e60023] flex items-center justify-center font-bold">
                UPI
              </div>
              <div>
                <span className="font-bold text-white">How WhatsApp 1-Tap Recovery Works:</span>
                <span className="text-[#62625b] block text-[11px]">
                  Encodes student ID + quarter into dynamic NPCI UPI URI. When parent clicks in WhatsApp, it opens GPay / PhonePe / Paytm with exact amount pre-filled. Bank webhook completes T+1 auto-reconciliation.
                </span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-[#103c25] bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 whitespace-nowrap">
              Zero Login Friction • 4x Faster Recovery
            </div>
          </div>

        </div>
      )}

      {/* Subtab 2: Double-Entry Ledger & Tally Prime */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  Immutable Double-Entry Ledger Journal (Tally Prime Integrated)
                </h3>
                <p className="text-xs text-[#62625b]">
                  Every transaction generates balanced Debits and Credits with cryptographic audit hashes.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#103c25] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Tally XML / ODBC Synced
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f6f6f3]/60 text-[#62625b] uppercase text-[10px] font-mono border-b border-[#dadad3]">
                  <tr>
                    <th className="py-2.5 px-4">Receipt #</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Payment Mode & Ref</th>
                    <th className="py-2.5 px-4 text-right">Trust Share</th>
                    <th className="py-2.5 px-4 text-right">Fleet Share</th>
                    <th className="py-2.5 px-4 text-right">Total Amount</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-indigo-300">{tx.receiptNumber}</td>
                      <td className="py-3 px-4 text-[#62625b] text-[11px]">{tx.timestamp}</td>
                      <td className="py-3 px-4 text-white font-sans">{tx.studentName}</td>
                      <td className="py-3 px-4 text-[#33332e] text-[11px]">
                        <div>{tx.paymentMode}</div>
                        <div className="text-[10px] text-[#91918c]">{tx.referenceNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-[#103c25] font-bold">
                        {formatINR(tx.trustAccountAmount)}
                      </td>
                      <td className="py-3 px-4 text-right text-cyan-400 font-bold">
                        {formatINR(tx.fleetAccountAmount)}
                      </td>
                      <td className="py-3 px-4 text-right text-white font-black">
                        {formatINR(tx.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#103c25] border border-emerald-500/20">
                          {tx.settlementStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* Subtab 3: Maker-Checker Approval Protocol */}
      {activeSubTab === 'maker-checker' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Pending Fee Concession Approval (Maker-Checker Governance)
              </h3>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Awaiting Principal / Trustee OTP Sign-Off
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#f6f6f3] border border-[#dadad3] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div>
                  <span className="text-[#62625b]">Applicant: </span>
                  <strong className="text-white">Arjun Vardhan (Class 11 Commerce, Adm #DPA-2021-0677)</strong>
                </div>
                <div className="text-[#62625b]">
                  Parent: <span className="text-[#211922]">Ravi Vardhan (+91 98118 77654)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs border-y border-[#dadad3] py-3">
                <div>
                  <span className="text-[#62625b] block text-[11px]">Requested Concession:</span>
                  <span className="font-bold text-amber-300 text-sm">25% Sibling Concession</span>
                </div>
                <div>
                  <span className="text-[#62625b] block text-[11px]">Linked Sibling:</span>
                  <span className="font-semibold text-white">Ananya Vardhan (Class 7-B)</span>
                </div>
                <div>
                  <span className="text-[#62625b] block text-[11px]">Proposed Net Adjustment:</span>
                  <span className="font-bold text-[#103c25] text-sm">- ₹7,750 from Tuition Head</span>
                </div>
              </div>

              <p className="text-[11px] text-[#62625b]">
                Staff note from Fee Clerk: Verified birth certificates and admission ledger. Eligible under Trust Sibling Policy Rule 4.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                {makerCheckerApproved ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#103c25] bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concession Approved & Cryptographically Signed by Director</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => alert('Concession rejected. Reason logged to audit trail.')}
                      className="px-3.5 py-2 rounded-xl bg-[#e5e5e0] hover:bg-[#c8c8c1] text-[#33332e] text-xs font-semibold"
                    >
                      Reject Request
                    </button>
                    <button
                      id="maker-checker-approve-btn"
                      onClick={() => {
                        setMakerCheckerApproved(true);
                        confetti({ particleCount: 50, spread: 60 });
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Authorize with Director OTP</span>
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Modal with UPI QR & Preview */}
      {whatsappModalOpen && selectedDefaulter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-[#dadad3] shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#dadad3] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c7f0da] text-[#103c25] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">WhatsApp 1-Tap Payment Link</h4>
                  <p className="text-[11px] text-[#62625b]">Direct NPCI UPI String Generator</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="text-[#62625b] hover:text-[#000000] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Recipient Details */}
            <div className="p-3.5 rounded-xl bg-[#f6f6f3] border border-[#dadad3] space-y-1.5 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-[#62625b]">Student:</span>
                <span className="text-white font-bold">{selectedDefaulter.studentName} ({selectedDefaulter.className})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#62625b]">Parent Phone:</span>
                <span className="text-[#211922] font-mono">{selectedDefaulter.parentPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#62625b]">Total Dues (incl. late fine):</span>
                <span className="text-rose-400 font-black">{formatINR(selectedDefaulter.totalDue + selectedDefaulter.lateFine)}</span>
              </div>
            </div>

            {/* WhatsApp Message Preview */}
            <div className="mb-4">
              <span className="text-[10px] uppercase font-mono text-[#62625b] block mb-1.5">
                Simulated WhatsApp Message Payload:
              </span>
              <div className="p-3.5 rounded-xl bg-[#c7f0da]/30 border border-emerald-500/30 text-xs text-[#211922] font-sans space-y-2">
                <p>
                  🙏 Namaste Shri {selectedDefaulter.parentName},
                </p>
                <p>
                  This is a reminder regarding Q3 school fee dues for your ward <strong>{selectedDefaulter.studentName}</strong> ({selectedDefaulter.admissionNo}) at Delhi Public Academy.
                </p>
                <p className="font-semibold text-amber-300">
                  Total Outstanding: {formatINR(selectedDefaulter.totalDue + selectedDefaulter.lateFine)}
                </p>
                <p className="text-[11px] text-emerald-300">
                  Tap below to pay instantly via Google Pay, PhonePe, or Paytm without logging into the portal:
                </p>
                <div className="p-2 rounded bg-black/40 text-[10px] font-mono text-indigo-300 break-all select-all">
                  {selectedDefaulter.upiLink}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopyUpiLink(selectedDefaulter.upiLink)}
                className="flex-1 py-2.5 rounded-xl bg-[#e5e5e0] hover:bg-[#c8c8c1] text-[#211922] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#103c25]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'UPI Link Copied!' : 'Copy UPI Link'}</span>
              </button>
              <button
                id="modal-sim-pay-btn"
                onClick={() => handleSimulatePayment(selectedDefaulter)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Simulate Parent Paying</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
