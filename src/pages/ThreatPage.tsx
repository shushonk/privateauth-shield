/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Database, 
  Users, 
  Lock,
  ArrowUpRight
} from "lucide-react";

interface ThreatPageProps {
  accentColor: "cyan" | "violet";
}

export default function ThreatPage({ accentColor }: ThreatPageProps) {
  const threats = [
    {
      id: "phish",
      icon: Globe,
      title: "Phishing & Domain Spoofing",
      vuln: "Attackers copy matching UI stylesheets on fake domain hosts (e.g. privauth-shield.co), intercepting typed plain-text master passwords in transition.",
      defense: "FIDO2 Passkeys register origin bindings with high-level browser API handshakes. Biometric verification will not execute or release challenge tokens if domain certificates mismatch, fully blocking spoofed domains.",
      score: "Phishing-Proof (100% Defense Level)"
    },
    {
      id: "stuffing",
      icon: Database,
      title: "Credential Stuffing",
      vuln: "Credentials leaked from other corporate platforms are automatically tested by high-velocity botnets across PrivateAuth login endpoints.",
      defense: "Passkeys use independent random keypairs for individual installations. Fallback passwords are salted and compiled locally using CPU/Memory intensive Argon2id hashing parameters, forcing botnet compute costs to exhaustion.",
      score: "ASIC/M-Cost Brute Resistance"
    },
    {
      id: "replay",
      icon: Zap,
      title: "Replay & Transport Attacks",
      vuln: "Eavesdroppers capture active cookies or verification packets over public Wi-Fi hotspots, attempting to reuse tokens for illegitimate authorization requests.",
      defense: "TOTP challenges are bounded to sliding time-lapse windows of 30 seconds. Passkeys enforce hardware challenge random salts that expire instantly once parsed, making intercepted transport payloads fully useless.",
      score: "Dynamic Token Exhaustion"
    },
    {
      id: "hijacking",
      icon: Lock,
      title: "Session Hijacking",
      vuln: "Attackers steal stored session tokens from local directories, trying to maintain background authorization links indefinitely.",
      defense: "The sliding token rotation algorithm rotates active authorization states every 10 minutes. A manual click on the Revoke widget wipes associated identifiers on the server immediately, killing hijacking tunnels.",
      score: "10-Minute Token Sliding Decay"
    },
    {
      id: "enumeration",
      icon: Users,
      title: "User Account Enumeration",
      vuln: "Attackers submit automated requests to find out which usernames exist by analyzing variations in API errors or layout timing feedback.",
      defense: "Error messages are strictly identical and generic (e.g. 'Authentication failed'). Handshake responses enforce randomized sleep offsets (1-2 seconds delay) to equalize timing anomalies.",
      score: "Timing-Normalized Blind Errors"
    }
  ];

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";

  return (
    <div id="threat_viewport" className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${accentColorClass}`} />
          Threat Vector Modeling
        </h2>
        <p className="text-xs text-slate-505 font-sans">Compare sophisticated hostile actor targets directly against PrivateAuth cryptographic mitigation measures</p>
      </div>

      {/* Threat List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {threats.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.id} className="bg-slate-955 border border-slate-900 hover:border-slate-805 p-5 rounded-2xl space-y-4 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${accentBgClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-sans">{t.title}</h3>
                </div>
                <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/10">
                  {t.score}
                </span>
              </div>

              {/* Problem/Solution Columns */}
              <div className="grid grid-cols-1 gap-3.5 pt-2">
                
                {/* Vulnerability */}
                <div className="p-3 bg-red-950/10 border border-red-955 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono uppercase text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 shrink-0" /> Target Attack Path (Vulnerability)
                  </span>
                  <p className="text-xs text-slate-400 leading-normal font-sans pr-1">
                    {t.vuln}
                  </p>
                </div>

                {/* Mitigation */}
                <div className="p-3 bg-emerald-950/10 border border-emerald-900 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> PrivateAuth Countermeasure
                  </span>
                  <p className="text-xs text-slate-400 leading-normal font-sans pr-1">
                    {t.defense}
                  </p>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
