/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Clock, 
  Trash2, 
  ShieldAlert, 
  Monitor, 
  Smartphone, 
  HelpCircle, 
  CheckCircle,
  AlertOctagon
} from "lucide-react";
import { SecuritySession } from "../types";

interface SessionsPageProps {
  sessions: SecuritySession[];
  onRevokeSession: (id: string) => void;
  onRevokeAllOthers: () => void;
  accentColor: "cyan" | "violet";
}

export default function SessionsPage({
  sessions,
  onRevokeSession,
  onRevokeAllOthers,
  accentColor
}: SessionsPageProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRevokeSingle = (id: string, dev: string) => {
    onRevokeSession(id);
    setSuccessMsg(`Session for ${dev} terminated successfully.`);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleRevokeOthers = () => {
    onRevokeAllOthers();
    setSuccessMsg("All other active device handshakes terminated successfully.");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";

  return (
    <div id="sessions_viewport" className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <Clock className={`w-4 h-4 ${accentColorClass}`} />
            Active Session Footprint
          </h2>
          <p className="text-xs text-slate-500 font-sans">Inspect, rotate, or force disconnect key authentication sessions associated with your credentials</p>
        </div>

        {sessions.length > 1 && (
          <button
            onClick={handleRevokeOthers}
            className="px-3 py-1.5 border border-red-500/25 hover:border-red-500/50 hover:bg-red-500/10 text-xs font-mono text-slate-300 hover:text-red-400 rounded-lg transition-all cursor-pointer"
          >
            Force Wipe Other Handshakes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sessions list */}
        <div className="md:col-span-2 space-y-4">
          
          {successMsg && (
            <div className="p-3 bg-green-950/20 border border-green-500/15 rounded-xl text-xs text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">IDENTIFIED HANDSHAKES ({sessions.length})</h3>

            <div className="space-y-3">
              {sessions.map((sess) => {
                const isMobile = sess.device.toLowerCase().includes("iphone") || sess.device.toLowerCase().includes("android") || sess.device.toLowerCase().includes("phone");
                return (
                  <div key={sess.id} className={`p-4 bg-slate-905 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    sess.current ? `${accentBorderClass} bg-slate-900/40` : "border-slate-805 bg-slate-900/10"
                  }`}>
                    
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-0.5 ${sess.current ? accentBgClass : "bg-slate-900 text-slate-505"}`}>
                        {isMobile ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-sans">{sess.device}</span>
                          <span className="text-xs text-slate-400 font-mono">({sess.browser} on {sess.os})</span>
                          {sess.current ? (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded-md border border-green-500/20">
                              Current Session
                            </span>
                          ) : (
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                              sess.trustLevel === 'Trusted' ? 'bg-slate-900 text-slate-500 border-slate-805' : 'bg-red-950/20 text-red-400 border-red-950'
                            }`}>
                              {sess.trustLevel}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-3.5 gap-y-0.5 text-[10px] text-slate-500 font-mono">
                          <span>Handshake: {sess.createdTime}</span>
                          <span>•</span>
                          <span>Last Active: {sess.lastActiveTime}</span>
                          <span>•</span>
                          <span>IPv4: {sess.ipAddress}</span>
                        </div>
                      </div>
                    </div>

                    {!sess.current && (
                      <button
                        onClick={() => handleRevokeSingle(sess.id, sess.device)}
                        className="p-2 bg-slate-950/80 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all self-end sm:self-center"
                        title="Force Decouple Device Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sessions sidebar details */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <AlertOctagon className="text-cyan-400 w-4 h-4" />
              Handshake Rotation
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              To defend against passive token theft or session hijackers, PrivateAuth implements a **sliding-expiry session rotation policy**. Authentication tokens decay and rotate dynamically every 10 minutes (matching your active countdown metrics).
            </p>

            <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl text-[10px] font-mono leading-relaxed text-slate-400">
              <strong>HIJACK_SAFETY:</strong> If and when you execute a device revocation command, all related JSON Auth cookies are invalidated across API gateway records instantly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
