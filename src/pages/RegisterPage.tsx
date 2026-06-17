/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  HelpCircle, 
  Loader2, 
  Fingerprint, 
  Unlock, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Download,
  Copy,
  ChevronRight,
  CheckCircle,
  Clock
} from "lucide-react";
import { UserSession, Passkey } from "../types";
import { checkPasswordStrength, PasswordStrength, generateMockRecoveryCodes } from "../lib/securityUtils";

interface RegisterPageProps {
  onRegisterSuccess: (user: UserSession, codes: string[], key?: Passkey) => void;
  accentColor: "cyan" | "violet";
  onNav: (tab: string) => void;
}

export default function RegisterPage({ onRegisterSuccess, accentColor, onNav }: RegisterPageProps) {
  // Formulation state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Handshakes and states
  const [registerWithPasskey, setRegisterWithPasskey] = useState(true);
  const [passkeyHardwareName, setPasskeyHardwareName] = useState("Organic Yubikey Hardware Node");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password strength meter live cache
  const strength: PasswordStrength = checkPasswordStrength(password);

  const handleRegisterInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Boundary validation
    if (!username || username.trim().length < 3) {
      setErrorMessage("Username profile must be at least 3 characters long.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("To deploy private keys, you must accept identity terms.");
      return;
    }

    if (password && password.length < 8) {
      setErrorMessage("Fallback password must be secure (minimum 8 characters).");
      return;
    }

    setIsLoading(true);

    // Simulate cryptographic compilation & Argon2 password salt hashing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Compile backup codes
    const codes = generateMockRecoveryCodes();

    // Create mock user session payload
    const mockUser: UserSession = {
      username: username.trim(),
      isLoggedIn: true,
      mfaSetUp: false,
      mfaVerified: false,
      anonymousMode: false,
      optionalEmail: email.trim() || undefined,
    };

    // If they activated Passkey Registration, compile passkey
    let mockKey: Passkey | undefined = undefined;
    if (registerWithPasskey) {
      mockKey = {
        id: `pk_${Date.now()}`,
        name: passkeyHardwareName || "Registered Browser Key-Ring",
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        lastUsedAt: "Just now",
        trustLevel: "High"
      };
    }

    setIsLoading(false);
    onRegisterSuccess(mockUser, codes, mockKey);
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";
  const accentButtonClass = accentColor === "cyan" 
    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-black" 
    : "bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] text-white";

  return (
    <div id="register_card_container" className="max-w-md mx-auto py-8">
      <div className="bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Registration Header */}
        <div className="px-5 py-4 bg-slate-900/60 border-b border-slate-910 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${accentColorClass}`} />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300">KEYS_PROVISION_MODULE</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            COMPILER_READY
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-lg font-bold text-white font-sans">Assemble Cryptographic Identity</h2>
            <p className="text-[11px] text-slate-500 font-sans">Creates multi-device key credentials, bypassing third-party trackers</p>
          </div>

          {errorMessage && (
            <div id="register_error_display" className="p-3 rounded-xl bg-red-950/20 border border-red-950 flex items-start gap-2 text-xs text-red-500">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-sans font-semibold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleRegisterInputSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400 block">Username Profile Identifier (Public):</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                <input
                  id="register_username_input"
                  type="text"
                  placeholder="e.g. proto_alice"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/50 hover:bg-slate-900/70 focus:bg-slate-900 border border-slate-800 focus:border-slate-700 text-xs py-2.5 pl-10 pr-3 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none transition-all font-medium"
                />
              </div>
              <span className="text-[9px] text-slate-500 font-sans block leading-normal">
                No real-world metrics are derived from this alias key.
              </span>
            </div>

            {/* Optional Email Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono uppercase text-slate-400 block">Optional Email (Data Minimization):</label>
                <span className="text-[9px] font-mono ml-auto text-emerald-500 bg-emerald-950/20 px-1 rounded border border-emerald-950">RECOMMENDED_BLANK</span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                <input
                  id="register_email_input"
                  type="email"
                  placeholder="e.g. alice@protonmail.ch"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-slate-700 text-xs py-2.5 pl-10 pr-3 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Passkey Activation selection toggle */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-805 space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={registerWithPasskey}
                  onChange={(e) => setRegisterWithPasskey(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                Configure hardware passkey immediately?
              </label>

              {registerWithPasskey && (
                <div className="space-y-1 my-1 pl-6">
                  <label className="text-[9px] font-mono uppercase text-slate-400 block">Yubikey or Device Nickname Alias:</label>
                  <input
                    type="text"
                    placeholder="e.g. Work Macbook Pro"
                    value={passkeyHardwareName}
                    onChange={(e) => setPasskeyHardwareName(e.target.value)}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 focus:border-slate-700 text-[11px] py-1.5 px-2 rounded font-mono text-white placeholder-slate-600 focus:outline-none transition-all"
                  />
                  <div className="flex items-center gap-1.5 text-[9px] text-cyan-400/80 font-mono pt-1">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Enforces WebAuthn FIDO2 Public Key standards</span>
                  </div>
                </div>
              )}
            </div>

            {/* Password fallbacks */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-400 block">Fallback Decryption-Key Password:</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                <input
                  id="register_password_input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-slate-700 text-xs py-2.5 pl-10 pr-10 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength scales indicators */}
              {password && (
                <div className="space-y-1.5 p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">Decryption Strength:</span>
                    <span className={`font-bold ${accentColorClass}`}>{strength.label}</span>
                  </div>
                  
                  {/* Energy bar scales */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step} 
                        className={`h-full flex-1 transition-all duration-300 ${
                          step <= strength.score ? strength.color : "bg-slate-900"
                        }`}
                      ></div>
                    ))}
                  </div>

                  {strength.feedback.length > 0 && (
                    <div className="text-[9px] text-slate-400 font-sans space-y-0.5">
                      {strength.feedback.slice(0, 2).map((item, id) => (
                        <p key={id} className="flex items-center gap-1 text-yellow-405">• {item}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 p-1 text-[11px] text-slate-400 cursor-pointer">
              <input 
                id="register_terms_checkbox"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="leading-tight font-sans">
                Yes, compile my cryptographic credentials locally. I understand PrivateAuth Shield saves no unhashed passwords or biometric records in general database clouds.
              </span>
            </label>

            {/* Form submission dispatch */}
            <button
              id="register_submit_btn"
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all tracking-wide flex items-center justify-center gap-2 ${accentButtonClass} disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  Generating Local Cryptographic Keys...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Deploy Private Identity
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-500 font-sans">
            Already configured key aliases?{" "}
            <strong 
              onClick={() => onNav("login")}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Request Bypass Handshake
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
