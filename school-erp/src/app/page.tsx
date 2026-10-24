'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { NavigationTabs, ActiveTab } from '../components/NavigationTabs';
import { ExecutiveDashboard } from '../components/views/ExecutiveDashboard';
import { FeeManagementView } from '../components/views/FeeManagementView';
import { CbseComplianceView } from '../components/views/CbseComplianceView';
import { NepProgressCardView } from '../components/views/NepProgressCardView';
import { SubstitutionView } from '../components/views/SubstitutionView';
import { TransportSafetyView } from '../components/views/TransportSafetyView';
import { DatabaseSchemaView } from '../components/views/DatabaseSchemaView';

import { 
  CURRENT_CAMPUS, 
  MOCK_FINANCE_STATS, 
  MOCK_STUDENTS, 
  MOCK_FEE_DEFAULTERS, 
  MOCK_RECENT_TRANSACTIONS, 
  MOCK_BOARD_LOC_CANDIDATES, 
  MOCK_TEACHERS, 
  MOCK_MORNING_PERIODS, 
  MOCK_BUS_FLEET, 
  MOCK_RFID_TAPS, 
  MOCK_HPC_SAMPLE 
} from '../data/mock-school-data';

import { UserRole, FeeDefaulterRecord, FeeTransaction, BoardLocCandidate, TeacherBiometricRecord, TimetablePeriod, HolisticProgressCardData } from '../types';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // State data
  const [campus, setCampus] = useState(CURRENT_CAMPUS);
  const [financeStats, setFinanceStats] = useState(MOCK_FINANCE_STATS);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [defaulters, setDefaulters] = useState<FeeDefaulterRecord[]>(MOCK_FEE_DEFAULTERS);
  const [transactions, setTransactions] = useState<FeeTransaction[]>(MOCK_RECENT_TRANSACTIONS);
  const [candidates, setCandidates] = useState<BoardLocCandidate[]>(MOCK_BOARD_LOC_CANDIDATES);
  const [teachers, setTeachers] = useState<TeacherBiometricRecord[]>(MOCK_TEACHERS);
  const [periods, setPeriods] = useState<TimetablePeriod[]>(MOCK_MORNING_PERIODS);
  const [fleet, setFleet] = useState(MOCK_BUS_FLEET);
  const [rfidLogs, setRfidLogs] = useState(MOCK_RFID_TAPS);
  const [hpcData, setHpcData] = useState<HolisticProgressCardData>(MOCK_HPC_SAMPLE);

  // Quick 7:30 AM simulation trigger
  const handleQuickMorningSimulate = () => {
    setActiveTab('substitution');
  };

  const handleNewTransaction = (newTx: FeeTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    setFinanceStats((prev) => ({
      ...prev,
      collectedTillDate: prev.collectedTillDate + newTx.amount,
      outstandingAmount: Math.max(0, prev.outstandingAmount - newTx.amount),
      trustAccountCollected: prev.trustAccountCollected + newTx.trustAccountAmount,
      fleetAccountCollected: prev.fleetAccountCollected + newTx.fleetAccountAmount,
      defaultersCount: Math.max(0, prev.defaultersCount - 1),
    }));
  };

  const absentTeachersCount = teachers.filter(
    (t) => t.status === 'UNANNOUNCED_ABSENT' || t.status === 'APPROVED_LEAVE'
  ).length;

  const locWarningCount = candidates.filter((c) => !c.locReady).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      
      {/* Top Application Header */}
      <Header
        campus={campus}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onQuickSimulate={handleQuickMorningSimulate}
      />

      {/* Main Tab Navigation */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        defaultersCount={defaulters.filter((d) => d.status === 'PENDING').length}
        locWarningCount={locWarningCount}
        absentTeachersCount={absentTeachersCount}
      />

      {/* Active Tab View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {activeTab === 'overview' && (
          <ExecutiveDashboard
            campus={campus}
            financeStats={financeStats}
            absentCount={absentTeachersCount}
            locWarningCount={locWarningCount}
            onNavigateTab={setActiveTab}
            onRunSubstitution={() => setActiveTab('substitution')}
            onTriggerFeeEscalation={() => setActiveTab('fees')}
          />
        )}

        {activeTab === 'fees' && (
          <FeeManagementView
            defaulters={defaulters}
            transactions={transactions}
            onDefaultersUpdate={setDefaulters}
            onNewTransaction={handleNewTransaction}
          />
        )}

        {activeTab === 'compliance' && (
          <CbseComplianceView
            campus={campus}
            candidates={candidates}
            students={students}
            onCandidatesUpdate={setCandidates}
          />
        )}

        {activeTab === 'nep-hpc' && (
          <NepProgressCardView
            campus={campus}
            hpcData={hpcData}
            onUpdateHpc={setHpcData}
          />
        )}

        {activeTab === 'substitution' && (
          <SubstitutionView
            teachers={teachers}
            periods={periods}
            onPeriodsUpdate={setPeriods}
            onTeachersUpdate={setTeachers}
          />
        )}

        {activeTab === 'transport' && (
          <TransportSafetyView
            fleet={fleet}
            rfidLogs={rfidLogs}
          />
        )}

        {activeTab === 'architecture' && (
          <DatabaseSchemaView />
        )}

      </main>

      {/* Sticky Global System Health Bar */}
      <footer className="mt-auto border-t border-white/5 py-4 px-4 lg:px-8 bg-slate-950/80 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">Vidyoday CBSE ERP Core v2.4</span>
            <span className="text-slate-600">|</span>
            <span>NEP 2020 & NCrF Aligned</span>
            <span className="text-slate-600">|</span>
            <span>Tally Prime Double-Entry Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>UDISE+ Schema: 2025.2</span>
            <span>AIS-140 GPS: Active</span>
            <span>DPDP Consent: Encrypted</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
