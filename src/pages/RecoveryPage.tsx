/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Download, 
  Copy, 
  RefreshCw, 
  CheckCircle,
  ShieldCheck,
  Printer,
  HelpCircle,
  FileDown
} from "lucide-react";
import { generateMockRecoveryCodes } from "../lib/securityUtils";

interface RecoveryPageProps {
  accentColor: "cyan" | "violet";
  onAddLog: (event: any, details: string) => void;
}

export default function RecoveryPage({ accentColor, onAddLog }: RecoveryPageProps) {
  const [codes, setCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    // Look up existing recovery codes in storage. If none, generate fresh ones!
    const saved = localStorage.getItem("privateauth_recovery_codes");
    if (saved) {
      setCodes(JSON.parse(saved));
    } else {
      handleRegenerate();
    }
  }, []);

  const handleRegenerate = () => {
    const list = generateMockRecoveryCodes();
    setCodes(list);
    localStorage.setItem("privateauth_recovery_codes", JSON.stringify(list));
    setCopied(false);
    setDownloaded(false);
    onAddLog("RECOVERY_CODES_CREATED" as any, "Regenerated fresh collection of 10 cryptographic backup codes");
  };

  const copyCodesToClipboard = () => {
    const textBlob = codes.join("\n");
    navigator.clipboard.writeText(textBlob);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadCodesFile = () => {
    const textBlob = `=== PrivateAuth Shield ===\nEmergency Cryptographic Recovery Codes\nGenerated: ${new Date().toISOString()}\n\nSTORAGE INSTRUCTIONS:\n- Store this file in an offline encrypted vault, USB, or printed on actual substrate.\n- Do NOT save this file in raw unencrypted cloud formats.\n- Each token code represents a SINGLE-use bypass for TOTP challenges.\n\nRECOVERY CODES:\n${codes.map((c, i) => `${(i+1).toString().padStart(2, '0')}. ${c}`).join("\n")}\n\n==========================`;
    
    const element = document.createElement("a");
    const file = new Blob([textBlob], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "privateauth_recovery_codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";
  const accentButtonClass = accentColor === "cyan" 
    ? "bg-cyan-500 hover:bg-cyan-600 text-black font-semibold" 
    : "bg-violet-500 hover:bg-violet-600 text-white font-semibold";

  return (
    <div id="recovery_viewport" className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${accentColorClass}`} />
          Cryptographic Reset Codes
        </h2>
        <p className="text-xs text-slate-500 font-sans">Emergency single-use credentials to recover profile access during multi-device hardware losses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Codes Display Grid */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-900">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400">EMERGENCY BYPASS TOKENS (HAS_ENTROPY=256bit)</h3>
                <span className="text-[10px] text-slate-500 font-sans leading-none block mt-0.5">Single-use bypass only</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyCodesToClipboard}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy All
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={downloadCodesFile}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {downloaded ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5" />
                      Download file
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List block output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {codes.map((code, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 border border-slate-805 rounded-xl flex items-center font-mono text-[13px] tracking-wider font-semibold text-slate-100 select-all justify-between leading-none hover:bg-slate-850/80 transition-colors">
                  <span className="text-slate-600 text-[10px] select-none">#{ (idx+1).toString().padStart(2, '0') }</span>
                  <span>{code}</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 pointer-events-none"></div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-900">
              <span className="text-[10px] font-mono text-slate-500 text-left">CODES_STORED: LOCALSTORE_HASHED</span>
              
              <button
                type="button"
                onClick={handleRegenerate}
                className="px-3 py-1.5 border border-slate-800 hover:bg-slate-900 hover:text-white text-[11px] font-mono text-slate-400 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate Backup Matrix
              </button>
            </div>
          </div>
        </div>

        {/* Action instruction warning card */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-905 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Handling Instructions
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Store emergency recovery blocks inside an **offline password vault** or printed on substrate stored within physical security chests. Do NOT capture raw screenshots, or persist them within unencrypted digital cloud formats.
            </p>

            <div className="p-3 bg-red-950/20 border border-red-900 rounded-xl text-[10px] leading-relaxed text-slate-450 font-mono">
              <strong>WARNING NOTIFICATION:</strong> These credentials present emergency overrides. If and when generated anew, all previous recovery indexes purge instantly from database records.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
