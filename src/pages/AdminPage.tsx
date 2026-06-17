/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Settings2, 
  TrendingDown, 
  Users, 
  Zap, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Lock, 
  Fingerprint, 
  Activity,
  Award,
  BookOpen,
  AlertTriangle
} from "lucide-react";

interface AdminPageProps {
  accentColor: "cyan" | "violet";
  rateLimitActive: boolean;
}

export default function AdminPage({ accentColor, rateLimitActive }: AdminPageProps) {
  // Config state check
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Strict Data Minimization: Zero database fields of unverified phone/metric data", done: true },
    { id: 2, text: "Anonymized log entries: Truncate physical IPv4 octets (192.168.x.x)", done: true },
    { id: 3, text: "Active sliding window session rotation decay enabled", done: true },
    { id: 4, text: "No cellular SMS verification options configured (prevents SS7 intercept)", done: true },
    { id: 5, text: "Enforced WebAuthn FIDO2 Public-Private key-ring integration", done: true },
    { id: 6, text: "Complete client-side sovereign data archive JSON export utility", done: true },
    { id: 7, text: "Full irreversible Sovereign Wipe account self-destruct mechanism", done: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";

  return (
    <div id="admin_viewport" className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <Settings2 className={`w-4 h-4 ${accentColorClass}`} />
          Threat Analytics & Privacy Assurance
        </h2>
        <p className="text-xs text-slate-505 font-sans">Simulated enterprise cybersecurity overview dashboard tracking compliance, attacks, and telemetry</p>
      </div>

      {/* Analytics widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Handshake profiles", num: "14,802", color: "text-slate-250", sub: "+12% this cycle" },
          { icon: Fingerprint, label: "Passkey Adoption Rate", num: "94.2%", color: "text-cyan-400", sub: "Goal: 95.0% FIDO2" },
          { icon: Lock, label: "MFA Enrollment Index", num: "81.5%", color: "text-green-400", sub: "No SMS allowed" },
          { icon: ShieldAlert, label: "Blocked Bot Intrusions", num: "614", color: "text-red-400", sub: "Rate limited: 100%" },
        ].map((stat, id) => {
          const Icon = stat.icon;
          return (
            <div key={id} className="p-4 bg-slate-955 border border-slate-900 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className="my-2.5">
                <span className={`text-2xl font-bold font-mono tracking-tight ${stat.color}`}>{stat.num}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span>{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Failed Login trends & Suspicipus Attempts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">FAILED AUTHENTICATION ATTEMPTS (24 HOUR TRACKS)</h3>
            
            <div className="p-4 bg-slate-900/45 rounded-xl border border-slate-900 space-y-4">
              {/* Simulated D3 Recharts graph using standard HTML/CSS scales */}
              <div className="flex items-end h-28 gap-3 sm:gap-4 justify-between border-b border-slate-800 pb-2.5">
                {[
                  { hour: "02:00", val: 12 },
                  { hour: "06:00", val: 5 },
                  { hour: "10:00", val: 41 },
                  { hour: "14:00", val: 18 },
                  { hour: "18:00", val: 65 },
                  { hour: "22:00", val: 8 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] font-mono text-slate-500 hidden sm:inline">{item.val}</span>
                    <div 
                      className={`w-full rounded-t-md transition-all duration-700 ${
                        item.val > 40 
                          ? "bg-gradient-to-t from-red-500 to-orange-500 shadow-[0_0_8px_rgba(239,68,68,0.25)]" 
                          : accentColor === "cyan" ? "bg-gradient-to-t from-cyan-500 to-blue-550" : "bg-gradient-to-t from-violet-500 to-fuchsia-160"
                      }`}
                      style={{ height: `${(item.val / 80) * 100}px` }}
                    ></div>
                    <span className="text-[9px] font-mono text-slate-600 font-medium">{item.hour}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pr-1">
                <span className="flex items-center gap-1"><Activity className="w-4 h-4 text-emerald-500" /> Security Signal Filter: Live</span>
                <span className="text-red-400 flex items-center gap-1">
                  {rateLimitActive ? <AlertTriangle className="animate-bounce w-3.5 h-3.5" /> : null}
                  SYSTEM RATE-LIMITERS: {rateLimitActive ? "ACTIVE DECAY" : "GREEN_NORMAL"}
                </span>
              </div>
            </div>

            {/* Suspicious login attempts triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3 bg-red-950/20 border border-red-955 rounded-xl space-y-1">
                <span className="text-[9px] font-mono uppercase bg-red-900/30 text-red-400 px-1 py-0.5 rounded w-fit">THREAD_ALERT</span>
                <h4 className="text-xs font-bold text-slate-205 font-sans">Geographic Anomaly</h4>
                <p className="text-[10px] text-slate-400 font-sans leading-normal">
                  An entry was flagged 2 hours ago from Zurich (172.56.x.x) instantly preceding London login matrices. Flagged as improbable travel threat.
                </p>
              </div>

              <div className="p-3 bg-yellow-950/20 border border-yellow-955 rounded-xl space-y-1">
                <span className="text-[9px] font-mono uppercase bg-yellow-900/30 text-yellow-405 px-1 py-0.5 rounded w-fit">REPLAY_SUSPECT</span>
                <h4 className="text-xs font-bold text-slate-205 font-sans font-mono">Token Expiry Exhaustion</h4>
                <p className="text-[10px] text-slate-400 font-sans leading-normal">
                  Three client devices triggered API tokens at identical milliseconds intervals. Gateways rotated current identifiers automatically, logging zero credential exposures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GDPR Compliance checklists */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Privacy Assurance Index
            </h3>

            <p className="text-xs text-slate-400 leading-normal font-sans">
              Enterprises must align authentications with robust zero-knowledge directives. Check/uncheck rules below to simulate parameter adjustments:
            </p>

            <div className="space-y-3 font-sans">
              {checklist.map((item) => (
                <label key={item.id} className="flex gap-2.5 items-start text-[11px] leading-snug text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 rounded border-slate-800 bg-slate-950 text-cyan-505 w-3.5 h-3.5"
                  />
                  <span className={item.done ? "text-slate-400 line-through decoration-slate-800" : "text-slate-202"}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
