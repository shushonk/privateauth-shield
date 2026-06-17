/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Cpu, 
  HelpCircle, 
  ArrowRight, 
  Terminal, 
  Server, 
  Database, 
  ShieldCheck, 
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRightLeft
} from "lucide-react";

interface ArchitecturePageProps {
  accentColor: "cyan" | "violet";
}

export default function ArchitecturePage({ accentColor }: ArchitecturePageProps) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const blocks = [
    {
      id: "browser_view",
      title: "1. Client Web Interface",
      sub: "Vite + React + Tailwind",
      details: "Translates biometric gestures, processes local microphone navigation commands, and triggers fetch queries safely across compartmentalized browser frames.",
      color: "border-slate-800 bg-slate-905"
    },
    {
      id: "gateway_proxy",
      title: "2. Secure API Gateway",
      sub: "Express Node Server Router",
      details: "Acts as a hard security perimeter, proxies risk explaining requests to server-side Gemini, strips identifying user agents, and normalizes transaction timing anomalies.",
      color: "border-cyan-500/20 bg-cyan-950/5"
    },
    {
      id: "key_derivation",
      title: "3. Cryptographic KDF",
      sub: "Argon2id (m=64k, t=3, p=4)",
      details: "Local memory-hard hash derivation modules to process backup credentials passwords. Zero key seeds ever leak to standard network databases.",
      color: "border-purple-500/20 bg-purple-950/5"
    },
    {
      id: "credential_auth",
      title: "4. WebAuthn Vault",
      sub: "FIDO2 Public Key Store",
      details: "Performs verification checks of registered hardware device signatures. Validates challenge assertions against registered public keys.",
      color: "border-emerald-500/20 bg-emerald-950/5"
    },
    {
      id: "token_rotation",
      title: "5. Sliding Session Core",
      sub: "AES-GCM encrypted tokens",
      details: "Rotates current web access tokens dynamically every 10 minutes. Wiping browser storage or revoking devices terminates entries across API records.",
      color: "border-orange-500/20 bg-orange-950/5"
    }
  ];

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";

  return (
    <div id="architecture_viewport" className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <Cpu className={`w-4 h-4 ${accentColorClass}`} />
          Cryptographic Flow & Infrastructure
        </h2>
        <p className="text-xs text-slate-550 font-sans font-sans">Learn about the zero-knowledge components securing user authentication pipelines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual blocks layout */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Interactive System Pipelines</h3>

            <div className="flex flex-col gap-3">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  onMouseEnter={() => setHoveredBlock(block.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  className={`p-4 border rounded-xl transition-all duration-200 cursor-pointer ${block.color} ${
                    hoveredBlock === block.id 
                      ? "border-cyan-400 translate-x-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]" 
                      : "border-slate-805"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white font-sans">{block.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono font-medium block mt-0.5">{block.sub}</span>
                    </div>
                    <ArrowRightLeft className="w-4 h-4 text-slate-600 shrink-0" />
                  </div>

                  {hoveredBlock === block.id && (
                    <p className="text-[11px] text-slate-400 mt-2 font-sans leading-relaxed animate-in fade-in duration-200">
                      {block.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed text explanation panel */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Infrastructure Specifications
            </h3>

            <div className="space-y-4 text-xs text-slate-400 leading-relaxed font-sans pr-1">
              
              <div className="space-y-1">
                <strong className="text-white block font-semibold font-mono text-[11px]">Argon2id Key Derivations</strong>
                <p className="text-[11px] text-slate-400">
                  Instead of standard SHA256 or bcrypt variants, PrivateAuth implements Argon2id (Version 19) password derivatives to safeguard fallback passwords. It enforces massive RAM-buffer arrays, fully neutralizing botnet GPU calculations.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block font-semibold font-mono text-[11px]">Dynamic Session Renewal</strong>
                <p className="text-[11px] text-slate-400">
                  Authentication handshakes do not generate permanent static cookies. Sessions rotate dynamically every 10 minutes. This creates an extremely small target window for session hijackers to intercept access tokens.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-white block font-semibold font-mono text-[11px]">No-SMS Routing Rule</strong>
                <p className="text-[11px] text-slate-405">
                  Cellular networks are highly prone to remote intercepts and hijacking. PrivateAuth enforces localized FIDO2 credentials and TOTP app challenges, bypassing external telecom relays entirely.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
