'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  WalletCards, 
  FileCheck2, 
  Award, 
  Clock, 
  BusFront, 
  Database
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'fees' 
  | 'compliance' 
  | 'nep-hpc' 
  | 'substitution' 
  | 'transport' 
  | 'architecture';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  defaultersCount: number;
  locWarningCount: number;
  absentTeachersCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  defaultersCount,
  locWarningCount,
  absentTeachersCount,
}) => {
  const tabs = [
    {
      id: 'overview' as ActiveTab,
      label: 'Executive Cockpit',
      icon: LayoutDashboard,
      badge: null,
      color: 'indigo',
    },
    {
      id: 'fees' as ActiveTab,
      label: 'Fee Ledger & 1-Tap UPI',
      icon: WalletCards,
      badge: defaultersCount > 0 ? `${defaultersCount} Dues` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'compliance' as ActiveTab,
      label: 'CBSE & Statutory Hub',
      icon: FileCheck2,
      badge: locWarningCount > 0 ? `${locWarningCount} Alert` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'nep-hpc' as ActiveTab,
      label: 'NEP 2020 360° HPC',
      icon: Award,
      badge: 'PARAKH AI',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'substitution' as ActiveTab,
      label: '7:30 AM Auto-Substitution',
      icon: Clock,
      badge: absentTeachersCount > 0 ? `${absentTeachersCount} Absent` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'transport' as ActiveTab,
      label: 'AIS-140 GPS & RFID Safety',
      icon: BusFront,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'architecture' as ActiveTab,
      label: 'DB Schema & RLS Audit',
      icon: Database,
      badge: null,
      badgeColor: null,
    },
  ];

  return (
    <div className="w-full bg-slate-900/90 border-b border-white/10 px-4 lg:px-8 py-2 sticky top-0 z-40 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                    tab.badgeColor || 'bg-white/10 text-slate-200 border-white/20'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
