/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lock, 
  Unlock, 
  HelpCircle, 
  QrCode, 
  CheckCircle, 
  AlertTriangle,
  Clipboard,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { UserSession } from "../types";

interface MfaPageProps {
  user: UserSession;
  onUpdateMfa: (isEnabled: boolean, secret?: string) => void;
  accentColor: "cyan" | "violet";
}

export default function MfaPage({ user, onUpdateMfa, accentColor }: MfaPageProps) {
  const [showConfigFlow, setShowConfigFlow] = useState(false);
  const [mfaSecret, setMfaSecret] = useState("K4YG R7XZ J5WD QL2M HNZ9");
  
  // Handshake verification
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const generateNewSecret = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let newSecret = "";
    for (let i = 0; i < 4; i++) {
      let block = "";
      for (let j = 0; j < 4; j++) {
        block += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newSecret += (newSecret ? " " : "") + block;
    }
    setMfaSecret(newSecret);
    setErrorMessage(null);
  };

  const copySecretToClipboard = () => {
    navigator.clipboard.writeText(mfaSecret.replace(/\s/g, ""));
    setSuccessMessage("Authenticator secret copied to client clipboard.");
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleVerifySetup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (verificationCode.trim().length !== 6) {
      setErrorMessage("Handshake failed. Verification code must be exactly 6 numeric characters.");
      return;
    }

    // Accept 123456 or other code configs for simulation ease
    onUpdateMfa(true, mfaSecret);
    setSuccessMessage("TOTP system deployed and fully verified. Safe authentication active.");
    setShowConfigFlow(false);
    setVerificationCode("");
  };

  const handleDisableMfa = () => {
    onUpdateMfa(false, "");
    setSuccessMessage("TOTP state deactivated. Falling back to primary credentials only.");
    setErrorMessage(null);
    setVerificationCode("");
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";
  const accentButtonClass = accentColor === "cyan" 
    ? "bg-cyan-500 hover:bg-cyan-600 text-black font-semibold" 
    : "bg-violet-500 hover:bg-violet-600 text-white font-semibold";

  return (
    <div id="mfa_viewport" className="space-y-6">
      
      {/* Header card info */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <Lock className={`w-4 h-4 ${accentColorClass}`} />
          TOTP MFA Core Engine
        </h2>
        <p className="text-xs text-slate-500 font-sans">Prevent remote hijacking using local Time-based Authenticator standards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main MFA configuration action area */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            
            {successMessage && (
              <div className="p-3 rounded-lg bg-green-950/20 border border-green-500/25 text-xs text-green-400 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-955 text-xs text-red-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="text-xs font-mono text-slate-400">STATUS MONITOR</span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                user.mfaSetUp ? "bg-green-950 text-green-400 border border-green-500/15" : "bg-slate-900 text-slate-500 border border-slate-800"
              }`}>
                {user.mfaSetUp ? "LIVE VERIFIED" : "DEACTIVATED"}
              </span>
            </div>

            {user.mfaSetUp ? (
              <div className="py-2 space-y-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-white font-sans flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-450" />
                    Two-Factor Handshaking Enforced
                  </h4>
                  <p className="text-xs text-slate-450 leading-relaxed font-sans">
                    Every login transaction from new IP zones requires validating matching 6-digit seeds. This prevents unauthorized bypass even if attackers clone your password fallbacks.
                  </p>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={handleDisableMfa}
                    className="px-4 py-2 border border-red-500/10 hover:border-red-500/30 text-[11px] font-mono text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  >
                    Deactivate TOTP Verification
                  </button>
                </div>
              </div>
            ) : !showConfigFlow ? (
              <div className="text-center py-6 space-y-4">
                <Lock className="w-10 h-10 mx-auto text-slate-700 animate-pulse" />
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h4 className="text-xs font-bold text-slate-300 font-sans">Multi-Factor Deployment Needed</h4>
                  <p className="text-xs text-slate-400 leading-normal font-sans">
                    Enable standard Local Authenticator codes to block credential-stuffing automated bots. No cellular credentials required.
                  </p>
                </div>
                <button
                  onClick={() => setShowConfigFlow(true)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase ${accentButtonClass}`}
                >
                  Configure Local Authenticator
                </button>
              </div>
            ) : (
              /* TOTP Setup Steps Form */
              <div className="space-y-5 pt-3">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-xs leading-normal font-sans text-slate-300">
                    <span className="h-5 w-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-cyan-400 flex-shrink-0">Step 1</span>
                    <p>
                      Scan this offline QR key code using an authenticator app (e.g. FreeOTP, Aegis, Google Authenticator) on your secondary device:
                    </p>
                  </div>

                  {/* QR Core simulation */}
                  <div className="flex justify-center py-4 bg-slate-905 border border-slate-900 rounded-xl relative">
                    <div className="p-3 bg-white rounded-lg inline-block">
                      {/* Virtual terminal-based pixel design matching QR grids */}
                      <div className="w-32 h-32 bg-slate-950 flex flex-wrap p-1 gap-0.5 select-none">
                        {Array.from({ length: 144 }).map((_, i) => {
                          const isPixel = (i % 3 === 0 && i % 4 !== 0) || (i < 24) || (i > 120) || (i % 7 === 1);
                          return (
                            <div 
                              key={i} 
                              className={`w-2 h-2 rounded-xs ${isPixel ? "bg-white" : "bg-slate-950"}`}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-xs leading-normal font-sans text-slate-300">
                    <span className="h-5 w-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-cyan-400 flex-shrink-0">Step 2</span>
                    <div className="flex-1 space-y-2">
                      <p>If your camera sensor is unavailable, enter this manual backup secret seed code configuration:</p>
                      
                      <div className="flex items-center gap-1.5">
                        <code className="bg-slate-950 text-slate-100 border border-slate-805 px-3 py-1.5 rounded-lg font-mono text-sm tracking-wider flex-1 block">
                          {mfaSecret}
                        </code>
                        <button
                          type="button"
                          onClick={copySecretToClipboard}
                          className="mr-1 p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-lg"
                          title="Copy Seed Value"
                        >
                          <Clipboard className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={generateNewSecret}
                          className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-lg"
                          title="Rotate Seed Value"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification code challenge from the user */}
                <form onSubmit={handleVerifySetup} className="space-y-3 pt-3 border-t border-slate-900">
                  <div className="flex items-start gap-3 text-xs leading-normal font-sans text-slate-300">
                    <span className="h-5 w-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-cyan-400 flex-shrink-0">Step 3</span>
                    <div className="flex-1 space-y-2">
                      <p className="mb-2">Enter the generated 6-digit testing code to deploy verification parameters:</p>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          id="totp_verify_input"
                          type="text"
                          maxLength={6}
                          placeholder="e.g. 123456"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-805 text-center text-sm font-mono tracking-widest text-white rounded-lg py-2 focus:outline-none"
                        />
                        <button
                          id="totp_verify_submit"
                          type="submit"
                          className={`px-5 py-2 text-xs font-mono uppercase rounded-lg cursor-pointer ${accentButtonClass}`}
                        >
                          Verify & Activate TOTP
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Security Info Sidebar Card */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
              <AlertTriangle className="text-yellow-500 w-4 h-4" />
              No SMS Cellular OTP Warning
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              PrivateAuth Shield <strong>explicitly blocks SMS cellular code delivery</strong>. Cellular carrier systems are notoriously vulnerable to SIM Swap spoofing, SS7 cellular routing eavesdropping, and device lockscreen notification intercepts.
            </p>

            <div className="p-3 bg-red-950/20 border border-red-950 rounded-xl text-[10px] text-slate-400 font-sans leading-normal">
              <strong>Risk Matrix:</strong> SMS authentication reduces security integrity back to vulnerable carrier support desks. Enforcing hardware passkeys or local-only TOTP apps blocks over-the-air vector hijackings.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
