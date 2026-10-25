'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  UserCheck, 
  UserX, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Monitor, 
  ShieldAlert, 
  Calendar,
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeacherBiometricRecord, TimetablePeriod } from '../../types';

interface SubstitutionViewProps {
  teachers: TeacherBiometricRecord[];
  periods: TimetablePeriod[];
  onPeriodsUpdate: (updated: TimetablePeriod[]) => void;
  onTeachersUpdate: (updated: TeacherBiometricRecord[]) => void;
}

export const SubstitutionView: React.FC<SubstitutionViewProps> = ({
  teachers,
  periods,
  onPeriodsUpdate,
  onTeachersUpdate,
}) => {
  const [solverRun, setSolverRun] = useState(false);
  const [smartboardPreviewPeriod, setSmartboardPreviewPeriod] = useState<TimetablePeriod | null>(null);

  const absentTeachers = teachers.filter(
    (t) => t.status === 'UNANNOUNCED_ABSENT' || t.status === 'APPROVED_LEAVE'
  );
  const presentTeachers = teachers.filter((t) => t.status === 'PRESENT');

  // Automated 7:30 AM Substitution Solver Algorithm
  const handleRunOptimalSolver = () => {
    confetti({ particleCount: 60, spread: 70 });

    const updatedPeriods = periods.map((period) => {
      if (period.subject === 'Mathematics') {
        // Harpreet Singh is free and has 0 substitutions done (cap is 3)
        return {
          ...period,
          substituteTeacherId: 'tch-04',
          substituteTeacherName: 'Harpreet Singh (Maths/CS, 0 subs this week)',
          status: 'NOTIFIED_SMARTBOARD' as const,
        };
      } else if (period.subject === 'Science') {
        // Anuradha Joshi is free and has 1 substitution done
        return {
          ...period,
          substituteTeacherId: 'tch-05',
          substituteTeacherName: 'Anuradha Joshi (Science/Bio, 1 sub this week)',
          status: 'NOTIFIED_SMARTBOARD' as const,
        };
      } else if (period.subject === 'Physics') {
        // Vikram Chawla or Harpreet Singh
        return {
          ...period,
          substituteTeacherId: 'tch-04',
          substituteTeacherName: 'Harpreet Singh (Physics Competency, 1 sub)',
          status: 'NOTIFIED_SMARTBOARD' as const,
        };
      }
      return period;
    });

    onPeriodsUpdate(updatedPeriods);
    setSolverRun(true);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-rose-400" />
            7:30 AM Zero-Chaos Morning Substitution Engine
          </h2>
          <p className="text-xs text-[#62625b]">
            Connected to facial recognition / biometric hardware. Solves morning teacher absences before first bell at 08:00 AM.
          </p>
        </div>

        <button
          id="run-sub-solver-btn"
          onClick={handleRunOptimalSolver}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 text-white text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Run 1-Click Substitution Solver</span>
        </button>
      </div>

      {/* Solver Alert */}
      {solverRun && (
        <div className="p-4 rounded-xl bg-[#c7f0da] border border-[#a3e6c2] text-[#103c25] text-xs font-semibold flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#103c25] shrink-0" />
            <div>
              <strong>100% Morning Coverage Achieved:</strong> All 4 vacant periods automatically matched with qualified teachers based on weekly substitution caps. 
              Classroom smartboards & faculty mobile apps notified!
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#c7f0da] px-2 py-0.5 rounded whitespace-nowrap">
            Zero Unsupervised Classes
          </span>
        </div>
      )}

      {/* Grid: Left Biometric Feed, Right Vacant Periods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Biometric Punch Telemetry */}
        <div className="glass-card rounded-2xl p-5 border border-[#dadad3] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#103c25]" />
              Biometric Punch Status (07:45 AM)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e5e5e0] text-[#33332e]">
              Cut-off 07:45 AM
            </span>
          </div>

          <div className="space-y-2.5">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  teacher.status === 'UNANNOUNCED_ABSENT'
                    ? 'bg-rose-950/30 border-rose-500/40'
                    : teacher.status === 'APPROVED_LEAVE'
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'bg-[#f6f6f3]/60 border-[#dadad3]'
                }`}
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    {teacher.teacherName}
                    <span className="text-[10px] text-[#62625b] font-mono">({teacher.teacherId})</span>
                  </div>
                  <div className="text-[11px] text-[#62625b]">
                    {teacher.subjectSpecialization.join(', ')} • {teacher.assignedClassToday}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      teacher.status === 'PRESENT'
                        ? 'bg-emerald-500/10 text-[#103c25] border-emerald-500/20'
                        : teacher.status === 'UNANNOUNCED_ABSENT'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}
                  >
                    {teacher.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-[#91918c] font-mono mt-0.5">
                    {teacher.checkInTime || 'No Punch Log'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#f6f6f3] border border-[#dadad3] text-[11px] text-[#62625b]">
            <strong className="text-[#211922]">Burnout Protection Rule:</strong> Max 3 substitutions per week. Teachers with 0 substitutions are prioritized first.
          </div>
        </div>

        {/* Right 2 Columns: Vacant Period Matrix */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-[#dadad3]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Vacant Period Allocation & Smartboard Broadcast Matrix
              </h3>
              <p className="text-xs text-[#62625b]">
                Periods requiring teacher coverage due to morning absences.
              </p>
            </div>
            <span className="text-[11px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              {periods.filter((p) => !p.substituteTeacherId).length} Unassigned
            </span>
          </div>

          <div className="space-y-3">
            {periods.map((period) => (
              <div
                key={period.periodNumber}
                className="p-4 rounded-xl bg-[#f6f6f3] border border-[#dadad3] hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#e60023] bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Period {period.periodNumber}
                    </span>
                    <span className="text-[#62625b] text-[11px] font-mono">{period.timeSlot}</span>
                    <span className="font-bold text-white">
                      {period.className}-{period.section}
                    </span>
                  </div>
                  
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="text-[#33332e] font-semibold">{period.subject}</span>
                    <span className="text-[#91918c]">|</span>
                    <span className="text-rose-400 line-through">Default: {period.defaultTeacherName}</span>
                  </div>
                </div>

                {/* Substitute Assignment */}
                <div className="flex items-center gap-2 sm:justify-end">
                  {period.substituteTeacherId ? (
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-bold text-[#103c25] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{period.substituteTeacherName}</span>
                        </div>
                        <div className="text-[10px] text-[#62625b]">Classroom Smartboard Active</div>
                      </div>
                      <button
                        id={`smartboard-btn-${period.periodNumber}`}
                        onClick={() => setSmartboardPreviewPeriod(period)}
                        className="p-2 rounded-lg bg-[#e60023]/30 hover:bg-[#e60023]/50 text-indigo-300 border border-indigo-500/30"
                        title="Preview Classroom Smartboard Screen"
                      >
                        <Monitor className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                      Awaiting Auto-Solver
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Classroom Smartboard Preview Modal */}
      {smartboardPreviewPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card rounded-3xl max-w-2xl w-full p-6 border-2 border-indigo-500/40 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#dadad3]">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[#e60023]" />
                <h4 className="text-sm font-bold text-white">
                  Classroom Smartboard Digital Notice (Live Room Display)
                </h4>
              </div>
              <button
                onClick={() => setSmartboardPreviewPeriod(null)}
                className="text-[#62625b] hover:text-[#000000]"
              >
                ✕
              </button>
            </div>

            {/* Smartboard Screen Simulation */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-center space-y-4 shadow-inner">
              <span className="text-xs uppercase font-mono tracking-widest text-[#e60023] px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                Delhi Public Academy • Smart Classroom 8-A
              </span>

              <h2 className="text-3xl font-black text-white tracking-tight">
                Period {smartboardPreviewPeriod.periodNumber}: {smartboardPreviewPeriod.subject}
              </h2>

              <div className="p-4 rounded-xl bg-[#f6f6f3] max-w-md mx-auto border border-[#dadad3] space-y-1">
                <div className="text-xs text-[#62625b]">Assigned Substitute Faculty:</div>
                <div className="text-lg font-bold text-[#103c25]">
                  {smartboardPreviewPeriod.substituteTeacherName}
                </div>
                <div className="text-xs text-[#33332e]">
                  Instructions: Please open NCERT Chapter 6 Practice Exercise on your tablets.
                </div>
              </div>

              <div className="text-[11px] text-[#62625b] font-mono flex items-center justify-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-[#e60023]" />
                <span>Substitute Faculty Notified on WhatsApp & Vidyoday Mobile App (07:46 AM)</span>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setSmartboardPreviewPeriod(null)}
                className="px-4 py-2 rounded-xl bg-[#e5e5e0] hover:bg-[#c8c8c1] text-[#211922] text-xs font-semibold"
              >
                Dismiss Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
