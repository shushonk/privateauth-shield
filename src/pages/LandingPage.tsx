/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ShieldCheck, 
  Key, 
  EyeOff, 
  Lock, 
  BookOpen, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  Database,
  Terminal
} from "lucide-react";
import { UserSession } from "../types";

interface LandingPageProps {
  onNav: (tab: string) => void;
  user: UserSession;
  accentColor: "cyan" | "violet";
}

export default function LandingPage({ onNav, user, accentColor }: LandingPageProps) {
  const accentText = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBg = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";
  const accentBorder = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentButton = accentColor === "cyan" 
    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-black" 
    : "bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] text-white";

  const features = [
    {
      icon: Key,
      title: "Passwordless Passkeys",
      description: "Cryptographically bound hardware keys based on WebAuthn criteria. Immune to brute-force, passive network intercepts, and phished proxies."
    },
    {
      icon: EyeOff,
      title: "Active Data Minimization",
      description: "Zero storage of tracking metrics, telemetry grids, or unverified contact records. Full local offline sandboxing safeguards your digital sovereignty."
    },
    {
      icon: Database,
      title: "Argon2id KDF Derivations",
      description: "High-grade memory-hard key derivation functions block high-velocity GPU/FPGA brute-force attack vectors completely."
    },
    {
      icon: Lock,
      title: "Local TOTP Multi-factor",
      description: "No insecure SMS cellular routing. Enforce peer-validated time-based random challenges compiled locally on user authenticator chips."
    },
    {
      icon: Terminal,
      title: "Minimal Anonymized Logs",
      description: "Security audit logging strip and mask host identifiers. IP values remain truncated (192.168.x.x) to block remote physical mapping."
    },
    {
      icon: ShieldCheck,
      title: "Threat Modeling Vectors",
      description: "Pre-integrated analysis vectors highlighting replay vulnerabilities, browser token hijacks, and multi-device credential trust levels."
    }
  ];

  return (
    <div id="landing_viewport" className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-slate-950 border border-slate-900 overflow-hidden px-6 py-16 sm:py-20 text-center">
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-transparent opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-40 ${
          accentColor === 'cyan' ? 'bg-cyan-500' : 'bg-violet-500'
        }`}></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
            <span className={`h-2 w-2 rounded-full animate-ping ${accentColor === 'cyan' ? 'bg-cyan-400' : 'bg-violet-400'}`}></span>
            <span>CYBERSECURITY TRUST METRIC: SECURE CORE v1.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white font-sans leading-none">
            Privacy-First Credentials <br />
            <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
              accentColor === 'cyan' ? 'from-cyan-400 to-blue-500' : 'from-violet-400 to-fuchsia-500'
            }`}>
              Without Identity Tracking
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
            PrivateAuth Shield secures your systems with cryptographic passkey validation, local-only time-based MFA, and high-entropy recovery matrices while collecting zero metadata identifiers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {user.isLoggedIn ? (
              <button
                id="hero_dashboard_cta"
                onClick={() => onNav("dashboard")}
                className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${accentButton}`}
              >
                Enter Control Center
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  id="hero_get_started"
                  onClick={() => onNav("register")}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${accentButton}`}
                >
                  Create Secure Identity
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="hero_login"
                  onClick={() => onNav("login")}
                  className="px-6 py-3 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  Passwordless Login
                </button>
              </>
            )}
            <button
              id="hero_explain_model"
              onClick={() => onNav("threat")}
              className="px-6 py-3 rounded-xl font-mono text-xs bg-slate-950/40 hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              View Security Model
            </button>
          </div>
        </div>
      </section>

      {/* Cyber Security Metrics Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Credentials Harvested", num: "0.00%", sub: "Full Zero Knowledge" },
          { label: "Brute Force Resistance", num: "Argon2id (m=64k)", sub: "ASIC & FPGA hard" },
          { label: "Phishing Intercepts", num: "Fully Immune", sub: "WebAuthn Binding" },
          { label: "Audit Log Masking", num: "192.168.x.x", sub: "Truncated IP maps" },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</span>
            <div className="my-2">
              <span className={`text-xl font-bold font-mono tracking-tight ${accentText}`}>{stat.num}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans">{stat.sub}</span>
          </div>
        ))}
      </section>

      {/* Core Architectural Features */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-white font-sans">Core Cryptographical Protections</h2>
          <p className="text-xs text-slate-400 max-w-lg mt-1 font-sans">
            Engineered to safeguard private data footprints while optimizing security integrity against sophisticated modern attack paths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="bg-slate-905/40 backdrop-blur-sm border border-slate-900 hover:border-slate-800 p-5 rounded-2xl transition-all hover:-translate-y-0.5 group"
              >
                <div className={`p-2 rounded-xl w-fit mb-4 transition-colors ${accentBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-cyan-400 font-sans transition-colors">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-normal font-sans">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security Disclaimer Notice */}
      <section className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-500 text-[10px] space-y-1.5 font-sans leading-relaxed">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold font-sans mb-1 uppercase tracking-wide">
          <ShieldAlert className="w-4 h-4 text-yellow-500" />
          <span>Operational Trust Compliance Protocol</span>
        </div>
        <p>
          PrivateAuth Shield represents a mock-integrated secure authentication sandbox. It simulates biometric WebAuthn prompt bindings, secure credential storage models, and rotating JSON authorization tokens within browser storage frameworks. Zero personal credentials travel to external telemetry, and zero unhashed password payloads persist online, demonstrating robust client-first database defense.
        </p>
      </section>
    </div>
  );
}
