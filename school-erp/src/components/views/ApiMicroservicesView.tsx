'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Radio, 
  Server,
  Code2,
  FileCode,
  IndianRupee,
  Clock,
  WifiOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ApiMicroservicesView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'payment' | 'biometric' | 'offline' | 'voice-rubric'>('payment');
  const [isLoading, setIsLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Default Payloads for Simulation
  const payloads: Record<string, any> = {
    payment: {
      event: 'payment.captured',
      paymentId: 'pay_98210398412',
      orderId: 'ord_cbse_2026_q3_01',
      studentId: 'std-103',
      admissionNo: 'DPA-2019-0524',
      quarter: '2025-26-Q3',
      amountInPaisa: 3570000, // ₹35,700
      currency: 'INR',
      method: 'upi',
      vpa: 'parent.faizan@okhdfcbank',
      bankRefNumber: 'UPI/42890124810/HDFC',
      signature: 'hmac_sha256_mock_valid_signature_88a91b',
    },
    biometric: {
      deviceId: 'DEVICE-GATE1-FACIAL-09',
      campusId: 'campus-delhi-rohini',
      punches: [
        {
          employeeCode: 'EMP-045',
          punchTimestamp: '2026-10-25T07:18:22Z',
          authMethod: 'FACE_RECOGNITION',
          gateLocation: 'Main Faculty Gate 1',
        },
        {
          employeeCode: 'EMP-052',
          punchTimestamp: '2026-10-25T07:29:45Z',
          authMethod: 'FINGERPRINT',
          gateLocation: 'Academic Wing Entry',
        },
        {
          employeeCode: 'EMP-031',
          punchTimestamp: '2026-10-25T07:22:10Z',
          authMethod: 'RFID_BADGE',
          gateLocation: 'Main Faculty Gate 1',
        },
      ],
    },
    offline: {
      batchId: 'OFFLINE-BATCH-FLUTTER-8812',
      syncTimestamp: new Date().toISOString(),
      deviceId: 'FLUTTER-TEACHER-TAB-04',
      records: [
        {
          clientRecordId: 'uuid-rec-01',
          studentId: 'std-101',
          admissionNo: 'DPA-2021-0842',
          className: 'Class 4',
          section: 'A',
          date: '2026-10-25',
          periodNumber: 1,
          status: 'PRESENT',
          markedOfflineAt: '2026-10-25T08:05:12Z',
          teacherEmployeeCode: 'EMP-014',
        },
        {
          clientRecordId: 'uuid-rec-02',
          studentId: 'std-103',
          admissionNo: 'DPA-2019-0524',
          className: 'Class 12',
          section: 'B',
          date: '2026-10-25',
          periodNumber: 1,
          status: 'ABSENT',
          markedOfflineAt: '2026-10-25T08:06:40Z',
          teacherEmployeeCode: 'EMP-022',
        },
      ],
    },
    'voice-rubric': {
      transcript: 'Aarav demonstrated exceptional critical thinking during hands-on geometry measurement. Mentored peer group effortlessly.',
      studentId: 'std-101',
      studentName: 'Aarav Sharma',
      stage: 'PREPARATORY',
    },
  };

  const endpointUrls: Record<string, string> = {
    payment: '/api/v1/webhooks/payment',
    biometric: '/api/v1/webhooks/biometric',
    offline: '/api/v1/sync/offline-attendance',
    'voice-rubric': '/api/v1/nep/voice-rubric',
  };

  const handleSendWebhook = async () => {
    setIsLoading(true);
    setResponseJson(null);

    try {
      const url = endpointUrls[selectedEndpoint];
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads[selectedEndpoint]),
      });

      const data = await res.json();
      setResponseJson(data);
      confetti({ particleCount: 35, spread: 50 });
    } catch (err: any) {
      setResponseJson({ error: 'Request failed', details: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const curlString = `curl -X POST http://localhost:3005${endpointUrls[selectedEndpoint]} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payloads[selectedEndpoint], null, 2)}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlString);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-400" />
            API & Microservices Architecture Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Interactive playground for real-time webhooks (Payment Gateway Split Settlement, 7:30 AM Biometrics, and Offline-First Sync).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/v1/openapi"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>OpenAPI 3.1 Spec (JSON)</span>
          </a>
        </div>
      </div>

      {/* Architecture Visualizer Flow */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          Event-Driven Microservices Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase text-indigo-400 font-bold">1. Ingress & Gateways</div>
            <div className="font-bold text-white">Payment & Hardware</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Razorpay/ICICI webhooks, eSSL biometric punches, AIS-140 GPS pings via HTTPS.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase text-emerald-400 font-bold">2. Split Engine & Logic</div>
            <div className="font-bold text-white">Double-Entry Ledger</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Segregates Trust (82%) vs Fleet (18%) collections with atomic triggers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase text-amber-400 font-bold">3. Worker Queue</div>
            <div className="font-bold text-white">Redis & BullMQ</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Asynchronous worker pool rendering thousands of CBSE report cards and Tally Prime sync XMLs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase text-cyan-400 font-bold">4. Egress & Notifiers</div>
            <div className="font-bold text-white">WhatsApp & Smartboard</div>
            <p className="text-[11px] text-slate-400 font-sans">
              1-Tap UPI messages, classroom display broadcasts, and UDISE+ government batch export.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Webhook Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Request Dispatcher */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Live Webhook Dispatcher
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              POST /api/v1
            </span>
          </div>

          {/* Endpoint Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              id="webhook-tab-payment"
              onClick={() => { setSelectedEndpoint('payment'); setResponseJson(null); }}
              className={`p-2.5 rounded-xl font-semibold text-left flex items-center gap-2 transition-all ${
                selectedEndpoint === 'payment'
                  ? 'bg-indigo-600 text-white shadow ring-1 ring-indigo-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <IndianRupee className="w-4 h-4" />
              <span>Payment Split Callback</span>
            </button>

            <button
              id="webhook-tab-biometric"
              onClick={() => { setSelectedEndpoint('biometric'); setResponseJson(null); }}
              className={`p-2.5 rounded-xl font-semibold text-left flex items-center gap-2 transition-all ${
                selectedEndpoint === 'biometric'
                  ? 'bg-indigo-600 text-white shadow ring-1 ring-indigo-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Biometric Punch Ingest</span>
            </button>

            <button
              id="webhook-tab-offline"
              onClick={() => { setSelectedEndpoint('offline'); setResponseJson(null); }}
              className={`p-2.5 rounded-xl font-semibold text-left flex items-center gap-2 transition-all ${
                selectedEndpoint === 'offline'
                  ? 'bg-indigo-600 text-white shadow ring-1 ring-indigo-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <WifiOff className="w-4 h-4" />
              <span>Offline Attendance Sync</span>
            </button>

            <button
              id="webhook-tab-voice"
              onClick={() => { setSelectedEndpoint('voice-rubric'); setResponseJson(null); }}
              className={`p-2.5 rounded-xl font-semibold text-left flex items-center gap-2 transition-all ${
                selectedEndpoint === 'voice-rubric'
                  ? 'bg-indigo-600 text-white shadow ring-1 ring-indigo-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Voice-to-Rubric</span>
            </button>
          </div>

          {/* Request Payload Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Endpoint: <strong className="text-white">{endpointUrls[selectedEndpoint]}</strong></span>
              <button
                onClick={handleCopyCurl}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'cURL Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-[11px] font-mono text-indigo-200 overflow-x-auto max-h-56">
              {JSON.stringify(payloads[selectedEndpoint], null, 2)}
            </pre>
          </div>

          <button
            id="execute-webhook-btn"
            onClick={handleSendWebhook}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'Executing Webhook...' : 'Dispatch Live Webhook'}</span>
          </button>
        </div>

        {/* Right: Live Server Response */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Live Server Response
            </h3>
            {responseJson && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                HTTP 200 OK
              </span>
            )}
          </div>

          {responseJson ? (
            <div className="flex-1 space-y-3">
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-80 shadow-inner">
                {JSON.stringify(responseJson, null, 2)}
              </pre>

              {/* Explanatory Callout */}
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300">
                <span className="font-bold text-indigo-300 block mb-0.5">Automated Event Lifecycle:</span>
                {selectedEndpoint === 'payment' && (
                  <span>
                    Received ₹35,700 callback. Automatically segregated ₹29,274 into Trust and ₹6,426 into Fleet escrow. Generated balanced double-entry journal voucher and queued WhatsApp PDF receipt.
                  </span>
                )}
                {selectedEndpoint === 'biometric' && (
                  <span>
                    Detected absent staff (Sunita Verma, Rakesh Malhotra). Solved substitutions using weekly cap limit (max 3 per week), assigned Harpreet Singh, and broadcasted classroom smartboard instructions.
                  </span>
                )}
                {selectedEndpoint === 'offline' && (
                  <span>
                    Reconciled offline batch recorded without Wi-Fi using CRDT Last-Write-Wins protocol. Triggered parent SMS/WhatsApp notification queue for absent student.
                  </span>
                )}
                {selectedEndpoint === 'voice-rubric' && (
                  <span>
                    Analyzed natural teacher dictation. Parsed into Cognitive & Mathematical Inquiry with Exemplary (Level 4) rating and descriptive benchmarks.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2 border border-dashed border-white/10 rounded-xl">
              <Server className="w-8 h-8 text-slate-600" />
              <div className="text-xs">No request sent yet</div>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Click "Dispatch Live Webhook" to execute an actual HTTP request against the Next.js App Router API route.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
