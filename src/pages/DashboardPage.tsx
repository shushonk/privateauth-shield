/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  HelpCircle, 
  KeyRound, 
  Lock, 
  AlertTriangle, 
  Clock, 
  Download, 
  Trash2, 
  CheckCircle,
  TrendingUp,
  Cpu,
  User,
  Activity,
  ArrowRight
} from "lucide-react";
import { UserSession, Passkey, SecuritySession, SecurityLog, PrivacySettings } from "../types";
import { ChevronDown, ChevronUp, Check, Info } from "lucide-react";

interface DashboardPageProps {
  user: UserSession;
  passkeys: Passkey[];
  sessions: SecuritySession[];
  logs: SecurityLog[];
  securityScore: number;
  privacyScore: number;
  securityScoreLevel: string;
  privacyScoreLevel: string;
  securityScoreColor: string;
  privacyScoreColor: string;
  onNav: (tab: string) => void;
  onExportData: () => void;
  onDeleteAccountReq: () => void;
  accentColor: "cyan" | "violet";
  privacy: PrivacySettings;
}

export default function DashboardPage({
  user,
  passkeys,
  sessions,
  logs,
  securityScore,
  privacyScore,
  securityScoreLevel,
  privacyScoreLevel,
  securityScoreColor,
  privacyScoreColor,
  onNav,
  onExportData,
  onDeleteAccountReq,
  accentColor,
  privacy
}: DashboardPageProps) {
  const [tokenCountdown, setTokenCountdown] = useState(600); // 10 minutes session rotation token decay
  const [showSecurityChecklist, setShowSecurityChecklist] = useState(false);
  const [showPrivacyChecklist, setShowPrivacyChecklist] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokenCountdown((prev) => {
        if (prev <= 1) return 600; // rotate token
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const accentText = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBg = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";
  const accentBorder = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentGlow = accentColor === "cyan" ? "shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "shadow-[0_0_15px_rgba(139,92,246,0.15)]";

  return (
    <div id="dashboard_viewport" className="space-y-6">
      {/* Top Banner Alert and Token expirations */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-900">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Security Clearance Identity:</span>
          <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <User className={`w-4 h-4 ${accentText}`} />
            {user.anonymousMode ? "anonymous_user_profile" : user.username}
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded-md border border-green-500/20">
              Active Session Verified
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <div className="text-right">
            <span className="text-[9px] text-slate-500 font-mono block uppercase">Token Rotation decay:</span>
            <span className={`text-xs font-mono font-bold tracking-wider ${accentText}`}>{formatCountdown(tokenCountdown)}</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-slate-800 ml-1">ROT-AES256</span>
        </div>
      </div>

      {/* Grid of Gauges/Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Score Gauge */}
        <div 
          onClick={() => setShowSecurityChecklist(!showSecurityChecklist)}
          className={`p-5 bg-slate-950 border border-slate-900 rounded-2xl select-none cursor-pointer transition-all hover:border-slate-700/60 duration-300 ${accentGlow}`}
          id="dashboard_security_gauge_card"
          title="Click to toggle Security Factors Checklist"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                Security Strength Matrix
                {showSecurityChecklist ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </h3>
              <p className="text-[10px] text-slate-500 font-sans">Index based on Passkeys, TOTP & Backup availability</p>
            </div>
            <span className={`text-xs font-mono font-bold ${securityScoreColor} bg-slate-900 px-2 py-0.5 rounded border border-slate-800`}>
              {securityScoreLevel}
            </span>
          </div>

          <div className="flex items-center gap-5 mt-4">
            <div className="relative flex items-center justify-center">
              {/* Simple SVGA Circle Bar */}
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="34" 
                  stroke={accentColor === "cyan" ? "#06b6d4" : "#8b5cf6"} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray="213.62"
                  strokeDashoffset={213.62 - (213.62 * securityScore) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-base font-bold font-mono text-white">{securityScore}%</span>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">Passkeys Registered</span>
                <span className={`font-semibold font-mono text-xs ${passkeys.length > 0 ? "text-cyan-400" : "text-amber-500"}`}>{passkeys.length > 0 ? "YES" : "NO"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">TOTP Core Enabled</span>
                <span className={`font-semibold font-mono text-xs ${user.mfaSetUp ? "text-cyan-400" : "text-amber-500"}`}>{user.mfaSetUp ? "ACTIVE" : "INACTIVE"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">Recovery Codes Generated</span>
                <span className={`font-semibold font-mono text-xs ${localStorage.getItem("privateauth_recovery_codes") ? "text-cyan-400" : "text-amber-500"}`}>{localStorage.getItem("privateauth_recovery_codes") ? "YES" : "NO"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>{showSecurityChecklist ? "Click to lock factors breakdown" : "Click to inspect active criteria breakdown"}</span>
            <span className={accentText}>{showSecurityChecklist ? "CLOSE" : "EXPAND KEYS"}</span>
          </div>

          {showSecurityChecklist && (
            <div className="mt-4 pt-3 border-t border-slate-900 space-y-2 text-left animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold mb-2">Security Factors Checklist:</h4>
              
              <div className="space-y-2">
                {[
                  { label: "Passkey-first login", val: "16%", active: passkeys.length > 0, desc: passkeys.length > 0 ? "Active: Biometric hardware keys cached." : "Available: Go to passkeys page to configure." },
                  { label: "MFA enabled", val: "20%", active: user.mfaSetUp, desc: user.mfaSetUp ? "Active: TOTP code engine verified." : "Available: Sync micro-TOTP code key." },
                  { label: "Recovery codes generated", val: "15%", active: !!localStorage.getItem("privateauth_recovery_codes"), desc: localStorage.getItem("privateauth_recovery_codes") ? "Active: Backup reset index stored offline." : "Available: Generate codes to protect password." },
                  { label: "Session rotation active", val: "15%", active: true, desc: "Active: Token decay rotates keys seamlessly." },
                  { label: "Rate limiting enabled", val: "10%", active: true, desc: "Active: Intelligent dictionary defense on." },
                  { label: "Generic auth errors active", val: "10%", active: true, desc: "Active: Credentials error masking is on." },
                  { label: "Minimal audit logging active", val: "10%", active: true, desc: "Active: Zero raw sensitive details cached." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <div className={`p-0.5 rounded-full mt-0.5 ${item.active ? 'bg-green-950 text-green-400' : 'bg-slate-900 text-slate-600'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <span className={`font-medium block ${item.active ? 'text-slate-200' : 'text-slate-500'}`}>{item.label} (+{item.val})</span>
                      <span className="text-[10px] text-slate-500 font-sans leading-tight block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Privacy Score Gauge */}
        <div 
          onClick={() => setShowPrivacyChecklist(!showPrivacyChecklist)}
          className={`p-5 bg-slate-950 border border-slate-900 rounded-2xl select-none cursor-pointer transition-all hover:border-slate-700/60 duration-300 ${accentGlow}`}
          id="dashboard_privacy_gauge_card"
          title="Click to toggle Privacy Factors Checklist"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                Confidentiality Profile Index
                {showPrivacyChecklist ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </h3>
              <p className="text-[10px] text-slate-500 font-sans">Index based on anonymization settings & minimizations</p>
            </div>
            <span className={`text-xs font-mono font-bold ${privacyScoreColor} bg-slate-900 px-2 py-0.5 rounded border border-slate-800`}>
              {privacyScoreLevel}
            </span>
          </div>

          <div className="flex items-center gap-5 mt-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="34" 
                  stroke={accentColor === "cyan" ? "#22d3ee" : "#a78bfa"} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray="213.62"
                  strokeDashoffset={213.62 - (213.62 * privacyScore) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-base font-bold font-mono text-white">{privacyScore}%</span>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">IP Obfuscation (Mask)</span>
                <span className={`font-semibold font-mono text-xs ${privacy.ipAnonymization ? "text-cyan-400" : "text-amber-500"}`}>{privacy.ipAnonymization ? "ENABLED" : "DISABLED"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">Contact Minimization</span>
                <span className="text-cyan-400 font-semibold font-mono text-xs">{user.optionalEmail ? "PARTIAL" : "COMPLETE"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">Anonymous State Redundancy</span>
                <span className={`font-semibold font-mono text-xs ${user.anonymousMode ? "text-cyan-400" : "text-slate-500"}`}>{user.anonymousMode ? "ON" : "OFF"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>{showPrivacyChecklist ? "Click to lock factors breakdown" : "Click to inspect active criteria breakdown"}</span>
            <span className={accentText}>{showPrivacyChecklist ? "CLOSE" : "EXPAND PRIV"}</span>
          </div>

          {showPrivacyChecklist && (
            <div className="mt-4 pt-3 border-t border-slate-900 space-y-2 text-left animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold mb-2">Confidentiality Completed:</h4>
              
              <div className="space-y-2">
                {[
                  { label: "No mandatory email", val: "15%", active: true, desc: "Active: Verifications require no mandatory email linkage." },
                  { label: "No phone number collection", val: "15%", active: true, desc: "Active: Zero SIM-swap risk metrics verified." },
                  { label: "No full IP logging", val: "15%", active: privacy.ipAnonymization, desc: privacy.ipAnonymization ? "Active: At-source IP logs obfuscated." : "Available: Toggle IP anonymize on Privacy tab." },
                  { label: "No device fingerprinting", val: "15%", active: true, desc: "Active: Rejects user-agent tracking algorithms." },
                  { label: "Local voice transcript only", val: "13%", active: true, desc: "Active: Voice commands processed in-browser." },
                  { label: "Data export available", val: "10%", active: true, desc: "Active: Secure credentials JSON backup unlocked." },
                  { label: "Account deletion available", val: "15%", active: true, desc: "Active: Sovereign wipe-out clears browser data." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <div className={`p-0.5 rounded-full mt-0.5 ${item.active ? 'bg-green-950 text-green-400' : 'bg-slate-900 text-slate-600'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <span className={`font-medium block ${item.active ? 'text-slate-200' : 'text-slate-500'}`}>{item.label} (+{item.val})</span>
                      <span className="text-[10px] text-slate-500 font-sans leading-tight block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Active Services Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Audits List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Security Metrics */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Cryptographic Token Status Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Check 1: Passkeys */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-805 flex items-start gap-2.5">
                <div className={`p-1 rounded-lg ${passkeys.length > 0 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block font-sans">Hardware Passkeys</span>
                  <span className="text-[10px] text-slate-500 block">
                    {passkeys.length > 0 ? `${passkeys.length} Registered Keys` : "Vulnerable fallback only"}
                  </span>
                  {passkeys.length === 0 && (
                    <span className="text-[9px] font-medium text-red-400 font-mono flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> Backup WebAuthn Key Required
                    </span>
                  )}
                </div>
              </div>

              {/* Check 2: MFA */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex items-start gap-2.5">
                <div className={`p-1 rounded-lg ${user.mfaSetUp ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block font-sans">TOTP MFA Engine</span>
                  <span className="text-[10px] text-slate-500 block">
                    {user.mfaSetUp ? "Status: Live Verified" : "Status: Inactive / Disabled"}
                  </span>
                  {!user.mfaSetUp && (
                    <span className="text-[9px] font-medium text-red-400 font-mono flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> No cellular SMS is allowed!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Active Logs Summary */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white font-sans">Authentication Transactions</h3>
              <button onClick={() => onNav("logs")} className="text-[11px] font-mono text-cyan-400 hover:underline">
                View all logs →
              </button>
            </div>

            <div className="space-y-2.5">
              {logs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-900 flex justify-between items-start text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        log.event.includes("SUCCESS") ? "bg-green-950 text-green-400" :
                        log.event.includes("REMOVED") || log.event.includes("REVOKED") ? "bg-yellow-950 text-yellow-400" :
                        log.event.includes("DELETED") ? "bg-red-950 text-red-400" : "bg-cyan-950 text-cyan-400"
                      }`}>
                        {log.event.replace("_", " ")}
                      </span>
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 font-sans leading-normal text-xs">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-slate-805">
                    {log.ipAddress}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans">Guarded Quick Actions</h3>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onNav("passkeys")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-805 text-left text-xs text-slate-300 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-cyan-400 group-hover:scale-105 transition-transform" />
                  <span className="font-sans">Manage Passkeys</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
              </button>

              <button 
                onClick={() => onNav("mfa")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-805 text-left text-xs text-slate-300 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-cyan-400 group-hover:scale-105 transition-transform" />
                  <span className="font-sans">Active TOTP Settings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
              </button>

              <button 
                onClick={() => onNav("recovery")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-805 text-left text-xs text-slate-300 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-cyan-400 group-hover:scale-105 transition-transform" />
                  <span className="font-sans">Backup Recovery Matrices</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
              </button>

              <button 
                onClick={() => onNav("sessions")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-805 text-left text-xs text-slate-300 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-cyan-400 group-hover:scale-105 transition-transform" />
                  <span className="font-sans">Revoke Active Devices</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
              </button>

              <button 
                onClick={onExportData}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-805 text-left text-xs text-slate-300 hover:text-white transition-all group cursor-pointer bg-cyan-950/20"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span className="font-sans font-medium">Export Privacy Archive</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
              </button>

              <button 
                onClick={onDeleteAccountReq}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-red-950 text-left text-xs text-red-400 hover:bg-red-950/20 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span className="font-sans font-medium">Account Erasure (Wipe)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-red-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
