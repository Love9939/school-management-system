'use client';

import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  Wifi, 
  UserCheck, 
  FileSpreadsheet, 
  ChevronDown,
  Bell,
  Sparkles,
  School
} from 'lucide-react';
import { UserRole, SchoolCampus } from '../types';

interface HeaderProps {
  campus: SchoolCampus;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onQuickSimulate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  campus,
  currentRole,
  onRoleChange,
  onQuickSimulate,
}) => {
  const roleLabels: Record<UserRole, { title: string; color: string; desc: string }> = {
    OWNER: { 
      title: 'School Trustee / Owner', 
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      desc: 'Executive P&L, Cashflow, Governance'
    },
    PRINCIPAL: { 
      title: 'Principal / Director', 
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      desc: 'Academic Operations & Faculty Oversight'
    },
    ACCOUNTANT: { 
      title: 'Chief Fee Controller', 
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      desc: 'Double-Entry Ledger & WhatsApp Recovery'
    },
    EXAM_HEAD: { 
      title: 'CBSE Exam Cell In-Charge', 
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      desc: 'UDISE+, APAAR ID, LOC Validation'
    },
    TRANSPORT_HEAD: { 
      title: 'Transport & Safety Head', 
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      desc: 'AIS-140 GPS & RFID Door Taps'
    },
  };

  return (
    <header className="glass-card border-b border-white/10 px-4 lg:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & School Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/20">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {campus.name}
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  CBSE Affil #{campus.affiliationNumber}
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>UDISE+ Code: <strong className="text-slate-300 font-mono">{campus.udiseSchoolCode}</strong></span>
              <span>•</span>
              <span>Academic Year: <strong className="text-indigo-400">{campus.academicYear}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Govt Sync Online
              </span>
            </p>
          </div>
        </div>

        {/* Live Hardware Telemetry & Role Switcher */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Hardware Heartbeat Pills */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300" title="AIS-140 GPS Device Gateway">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono">AIS-140: 14/14</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300" title="Biometric Attendance Gateway">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-mono">Biometric: 7:45 AM</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300" title="Tally Prime Direct Sync">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-mono">Tally: Live</span>
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <button 
            id="quick-morning-sim-btn"
            onClick={onQuickSimulate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-500/20 active:scale-95"
            title="Simulate 7:30 AM Morning Trigger"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Morning 7:30 AM Sim</span>
          </button>

          {/* Role Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs">
              <span className="text-slate-400 font-medium">Viewing as:</span>
              <div className="relative">
                <select
                  id="user-role-select"
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="appearance-none bg-transparent pr-6 text-xs font-bold text-indigo-300 focus:outline-none cursor-pointer"
                >
                  <option value="OWNER" className="bg-slate-900 text-white">👑 School Trustee / Owner</option>
                  <option value="PRINCIPAL" className="bg-slate-900 text-white">🎓 Principal / Academic Director</option>
                  <option value="ACCOUNTANT" className="bg-slate-900 text-white">💰 Head of Accounts & Fees</option>
                  <option value="EXAM_HEAD" className="bg-slate-900 text-white">📋 CBSE Exam Cell & LOC</option>
                  <option value="TRANSPORT_HEAD" className="bg-slate-900 text-white">🚌 Transport & Safety Head</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
