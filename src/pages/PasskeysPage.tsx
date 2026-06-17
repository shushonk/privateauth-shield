/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  KeyRound, 
  Trash2, 
  Plus, 
  HelpCircle, 
  Fingerprint, 
  ShieldAlert, 
  CheckCircle,
  Loader2,
  Calendar,
  Clock,
  Laptop
} from "lucide-react";
import { Passkey } from "../types";

interface PasskeysPageProps {
  passkeys: Passkey[];
  onAddPasskey: (name: string, trustLevel: "High" | "Trusted" | "Standard") => void;
  onRemovePasskey: (id: string) => void;
  accentColor: "cyan" | "violet";
}

export default function PasskeysPage({
  passkeys,
  onAddPasskey,
  onRemovePasskey,
  accentColor
}: PasskeysPageProps) {
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyTrust, setNewKeyTrust] = useState<"High" | "Trusted" | "Standard">("High");
  
  const [isAdding, setIsAdding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [keyToRemove, setKeyToRemove] = useState<Passkey | null>(null);

  const handleAddNewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 1400)); // WebAuthn Simulator
    setIsAdding(false);

    onAddPasskey(newKeyName.trim(), newKeyTrust);
    setNewKeyName("");
    setNewKeyTrust("High");
    setShowAddModal(false);
  };

  const confirmRemoval = (key: Passkey) => {
    setKeyToRemove(key);
  };

  const handleExecuteRemoval = () => {
    if (keyToRemove) {
      onRemovePasskey(keyToRemove.id);
      setKeyToRemove(null);
    }
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";
  const accentButtonClass = accentColor === "cyan" 
    ? "bg-cyan-500 hover:bg-cyan-600 text-black font-semibold" 
    : "bg-violet-500 hover:bg-violet-600 text-white font-semibold";

  return (
    <div id="passkeys_viewport" className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <KeyRound className={`w-4 h-4 ${accentColorClass}`} />
            Hardware Passkeys Console
          </h2>
          <p className="text-xs text-slate-500 font-sans">Deploy, adjust, or revoke cryptographic WebAuthn physical secure tokens</p>
        </div>

        <button
          id="btn_open_passkey_modal"
          onClick={() => setShowAddModal(true)}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-2 ${accentButtonClass}`}
        >
          <Plus className="w-4 h-4" />
          Add Passkey Hardware
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Passkeys Registered Status List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4 font-sans">Active Hardware Handshakes</h3>

            {passkeys.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Fingerprint className="w-12 h-12 mx-auto text-slate-700 animate-pulse" />
                <p className="text-xs text-slate-400 font-sans">Zero credentials deployed. Your profile lacks hardware protection.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {passkeys.map((key) => (
                  <div key={key.id} className="p-4 bg-slate-900/60 border border-slate-805 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-0.5 ${accentBgClass}`}>
                        <Fingerprint className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-sans">{key.name}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            key.trustLevel === 'High' ? 'bg-cyan-950 text-cyan-400 border-cyan-550/20' : 
                            key.trustLevel === 'Trusted' ? 'bg-blue-955 text-blue-400 border-blue-500/10' : 'bg-slate-950 text-slate-500 border-slate-800'
                          }`}>
                            {key.trustLevel} Trust
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Deployed: {key.createdAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Last active: {key.lastUsedAt || "Never utilized"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onFocus={() => {}}
                        onClick={() => confirmRemoval(key)}
                        className="p-2 bg-slate-950/80 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Revoke Credential Lock"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Security Info Sidebar Card */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans">Dynamic Backup Checklist</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              To minimize lockouts, PrivateAuth recommends registering <strong>at least two passkey elements</strong>. Write one key on your stationary primary device TouchID, and key another to an offline mobile YubiKey or hardware companion.
            </p>

            <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl space-y-1.5 text-[10px] text-slate-400">
              <span className="font-mono uppercase text-cyan-400 font-bold block mb-1">Cryptographic Standard Check</span>
              <p className="leading-snug">
                WebAuthn utilizes public-key cryptography. The secure device holds a randomized private-key secret inside a secure chip, returning merely signed authentication payloads.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW PASSKEY WEBAUTHN SIMULATOR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-355 uppercase">Register Biometric Tag</span>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-xs">Close</button>
            </div>

            <form onSubmit={handleAddNewKey} className="p-5 space-y-4">
              <div className="space-y-1.1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Security Hardware Label / Nickname:</label>
                <input
                  type="text"
                  placeholder="e.g. Personal YubiKey 5C"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs py-2 px-3 rounded-lg text-white font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1.1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Security Device Trust Grade:</label>
                <select
                  value={newKeyTrust}
                  onChange={(e) => setNewKeyTrust(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs py-2 px-3 rounded-lg text-white font-mono focus:outline-none focus:ring-0"
                >
                  <option value="High">FIDO2 Hardware Token (YubiKey) - High</option>
                  <option value="Trusted">On-Device Biometric (TouchID/FaceID) - Trusted</option>
                  <option value="Standard">Browser Key-Ring (Virtual) - Standard</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-center">
                <Fingerprint className={`w-8 h-8 mx-auto ${accentColorClass} ${isAdding ? "animate-ping" : "animate-pulse"}`} />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {isAdding ? "Initiating hardware challenge handshake..." : "We will request TouchID permission or hardware tap simulation"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-1.5 rounded-lg border border-slate-800 text-slate-400 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || !newKeyName.trim()}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono uppercase ${accentButtonClass}`}
                >
                  {isAdding ? "Registering..." : "Tap & Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION WARNING MODAL BEFORE REVOKING PASSKEY */}
      {keyToRemove && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-red-950 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 bg-slate-950 border-b border-red-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase">Revocation Warning Protocol</span>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                You are requesting to revoke key credential tag <strong className="text-white">"{keyToRemove.name}"</strong>. This permanently deletes the assigned WebAuthn public key. 
              </p>
              <div className="p-2.5 bg-red-950/20 border border-red-955 rounded-lg text-[10px] text-slate-400 font-sans">
                Notice: If you lose backup credentials or delete all passkeys, access fallbacks strictly revert to weaker password inputs.
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setKeyToRemove(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-800 text-slate-400 text-xs font-mono"
                >
                  Abort Deletion
                </button>
                <button
                  onClick={handleExecuteRemoval}
                  className="flex-1 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-mono uppercase"
                >
                  Confirm Revocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
