'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  WalletCards, 
  FileCheck2, 
  Award, 
  Clock, 
  BusFront, 
  Database,
  Server
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'fees' 
  | 'compliance' 
  | 'nep-hpc' 
  | 'substitution' 
  | 'transport' 
  | 'architecture'
  | 'api';

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
      badgeColor: 'bg-[#fee2e2] text-[#cc001f] border-[#fecaca]',
    },
    {
      id: 'compliance' as ActiveTab,
      label: 'CBSE & Statutory Hub',
      icon: FileCheck2,
      badge: locWarningCount > 0 ? `${locWarningCount} Alert` : null,
      badgeColor: 'bg-[#fee2e2] text-[#cc001f] border-[#fecaca]',
    },
    {
      id: 'nep-hpc' as ActiveTab,
      label: 'NEP 2020 360° HPC',
      icon: Award,
      badge: 'PARAKH AI',
      badgeColor: 'bg-[#f6f6f3] text-[#211922] border-[#dadad3]',
    },
    {
      id: 'substitution' as ActiveTab,
      label: '7:30 AM Auto-Substitution',
      icon: Clock,
      badge: absentTeachersCount > 0 ? `${absentTeachersCount} Absent` : null,
      badgeColor: 'bg-[#fee2e2] text-[#cc001f] border-[#fecaca]',
    },
    {
      id: 'transport' as ActiveTab,
      label: 'AIS-140 GPS & RFID Safety',
      icon: BusFront,
      badge: 'Live',
      badgeColor: 'bg-[#c7f0da] text-[#103c25] border-[#a3e6c2]',
    },
    {
      id: 'architecture' as ActiveTab,
      label: 'DB Schema & RLS Audit',
      icon: Database,
      badge: null,
      badgeColor: null,
    },
    {
      id: 'api' as ActiveTab,
      label: 'Webhooks & Microservices',
      icon: Server,
      badge: 'Live APIs',
      badgeColor: 'bg-[#c7f0da] text-[#103c25] border-[#a3e6c2]',
    },
  ];

  return (
    <div className="w-full bg-white/95 border-b border-[#dadad3] px-4 lg:px-8 py-2.5 sticky top-0 z-40 backdrop-blur-md shadow-xs no-print">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#e60023] text-white shadow-sm ring-1 ring-[#cc001f]'
                  : 'bg-[#f6f6f3] text-[#33332e] border border-[#dadad3] hover:bg-[#e5e5e0] hover:text-[#000000]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#62625b]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : tab.badgeColor || 'bg-[#f6f6f3] text-[#33332e] border-[#dadad3]'
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
