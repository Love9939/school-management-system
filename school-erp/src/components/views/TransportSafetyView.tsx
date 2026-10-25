'use client';

import React, { useState } from 'react';
import { 
  BusFront, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  AlertTriangle, 
  Phone, 
  QrCode, 
  Sparkles,
  UserCheck,
  Clock,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BusTelemetry, RfidTapLog } from '../../types';

interface TransportSafetyViewProps {
  fleet: BusTelemetry[];
  rfidLogs: RfidTapLog[];
}

export const TransportSafetyView: React.FC<TransportSafetyViewProps> = ({
  fleet,
  rfidLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'rfid' | 'gatepass'>('fleet');
  const [geofenceAlertSent, setGeofenceAlertSent] = useState(false);
  const [gatePassGenerated, setGatePassGenerated] = useState(false);

  const handleTriggerGeofenceAlert = () => {
    confetti({ particleCount: 40, spread: 50 });
    setGeofenceAlertSent(true);
    setTimeout(() => setGeofenceAlertSent(false), 5000);
  };

  const handleGenerateGatePass = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 50, spread: 60 });
    setGatePassGenerated(true);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BusFront className="w-6 h-6 text-cyan-400" />
            AIS-140 GPS Transport & RFID Student Safety
          </h2>
          <p className="text-xs text-[#62625b]">
            Hardware-agnostic bus tracking, contactless door RFID taps with WhatsApp arrival alerts, and OTP security gate passes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#f6f6f3] border border-[#dadad3] text-xs">
          <button
            id="tab-fleet-btn"
            onClick={() => setActiveTab('fleet')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'fleet' ? 'bg-[#e60023] text-white shadow' : 'text-[#62625b] hover:text-[#000000]'
            }`}
          >
            AIS-140 GPS Fleet (14)
          </button>
          <button
            id="tab-rfid-btn"
            onClick={() => setActiveTab('rfid')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'rfid' ? 'bg-[#e60023] text-white shadow' : 'text-[#62625b] hover:text-[#000000]'
            }`}
          >
            RFID Door Taps
          </button>
          <button
            id="tab-gatepass-btn"
            onClick={() => setActiveTab('gatepass')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'gatepass' ? 'bg-[#e60023] text-white shadow' : 'text-[#62625b] hover:text-[#000000]'
            }`}
          >
            Early Pickup Gate Pass
          </button>
        </div>
      </div>

      {/* Geofence Alert Bar */}
      {geofenceAlertSent && (
        <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-lg">
          <Send className="w-5 h-5 text-cyan-400" />
          <div>
            <strong>10-Minute Stop Arrival Geofence Broadcasted:</strong> Automated WhatsApp notification dispatched to 42 parents on Route 1 ("Bus DL-1PC-4891 is 10 mins away from your stop").
          </div>
        </div>
      )}

      {/* Tab 1: Live GPS Fleet */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#62625b]">
            <span>Real-time AIS-140 GPS Telemetry via Govt-Approved Vehicle Tracking Devices</span>
            <button
              id="simulate-geofence-btn"
              onClick={handleTriggerGeofenceAlert}
              className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Simulate 10-Min Geofence Alert</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fleet.map((bus) => (
              <div key={bus.busId} className="glass-card rounded-2xl p-5 border border-[#dadad3] space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <BusFront className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{bus.routeNumber}</div>
                      <div className="text-[10px] text-[#62625b] font-mono">{bus.busNumber}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      bus.status === 'ON_SCHEDULE'
                        ? 'bg-emerald-500/10 text-[#103c25] border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/20 animate-pulse'
                    }`}
                  >
                    {bus.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-[#33332e] line-clamp-1">
                  {bus.routeName}
                </div>

                {/* Speed & Next Stop */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#f6f6f3]/60 p-2.5 rounded-xl border border-[#dadad3] font-mono">
                  <div>
                    <span className="text-[10px] text-[#91918c] block">Current Speed:</span>
                    <span className="font-bold text-white">{bus.currentSpeedKmH} km/h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#91918c] block">Next Stop ETA:</span>
                    <span className="font-bold text-cyan-400">{bus.etaNextStopMins} mins</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#62625b] space-y-1">
                  <div>Next Stop: <strong className="text-[#211922]">{bus.nextStop}</strong></div>
                  <div>Driver: <span className="text-[#33332e]">{bus.driverName}</span> ({bus.driverPhone})</div>
                  <div className="flex items-center justify-between text-[10px] text-[#91918c] pt-1">
                    <span>Boarded: {bus.currentBoardedCount}/{bus.totalCapacity}</span>
                    <span>GPS ping: {bus.lastGpsUpdate}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: RFID Door Taps */}
      {activeTab === 'rfid' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-[#dadad3]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  Live RFID Door Tap Stream (Bus Entry / Exit)
                </h3>
                <p className="text-xs text-[#62625b]">
                  Contactless NFC/RFID student card taps trigger instantaneous WhatsApp messages to parents.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-[#103c25] border border-emerald-500/20">
                100% WhatsApp Delivery
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f6f6f3]/60 text-[#62625b] uppercase text-[10px] font-mono border-b border-[#dadad3]">
                  <tr>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Bus Number</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Stop Location</th>
                    <th className="py-2.5 px-4 text-right">Parent WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {rfidLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-[#33332e] text-[11px]">{log.tapTime}</td>
                      <td className="py-3 px-4 font-sans font-bold text-white">
                        {log.studentName} <span className="text-[#62625b] text-[10px] font-normal font-mono">({log.admissionNo})</span>
                      </td>
                      <td className="py-3 px-4 text-cyan-300">{log.busNumber}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#103c25] border border-emerald-500/20">
                          {log.tapType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#33332e] font-sans">{log.stopName}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#103c25]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Delivered (1.2s)
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

      {/* Tab 3: Security Gate Pass */}
      {activeTab === 'gatepass' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-indigo-500 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#e60023]" />
                  Security Gate Pass & Guardian Early Pickup Verification
                </h3>
                <p className="text-xs text-[#62625b]">
                  Prevents unauthorized departures. Requires Aadhaar/Phone OTP + Class Teacher digital sign-off.
                </p>
              </div>
            </div>

            {gatePassGenerated ? (
              <div className="p-6 rounded-2xl bg-[#f6f6f3] border border-[#a3e6c2] text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-[#c7f0da] text-[#103c25] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Early Pickup Gate Pass Approved</h4>
                <p className="text-xs text-[#33332e]">
                  Pass #GP-2026-1029 authorized by Mrs. Sunita Verma (Class Teacher) & Main Security Gate 1.
                </p>
                <div className="p-3 rounded-xl bg-black/40 font-mono text-xs text-indigo-300 max-w-sm mx-auto">
                  Student: Aarav Sharma (Class 4-A)<br />
                  Guardian: Rajesh Sharma (Aadhaar Verified)<br />
                  Departure Time: 11:30 AM (Medical Appointment)
                </div>
                <button
                  onClick={() => setGatePassGenerated(false)}
                  className="px-4 py-2 rounded-xl bg-[#e5e5e0] text-[#211922] text-xs font-semibold"
                >
                  Issue Another Gate Pass
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerateGatePass} className="space-y-4 text-xs">
                <div>
                  <label className="text-[#62625b] block mb-1">Student Admission Number</label>
                  <input
                    type="text"
                    defaultValue="DPA-2021-0842"
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f6f3] border border-[#dadad3] text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#62625b] block mb-1">Guardian Name</label>
                    <input
                      type="text"
                      defaultValue="Rajesh Sharma (Father)"
                      className="w-full px-3 py-2 rounded-xl bg-[#f6f6f3] border border-[#dadad3] text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[#62625b] block mb-1">Guardian Mobile & OTP</label>
                    <input
                      type="text"
                      defaultValue="+91 98112 34567 (OTP Verified)"
                      className="w-full px-3 py-2 rounded-xl bg-[#f6f6f3] border border-[#dadad3] text-[#103c25] font-mono focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#62625b] block mb-1">Reason for Early Departure</label>
                  <input
                    type="text"
                    defaultValue="Family emergency / Doctor appointment at Max Hospital"
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f6f3] border border-[#dadad3] text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    id="submit-gatepass-btn"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Issue Digital Gate Pass</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
