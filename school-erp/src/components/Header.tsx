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
      color: 'bg-[#fee2e2] text-[#cc001f] border-[#fecaca]',
      desc: 'Executive P&L, Cashflow, Governance'
    },
    PRINCIPAL: { 
      title: 'Principal / Director', 
      color: 'bg-[#f6f6f3] text-[#000000] border-[#dadad3]',
      desc: 'Academic Operations & Faculty Oversight'
    },
    ACCOUNTANT: { 
      title: 'Chief Fee Controller', 
      color: 'bg-[#c7f0da] text-[#103c25] border-[#a3e6c2]',
      desc: 'Double-Entry Ledger & WhatsApp Recovery'
    },
    EXAM_HEAD: { 
      title: 'CBSE Exam Cell In-Charge', 
      color: 'bg-[#f6f6f3] text-[#211922] border-[#dadad3]',
      desc: 'UDISE+, APAAR ID, LOC Validation'
    },
    TRANSPORT_HEAD: { 
      title: 'Transport & Safety Head', 
      color: 'bg-[#f6f6f3] text-[#33332e] border-[#dadad3]',
      desc: 'AIS-140 GPS & RFID Door Taps'
    },
  };

  return (
    <header className="bg-white border-b border-[#dadad3] px-4 lg:px-8 py-3.5 no-print shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & School Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#fee2e2] flex items-center justify-center text-[#e60023] shadow-sm">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-[#000000] flex items-center gap-2">
                {campus.name}
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#f6f6f3] text-[#33332e] border border-[#dadad3]">
                  CBSE Affil #{campus.affiliationNumber}
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#62625b] flex items-center gap-2 mt-0.5">
              <span>UDISE+ Code: <strong className="text-[#000000] font-mono">{campus.udiseSchoolCode}</strong></span>
              <span className="text-[#dadad3]">•</span>
              <span>Academic Year: <strong className="text-[#e60023]">{campus.academicYear}</strong></span>
              <span className="text-[#dadad3]">•</span>
              <span className="text-[#103c25] font-semibold flex items-center gap-1 bg-[#c7f0da] px-2 py-0.5 rounded-full text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#103c25] animate-pulse"></span>
                Govt Sync Online
              </span>
            </p>
          </div>
        </div>

        {/* Live Hardware Telemetry & Role Switcher */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Hardware Heartbeat Pills */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f6f6f3] border border-[#dadad3] text-xs text-[#33332e]">
            <div className="flex items-center gap-1.5 font-medium" title="AIS-140 GPS Device Gateway">
              <span className="w-2 h-2 rounded-full bg-[#103c25]"></span>
              <span className="text-[11px] font-mono">AIS-140: 14/14</span>
            </div>
            <span className="text-[#dadad3]">|</span>
            <div className="flex items-center gap-1.5 font-medium" title="Biometric Attendance Gateway">
              <UserCheck className="w-3.5 h-3.5 text-[#e60023]" />
              <span className="text-[11px] font-mono">Biometric: 7:45 AM</span>
            </div>
            <span className="text-[#dadad3]">|</span>
            <div className="flex items-center gap-1.5 font-medium" title="Tally Prime Direct Sync">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#103c25]" />
              <span className="text-[11px] font-mono">Tally: Live</span>
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <button 
            id="quick-morning-sim-btn"
            onClick={onQuickSimulate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Simulate 7:30 AM Morning Trigger"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Morning 7:30 AM Sim</span>
          </button>

          {/* Role Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 pl-3.5 pr-2.5 py-1.5 rounded-2xl bg-[#f6f6f3] border border-[#dadad3] text-xs text-[#33332e]">
              <span className="text-[#62625b] font-medium">Viewing as:</span>
              <div className="relative">
                <select
                  id="user-role-select"
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="appearance-none bg-transparent pr-6 text-xs font-bold text-[#000000] focus:outline-none cursor-pointer"
                >
                  <option value="OWNER" className="bg-white text-black">👑 School Trustee / Owner</option>
                  <option value="PRINCIPAL" className="bg-white text-black">🎓 Principal / Academic Director</option>
                  <option value="ACCOUNTANT" className="bg-white text-black">💰 Head of Accounts &amp; Fees</option>
                  <option value="EXAM_HEAD" className="bg-white text-black">📋 CBSE Exam Cell &amp; LOC</option>
                  <option value="TRANSPORT_HEAD" className="bg-white text-black">🚌 Transport &amp; Safety Head</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#62625b] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
