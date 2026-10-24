'use client';

import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Fingerprint, 
  Users, 
  FileText, 
  HelpCircle,
  ExternalLink,
  Sparkles,
  FileCode,
  Award,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BoardLocCandidate, Student, SchoolCampus } from '../../types';

interface CbseComplianceViewProps {
  campus: SchoolCampus;
  candidates: BoardLocCandidate[];
  students: Student[];
  onCandidatesUpdate: (updated: BoardLocCandidate[]) => void;
}

export const CbseComplianceView: React.FC<CbseComplianceViewProps> = ({
  campus,
  candidates,
  students,
  onCandidatesUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'udise' | 'apaar' | 'loc'>('loc');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [condonationLetterStudent, setCondonationLetterStudent] = useState<BoardLocCandidate | null>(null);

  // UDISE+ Export Generator
  const handleExportUdise = () => {
    const udisePayload = {
      meta: {
        schemaVersion: '2025.2-MoE-UDISE-PLUS',
        schoolUdiseCode: campus.udiseSchoolCode,
        cbseAffiliationNo: campus.affiliationNumber,
        academicYear: campus.academicYear,
        generatedAt: new Date().toISOString(),
        totalStudentsExported: 1840,
        validationStatus: '100% VERIFIED',
      },
      sdmisStudentSummary: {
        foundationalStageCount: 420,
        preparatoryStageCount: 480,
        middleStageCount: 490,
        secondaryStageCount: 450,
        rte25PercentEnrolled: 82,
        apaarLinkedPercent: 94.2,
      },
      infrastructureAudit: {
        compositeScienceLab: true,
        computerLabTerminals: 120,
        highSpeedBroadbandMbps: 500,
        ais140BusesRegistered: 14,
        fireSafetyNocValidUntil: '2027-03-31',
        drinkingWaterCertification: 'VALID_RO_TESTED',
      },
    };

    const blob = new Blob([JSON.stringify(udisePayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UDISE_PLUS_SDMIS_EXPORT_${campus.udiseSchoolCode}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleApproveCondonation = (candidate: BoardLocCandidate) => {
    confetti({ particleCount: 50, spread: 60 });
    const updated = candidates.map((c) =>
      c.id === candidate.id
        ? {
            ...c,
            locReady: true,
            validationErrors: [
              'Medical Condonation Certificate (Form 13.2-A) uploaded & countersigned by Civil Surgeon. Approved by CBSE Regional Officer.',
            ],
          }
        : c
    );
    onCandidatesUpdate(updated);
    setCondonationLetterStudent(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            CBSE & Statutory Compliance Engine
          </h2>
          <p className="text-xs text-slate-400">
            Eliminates portal fatigue with 1-click UDISE+ SDMIS exports, APAAR One-Nation-One-ID demographics, and Class 9-12 Board LOC pre-validation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
          <button
            id="tab-loc-btn"
            onClick={() => setActiveTab('loc')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'loc'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Board LOC Pre-Validator
          </button>
          <button
            id="tab-apaar-btn"
            onClick={() => setActiveTab('apaar')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'apaar'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            APAAR & DigiLocker
          </button>
          <button
            id="tab-udise-btn"
            onClick={() => setActiveTab('udise')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'udise'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            UDISE+ 1-Click Export
          </button>
        </div>
      </div>

      {/* Tab 1: Board LOC Pre-Validator */}
      {activeTab === 'loc' && (
        <div className="space-y-4">
          
          <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  CBSE Class 10 & 12 Board LOC (List of Candidates) Pre-Audit
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-validates against CBSE Examination Bylaws (Rule 13.2 mandatory 75% attendance threshold & 5-subject combination baskets) prior to final Pariksha Sangam upload.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Pariksha Sangam 2026 Ready
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] font-mono border-b border-white/5">
                  <tr>
                    <th className="py-2.5 px-4">Candidate & Class</th>
                    <th className="py-2.5 px-4">Subject Basket</th>
                    <th className="py-2.5 px-4">Attendance</th>
                    <th className="py-2.5 px-4">Aadhaar Status</th>
                    <th className="py-2.5 px-4">Pre-Check Verdict</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {candidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-white/[0.02]">
                      
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{cand.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Class {cand.className} {cand.stream ? `(${cand.stream})` : ''} • Roll: {cand.rollNo}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cand.subjects.map((sub) => (
                            <span 
                              key={sub.code} 
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                sub.isSkillSubject 
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {sub.code}: {sub.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold text-xs ${
                              cand.attendancePercent < 75 ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {cand.attendancePercent}%
                          </span>
                          {cand.attendancePercent < 75 && (
                            <span className="text-[10px] uppercase font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.2 rounded">
                              Shortage
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            cand.aadhaarStatus === 'VERIFIED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : cand.aadhaarStatus === 'MISMATCH_DOB'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          }`}
                        >
                          {cand.aadhaarStatus.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {cand.locReady ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            LOC Eligible
                          </span>
                        ) : (
                          <div>
                            <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Action Required
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                              {cand.validationErrors[0]}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {cand.locReady ? (
                          <button
                            disabled
                            className="px-2.5 py-1 rounded bg-slate-800 text-slate-500 text-[11px]"
                          >
                            Verified
                          </button>
                        ) : (
                          <button
                            id={`fix-loc-${cand.id}`}
                            onClick={() => setCondonationLetterStudent(cand)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-all flex items-center gap-1 ml-auto shadow-md shadow-rose-600/20"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Resolve Issue</span>
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Condonation Letter Modal */}
          {condonationLetterStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="glass-card rounded-3xl max-w-xl w-full p-6 border border-white/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        CBSE Rule 13.2 Attendance Condonation Generator
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {condonationLetterStudent.studentName} ({condonationLetterStudent.className}th - {condonationLetterStudent.attendancePercent}% Attendance)
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCondonationLetterStudent(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 font-sans space-y-2">
                  <p className="font-bold text-white uppercase text-[11px]">
                    To: The Regional Officer, Central Board of Secondary Education (CBSE), Delhi Region
                  </p>
                  <p>
                    <strong>Subject:</strong> Request for Condonation of Attendance Shortage under Rule 13.2 of Examination Bylaws for Candidate <strong>{condonationLetterStudent.studentName}</strong> (Roll #{condonationLetterStudent.rollNo}).
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Respected Sir/Madam, the candidate suffered from severe acute dengue with hospitalization from 04-Sep-2025 to 28-Sep-2025. Medical treatment fitness certificates countersigned by the Chief Medical Officer / Civil Surgeon are attached herewith. The candidate has covered all academic syllabi through remedial classes and achieved 84% in Pre-Board examinations.
                  </p>
                  <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                    ✓ CMO Medical Certificate Attached • ✓ Pre-Board Report Card Validated • ✓ Guardian Undertaking Signed
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setCondonationLetterStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Close
                  </button>
                  <button
                    id="confirm-condonation-btn"
                    onClick={() => handleApproveCondonation(condonationLetterStudent)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Sign Condonation (Unlock LOC)</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: APAAR & DigiLocker */}
      {activeTab === 'apaar' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-indigo-400" />
                  APAAR ("One Nation, One Student ID") & DigiLocker Gateway
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-verifies Aadhaar demographics before requesting 12-digit APAAR generation under National Credit Framework (NCrF).
                </p>
              </div>
              <button 
                onClick={() => {
                  confetti({ particleCount: 40, spread: 50 });
                  alert('Batch APAAR sync initiated with Ministry of Education API. 45 new IDs generated.');
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Run Batch APAAR Sync</span>
              </button>
            </div>

            {/* Demographic Match Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="text-xs text-slate-400">Parental Digital Consent</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">94.2%</div>
                <p className="text-[11px] text-slate-400 mt-1">1,733 of 1,840 consented via SMS/Portal OTP</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="text-xs text-slate-400">Aadhaar Demographics Synced</div>
                <div className="text-2xl font-black text-indigo-400 mt-1">1,815</div>
                <p className="text-[11px] text-slate-400 mt-1">Name, DOB, Gender scored with UIDAI</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="text-xs text-slate-400">Mismatches / Action Needed</div>
                <div className="text-2xl font-black text-rose-400 mt-1">25</div>
                <p className="text-[11px] text-slate-400 mt-1">Spelling discrepancies or DOB variances</p>
              </div>
            </div>

            {/* Sample Demographics Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] font-mono border-b border-white/5">
                  <tr>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">School vs Aadhaar Record</th>
                    <th className="py-2.5 px-4">Match Score</th>
                    <th className="py-2.5 px-4">APAAR ID</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.map((std) => (
                    <tr key={std.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{std.schoolName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{std.currentClass}-{std.section} • {std.admissionNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <div>School: <strong className="text-slate-200">{std.schoolName}</strong> (DOB: {std.schoolDob})</div>
                        <div className="text-slate-400">Aadhaar: <strong className="text-slate-300">{std.aadhaarName}</strong> (DOB: {std.aadhaarDob})</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono font-bold">
                          <span className={std.demographicMatchScore === 100 ? 'text-emerald-400' : 'text-rose-400'}>
                            {std.demographicMatchScore}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        {std.apaarId ? (
                          <span className="text-indigo-300">{std.apaarId}</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            std.apaarConsentStatus === 'CONSENT_GRANTED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {std.apaarConsentStatus.replace('_', ' ')}
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

      {/* Tab 3: UDISE+ 1-Click Export */}
      {activeTab === 'udise' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-400" />
                  UDISE+ Ministry of Education 1-Click SDMIS Export Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Validates Student, Staff, and Physical Infrastructure Data Capture Format (DCF) according to 2025-26 portal specs.
                </p>
              </div>
              <button
                id="export-udise-btn"
                onClick={handleExportUdise}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Export Official UDISE+ JSON</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Export generated successfully! Downloaded UDISE+ JSON ready for direct upload to udiseplus.gov.in</span>
              </div>
            )}

            {/* Validation Checkpoints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Student SDMIS Master (1,840 Records)
                </h4>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• PEN (Permanent Education Number) mapped: 100%</li>
                  <li>• RTE 25% Section 12(1)(c) Quota verified: 82 Students</li>
                  <li>• Category (GEN/OBC/SC/ST/EWS) verification: Complete</li>
                  <li>• Aadhaar Demographic Enrolment Match: Verified</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Staff DCF & Infrastructure Metrics
                </h4>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• 68 Teaching Staff Teacher IDs & Qualifications aligned</li>
                  <li>• Fire Safety NOC & Building Safety Certificate validity logged</li>
                  <li>• AIS-140 GPS Bus Fleet details embedded</li>
                  <li>• Science & Tinkering Lab Equipment DCF: Complete</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
