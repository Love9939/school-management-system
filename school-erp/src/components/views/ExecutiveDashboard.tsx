'use client';

import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  IndianRupee, 
  Bus, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Send, 
  Sparkles,
  School,
  ArrowRight
} from 'lucide-react';
import { ActiveTab } from '../NavigationTabs';
import { SchoolCampus } from '../../types';

interface ExecutiveDashboardProps {
  campus: SchoolCampus;
  financeStats: {
    totalQuarterBilled: number;
    collectedTillDate: number;
    outstandingAmount: number;
    defaultersCount: number;
    collectionRate: number;
    trustAccountCollected: number;
    fleetAccountCollected: number;
  };
  absentCount: number;
  locWarningCount: number;
  onNavigateTab: (tab: ActiveTab) => void;
  onRunSubstitution: () => void;
  onTriggerFeeEscalation: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  campus,
  financeStats,
  absentCount,
  locWarningCount,
  onNavigateTab,
  onRunSubstitution,
  onTriggerFeeEscalation,
}) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Alert Bar */}
      <div className="glass-card rounded-2xl p-4 border-l-4 border-l-indigo-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Morning Operations Briefing (07:45 AM Automated Telemetry)
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Audit Synced
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Biometric check-in window closed. 3 staff absences detected; 4 timetable periods queued for auto-substitution. 
              ₹18.75 Lakhs pending in Q3 fee ledger.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            id="exec-run-sub-btn"
            onClick={onRunSubstitution}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Solve Morning Substitution ({absentCount})</span>
          </button>
          <button
            id="exec-send-whatsapp-btn"
            onClick={onTriggerFeeEscalation}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>WhatsApp Dues ({financeStats.defaultersCount})</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Fee Collection */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Q3 Total Collection</span>
            <span className="text-emerald-400 flex items-center font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {financeStats.collectionRate}%
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatINR(financeStats.collectedTillDate)}
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
            <span>Target: {formatINR(financeStats.totalQuarterBilled)}</span>
            <button 
              onClick={() => onNavigateTab('fees')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center"
            >
              Ledger <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
              style={{ width: `${financeStats.collectionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Overdue Defaulters */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Outstanding Defaulter Dues</span>
            <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
              {financeStats.defaultersCount} Students
            </span>
          </div>
          <div className="text-2xl font-black text-rose-300 tracking-tight">
            {formatINR(financeStats.outstandingAmount)}
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
            <span>1-Tap WhatsApp Recovery Active</span>
            <button 
              onClick={() => onNavigateTab('fees')}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center"
            >
              Recover <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '42%' }}></div>
          </div>
        </div>

        {/* Metric 3: Staff Biometric & Substitution */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Faculty Biometric Punch</span>
            <span className="text-amber-400 font-bold">95.6% On-Duty</span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-2">
            <span>65</span>
            <span className="text-xs font-normal text-slate-400">/ 68 Staff</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-amber-400 font-medium">3 Teacher Absences</span>
            <button 
              onClick={() => onNavigateTab('substitution')}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center"
            >
              Matrix <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full rounded-full" style={{ width: '95.6%' }}></div>
          </div>
        </div>

        {/* Metric 4: AIS-140 Student Safety */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>AIS-140 Bus Transit & RFID</span>
            <span className="text-emerald-400 font-bold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
              14 Buses Live
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            96.2%
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
            <span>524 RFID Door Taps Recorded</span>
            <button 
              onClick={() => onNavigateTab('transport')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center"
            >
              Fleet <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '96.2%' }}></div>
          </div>
        </div>

      </div>

      {/* Double-Entry Split Settlement Breakdown & Operational Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Cash Flow & Split Settlement Engine */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                Zero-Leakage Split Settlement & Tally Prime Sync
              </h3>
              <p className="text-xs text-slate-400">
                Incoming student payments are segregated in real-time into Trust and Fleet bank accounts.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Double-Entry Ledger Active
            </span>
          </div>

          {/* Split Account Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            
            {/* Account 1: Delhi Educational Trust */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 relative">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Account A: School Educational Trust</span>
                <span className="font-mono text-[10px] text-indigo-400">ICICI #91024</span>
              </div>
              <div className="text-xl font-extrabold text-white">
                {formatINR(financeStats.trustAccountCollected)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tuition, Computer & Science Lab, Exam & Library Fees. Direct credit.
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                <span>Tally Prime: SYNCED</span>
                <span>Audit: Ind AS 115</span>
              </div>
            </div>

            {/* Account 2: Fleet & Transport Logistics */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 relative">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Account B: Fleet Logistics & Commute</span>
                <span className="font-mono text-[10px] text-cyan-400">HDFC Escrow #44102</span>
              </div>
              <div className="text-xl font-extrabold text-cyan-300">
                {formatINR(financeStats.fleetAccountCollected)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                AIS-140 GPS, Fuel Surcharge, Driver Payroll & Bus Insurance fund.
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-cyan-400 font-mono">
                <span>Auto-Reconciled T+1</span>
                <span>Zero Commingling</span>
              </div>
            </div>

          </div>

          {/* Maker-Checker Governance Callout */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                MC
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Maker-Checker Protocol Enforced
                </h4>
                <p className="text-[11px] text-slate-400">
                  Any fee concession, sibling discount or receipt reversal requires dual OTP approval from Principal & Financial Trustee.
                </p>
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('fees')}
              className="text-xs font-semibold text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 transition-all whitespace-nowrap"
            >
              Review 3 Requests
            </button>
          </div>

        </div>

        {/* Right 1 Col: Statutory & Board Alerts */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Statutory Compliance Radar
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time validation against CBSE & Ministry of Education guidelines.
            </p>

            <div className="space-y-3">
              
              {/* UDISE+ Status */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">UDISE+ SDMIS Engine</div>
                  <div className="text-[10px] text-slate-400">1,840 / 1,840 Students Validated</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Export
                </span>
              </div>

              {/* APAAR ID */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">APAAR / DigiLocker Consent</div>
                  <div className="text-[10px] text-slate-400">Parental Digital Consent: 94.2%</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  NCrF Active
                </span>
              </div>

              {/* Class 10/12 LOC Alert */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    CBSE Board LOC Warning
                  </div>
                  <div className="text-[10px] text-slate-400">1 Candidate below 75% attendance</div>
                </div>
                <button 
                  onClick={() => onNavigateTab('compliance')}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40"
                >
                  Resolve
                </button>
              </div>

              {/* NEP 2020 HPC */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">NEP 2020 360° HPC</div>
                  <div className="text-[10px] text-slate-400">PARAKH Rubrics & AI Voice-to-Rubric</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Ready
                </span>
              </div>

            </div>
          </div>

          <button
            onClick={() => onNavigateTab('compliance')}
            className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-bold transition-all border border-indigo-500/30 flex items-center justify-center gap-1.5"
          >
            <span>Open CBSE Statutory Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Feature Showcase Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        <div 
          onClick={() => onNavigateTab('fees')}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer border border-white/5 hover:border-emerald-500/40"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">WhatsApp 1-Tap UPI Recovery</h4>
          <p className="text-xs text-slate-400 mt-1">
            Send dynamic UPI payment links straight to parent WhatsApp. Instant bank reconciliation without portal logins.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('nep-hpc')}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer border border-white/5 hover:border-purple-500/40"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">PARAKH 360° Holistic Card & AI</h4>
          <p className="text-xs text-slate-400 mt-1">
            Replaces static marksheets with multi-dimensional rubrics, voice-to-rubric AI notes, and NCrF credit tracking.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('substitution')}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer border border-white/5 hover:border-amber-500/40"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">7:30 AM Auto-Substitution Matrix</h4>
          <p className="text-xs text-slate-400 mt-1">
            Detects unannounced teacher absences at 7:45 AM and matches qualified free teachers with weekly burnout protection.
          </p>
        </div>

      </div>

    </div>
  );
};
