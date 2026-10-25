'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Mic, 
  Printer, 
  CheckCircle2, 
  User, 
  Heart, 
  Brain, 
  MessageSquare, 
  Palette, 
  Activity, 
  QrCode, 
  ShieldCheck, 
  Calendar,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HolisticProgressCardData, SchoolCampus } from '../../types';

interface NepProgressCardViewProps {
  campus: SchoolCampus;
  hpcData: HolisticProgressCardData;
  onUpdateHpc: (updated: HolisticProgressCardData) => void;
}

export const NepProgressCardView: React.FC<NepProgressCardViewProps> = ({
  campus,
  hpcData,
  onUpdateHpc,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [aiVoiceProcessed, setAiVoiceProcessed] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  const domainIcons: Record<string, any> = {
    'Physical & Motor Development': Activity,
    'Socio-Emotional & Ethical Development': Heart,
    'Cognitive & Mathematical Inquiry': Brain,
    'Language, Literacy & Communication': MessageSquare,
    'Aesthetic & Cultural Expression': Palette,
  };

  const scoreLabels: Record<number, { text: string; color: string }> = {
    1: { text: 'Beginning (L1)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    2: { text: 'Progressing (L2)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    3: { text: 'Proficient (L3)', color: 'text-[#e60023] bg-indigo-500/10 border-indigo-500/30' },
    4: { text: 'Exemplary (L4)', color: 'text-[#103c25] bg-emerald-500/10 border-emerald-500/30' },
  };

  const handleSimulateVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setAiVoiceProcessed(true);
      confetti({ particleCount: 40, spread: 60 });

      // Upgrade Cognitive domain score from 3 to 4 based on AI analysis
      const updatedDomains = hpcData.domains.map((d) => {
        if (d.domainName.includes('Cognitive')) {
          return {
            ...d,
            score: 4,
            teacherNotes:
              d.teacherNotes +
              ' [AI Voice Note]: Demonstrated exceptional critical thinking during hands-on geometry measurement. Mentored peer group effortlessly.',
          };
        }
        return d;
      });

      onUpdateHpc({
        ...hpcData,
        domains: updatedDomains,
      });

      setTimeout(() => setAiVoiceProcessed(false), 5000);
    }, 2000);
  };

  const handleScoreChange = (domainIndex: number, newScore: number) => {
    const updatedDomains = [...hpcData.domains];
    updatedDomains[domainIndex] = {
      ...updatedDomains[domainIndex],
      score: newScore,
    };
    onUpdateHpc({
      ...hpcData,
      domains: updatedDomains,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* View Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            NEP 2020 360° Holistic Progress Card (HPC) Studio
          </h2>
          <p className="text-xs text-[#62625b]">
            CBSE PARAKH-aligned multi-stakeholder assessment: Teacher Rubrics, AI Voice-to-Rubric, Peer Reviews, and Parent Reflections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* AI Voice-to-Rubric Button */}
          <button
            id="voice-rubric-btn"
            onClick={handleSimulateVoiceRecording}
            disabled={isRecording}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isRecording ? 'Listening & Transcribing...' : 'AI Voice-to-Rubric'}</span>
          </button>

          {/* Print / Export Report Card */}
          <button
            id="print-hpc-btn"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-[#e5e5e0] hover:bg-[#c8c8c1] text-[#211922] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#dadad3]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official HPC</span>
          </button>
        </div>
      </div>

      {/* AI Voice Processing Success Alert */}
      {aiVoiceProcessed && (
        <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-lg no-print">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <div>
            <strong>AI Voice Note Processed:</strong> "Aarav demonstrated exceptional critical thinking during hands-on geometry measurement. Mentored peer group effortlessly."
            <span className="block text-[11px] text-purple-300">
              Categorized under Cognitive & Mathematical Inquiry. Score updated to Level 4 (Exemplary).
            </span>
          </div>
        </div>
      )}

      {/* Student Banner Card */}
      <div className="glass-card rounded-2xl p-5 border border-[#dadad3] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-purple-400/30">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{hpcData.studentName}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                APAAR: {hpcData.apaarId}
              </span>
            </div>
            <p className="text-xs text-[#62625b]">
              {hpcData.className} • Admission #{hpcData.admissionNo} • Academic Year {hpcData.academicYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-[#f6f6f3] border border-[#dadad3]">
            <span className="text-[#62625b] block text-[10px]">NCrF Notional Hours</span>
            <span className="text-[#103c25] font-bold">{hpcData.notionalLearningHours} / 1200 hrs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#f6f6f3] border border-[#dadad3]">
            <span className="text-[#62625b] block text-[10px]">PARAKH Credit Points</span>
            <span className="text-[#e60023] font-bold">{hpcData.parakhCreditPoints} Points</span>
          </div>
        </div>
      </div>

      {/* 5 PARAKH Holistic Domains Evaluation Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          PARAKH 5 Developmental Dimensions (Holistic Rubrics)
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {hpcData.domains.map((domain, idx) => {
            const Icon = domainIcons[domain.domainName] || Award;
            const scoreInfo = scoreLabels[domain.score] || scoreLabels[3];

            return (
              <div key={domain.domainName} className="glass-card rounded-2xl p-5 border border-[#dadad3]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{domain.domainName}</h4>
                      <p className="text-[11px] text-[#62625b]">Continuous observation rubrics & competency milestones</p>
                    </div>
                  </div>

                  {/* Level Selector */}
                  <div className="flex items-center gap-1.5 no-print">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        id={`domain-${idx}-score-${level}`}
                        onClick={() => handleScoreChange(idx, level)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          domain.score === level
                            ? 'bg-purple-600 text-white shadow ring-1 ring-purple-400'
                            : 'bg-[#e5e5e0] text-[#62625b] hover:text-[#000000]'
                        }`}
                      >
                        L{level}
                      </button>
                    ))}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ml-2 ${scoreInfo.color}`}>
                      {scoreInfo.text}
                    </span>
                  </div>
                </div>

                {/* Descriptors */}
                <div className="space-y-1.5 mb-3 bg-[#f6f6f3]/60 p-3 rounded-xl border border-[#dadad3]">
                  <span className="text-[10px] uppercase font-mono text-[#62625b] block mb-1">
                    Observed Competency Indicators:
                  </span>
                  {domain.descriptors.map((desc, dIdx) => (
                    <div key={dIdx} className="text-xs text-[#33332e] flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#103c25] shrink-0 mt-0.5" />
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>

                {/* Teacher Qualitative Note */}
                <div className="text-xs text-[#62625b] bg-purple-950/20 p-2.5 rounded-xl border border-purple-500/20">
                  <strong className="text-purple-300">Teacher Narrative: </strong>
                  {domain.teacherNotes}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 360° Multi-Stakeholder Triangulation: Peer, Parent & Self Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Peer Assessment */}
        <div className="glass-card rounded-2xl p-5 border border-[#dadad3]">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white">Peer Reflection (Sahapathi)</h4>
          </div>
          <div className="p-3 rounded-xl bg-[#f6f6f3] border border-[#dadad3] space-y-2 text-xs">
            <div className="text-[11px] text-cyan-300 font-semibold">{hpcData.peerReview.peerName}</div>
            <p className="text-[#33332e] italic text-[11px]">"{hpcData.peerReview.comment}"</p>
            <div className="text-[10px] text-[#103c25] font-mono">Verdict: {hpcData.peerReview.rating}</div>
          </div>
        </div>

        {/* Parent Reflection */}
        <div className="glass-card rounded-2xl p-5 border border-[#dadad3]">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-white">Parent Reflection (Abhibhavak)</h4>
          </div>
          <div className="p-3 rounded-xl bg-[#f6f6f3] border border-[#dadad3] space-y-2 text-xs">
            <p className="text-[#33332e] text-[11px]">"{hpcData.parentReflection.parentNotes}"</p>
            <div className="text-[10px] text-[#62625b]">
              Strengths: <span className="text-rose-300">{hpcData.parentReflection.strengthsObservedAtHome}</span>
            </div>
            <div className="text-[10px] text-[#91918c] font-mono">Signed on: {hpcData.parentReflection.signatureDate}</div>
          </div>
        </div>

        {/* Student Self-Evaluation */}
        <div className="glass-card rounded-2xl p-5 border border-[#dadad3]">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white">Student Self-Reflection (Swam-Mulyankan)</h4>
          </div>
          <div className="p-3 rounded-xl bg-[#f6f6f3] border border-[#dadad3] space-y-1.5 text-xs">
            <div className="text-[11px]">
              <span className="text-[#62625b] block text-[10px]">What I am proud of:</span>
              <span className="text-amber-300 font-medium">"{hpcData.studentSelfEvaluation.iAmProudOf}"</span>
            </div>
            <div className="text-[11px]">
              <span className="text-[#62625b] block text-[10px]">What I want to improve:</span>
              <span className="text-[#33332e]">"{hpcData.studentSelfEvaluation.iWantToImprove}"</span>
            </div>
          </div>
        </div>

      </div>

      {/* Official CBSE Printable Certificate Footer Preview */}
      <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-300 space-y-4 print-only">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-black uppercase text-indigo-900 tracking-wider">
              {campus.name}
            </h2>
            <p className="text-xs text-[#dadad3]">
              CBSE Affiliation No: {campus.affiliationNumber} | UDISE+ Code: {campus.udiseSchoolCode}
            </p>
            <p className="text-xs font-bold text-indigo-700 mt-1">
              PARAKH 360-DEGREE HOLISTIC PROGRESS CARD (NEP 2020)
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-slate-700">APAAR ID: {hpcData.apaarId}</div>
            <div className="text-[10px] text-[#91918c]">Academic Year: {hpcData.academicYear}</div>
            <div className="text-[10px] text-emerald-700 font-bold">NCrF Verified • 40 Credits</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <strong>Student Name:</strong> {hpcData.studentName}
          </div>
          <div>
            <strong>Class & Section:</strong> {hpcData.className}
          </div>
          <div>
            <strong>Admission No:</strong> {hpcData.admissionNo}
          </div>
          <div>
            <strong>Notional Learning Hours:</strong> {hpcData.notionalLearningHours} Hours
          </div>
        </div>

        <div className="pt-8 flex items-center justify-between text-xs text-slate-700 border-t">
          <div>
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <span>Class Teacher Signature</span>
          </div>
          <div>
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <span>Parent Signature</span>
          </div>
          <div>
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <span>Principal & Director Seal</span>
          </div>
        </div>
      </div>

    </div>
  );
};
