/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Eye, 
  Trash2, 
  Download, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle,
  EyeOff,
  UserCheck
} from "lucide-react";
import { UserSession, PrivacySettings } from "../types";

interface PrivacyPageProps {
  user: UserSession;
  privacy: PrivacySettings;
  onUpdatePrivacy: (settings: PrivacySettings) => void;
  onUpdateUser: (newUser: UserSession) => void;
  onExportData: () => void;
  onDeleteAccountReq: () => void;
  accentColor: "cyan" | "violet";
}

export default function PrivacyPage({
  user,
  privacy,
  onUpdatePrivacy,
  onUpdateUser,
  onExportData,
  onDeleteAccountReq,
  accentColor
}: PrivacyPageProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTogglePreference = (key: keyof PrivacySettings) => {
    const next = { ...privacy, [key]: !privacy[key] };
    onUpdatePrivacy(next);
    
    // Wire up side effects
    if (key === "anonymousMode") {
      onUpdateUser({ ...user, anonymousMode: !privacy.anonymousMode });
      setSuccessMsg(`Anonymous mode ${!privacy.anonymousMode ? 'activated. Profile identity masked.' : 'deactivated.'}`);
    } else if (key === "ipAnonymization") {
      setSuccessMsg(`IP mask protocol ${!privacy.ipAnonymization ? 'enforced (192.168.x.x)' : 'removed.'}`);
    } else {
      setSuccessMsg("Privacy parameters updated successfully.");
    }
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";

  return (
    <div id="privacy_viewport" className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <Eye className={`w-4 h-4 ${accentColorClass}`} />
          Privacy Guard Parameters
        </h2>
        <p className="text-xs text-slate-505 font-sans">Maximize identity safety by enforcing strict local data minimization selectors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core preferences toggles list */}
        <div className="md:col-span-2 space-y-4">
          
          {successMsg && (
            <div className="p-3 bg-green-950/20 border border-green-500/15 text-xs text-green-400 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Local Minimization Configuration</h3>

            <div className="divide-y divide-slate-900 space-y-4">
              
              {/* Toggle 1: Data Minimization */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-white block font-sans">Active Data Minimization</span>
                  <p className="text-[11px] text-slate-500 font-sans">Strictly prevents our system from requiring verified telephone numbers, birthday entries, gender data, or physical mapping indicators.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.dataMinimization}
                  onChange={() => handleTogglePreference("dataMinimization")}
                  className={`h-4 w-4 rounded border-slate-800 bg-slate-950 px-1 focus:ring-0 cursor-pointer text-cyan-500`}
                />
              </div>

              {/* Toggle 2: Anonymous Mode */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-white block font-sans">Anonymous Profile Redundancy</span>
                  <p className="text-[11px] text-slate-500 font-sans">Masks your registration username from secondary UI displays. Shows generic "anonymous_user" tag across headers to preserve physical confidentiality.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.anonymousMode}
                  onChange={() => handleTogglePreference("anonymousMode")}
                  className={`h-4 w-4 rounded border-slate-800 bg-slate-950 focus:ring-0 cursor-pointer text-cyan-500`}
                />
              </div>

              {/* Toggle 3: IP Anonymization */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-white block font-sans">IP Address Truncation</span>
                  <p className="text-[11px] text-slate-500 font-sans">Instructs compliance logs to slice physical IP nodes, storing merely unmapped hashes like "192.168.x.x". Fully disrupts pinpoint localization attempts.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.ipAnonymization}
                  onChange={() => handleTogglePreference("ipAnonymization")}
                  className={`h-4 w-4 rounded border-slate-800 bg-slate-950 focus:ring-0 cursor-pointer text-cyan-500`}
                />
              </div>

              {/* Toggle 4: Analytics Disable */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-white block font-sans">Wipe Metrics Tracker</span>
                  <p className="text-[11px] text-slate-500 font-sans">Blocks tracking cookies, mouse-heatmap indicators, or interaction latency telemetry. Runs purely inside immediate viewport memory.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.disableAnalytics}
                  onChange={() => handleTogglePreference("disableAnalytics")}
                  className={`h-4 w-4 rounded border-slate-800 bg-slate-950 focus:ring-0 cursor-pointer text-cyan-500`}
                />
              </div>

              {/* Toggle 5: Consent Settings */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-white block font-sans">Identity Consent Record</span>
                  <p className="text-[11px] text-slate-500 font-sans">De-authorize zero-knowledge access privileges instantly. Disabling wipes immediate localized telemetry files.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.consentGranted}
                  onChange={() => handleTogglePreference("consentGranted")}
                  className={`h-4 w-4 rounded border-slate-800 bg-slate-950 focus:ring-0 cursor-pointer text-cyan-500`}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Export / Destruct buttons side widgets */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Sovereign Account Tools
            </h3>

            <p className="text-xs text-slate-400 leading-normal font-sans">
              Deploying zero-knowledge standards means you retain absolute ownership of compiled keys, logs, and authentication tags. 
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={onExportData}
                type="button"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:text-white rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Profile Archive
              </button>

              <button
                onClick={onDeleteAccountReq}
                type="button"
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 hover:border-red-500/30 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Sovereign WIPE (Self-Destruct)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
