/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  Info,
  Calendar,
  Layers,
  Terminal,
  Activity
} from "lucide-react";
import { SecurityLog, LogEvent } from "../types";

interface LogsPageProps {
  logs: SecurityLog[];
  accentColor: "cyan" | "violet";
}

export default function LogsPage({ logs, accentColor }: LogsPageProps) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const eventTypesInput = ["ALL", ...Object.values(LogEvent)];

  const filteredLogs = filterType === "ALL" 
    ? logs 
    : logs.filter(l => l.event === filterType);

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/20" : "border-violet-500/20";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";

  return (
    <div id="logs_viewport" className="space-y-6">
      
      {/* Intro Header */}
      <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <FileText className={`w-4 h-4 ${accentColorClass}`} />
          Minimal Security Audit Logs
        </h2>
        <p className="text-xs text-slate-500 font-sans">Inspect localized transactions without tracking user identifiers or physical address coordinates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Logs Event Filters list */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-fit space-y-4">
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            Audit Category Filters
          </h3>

          <div className="flex flex-col gap-1">
            {eventTypesInput.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`py-2 px-3 text-left text-xs font-mono rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                  filterType === t 
                    ? `${accentBgClass} font-semibold` 
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span>{t.replace(/_/g, " ")}</span>
                <span className="text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900 leading-none">
                  {t === "ALL" ? logs.length : logs.filter(l => l.event === t).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Logs display window */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">Security Log Terminal Output</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wide">ZERO_OUT_TELEMETRY</span>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-505 font-mono text-xs">
                <Terminal className="w-8 h-8 text-slate-705 animate-pulse mx-auto mb-2" />
                No matching transactions recorded under this categorization key.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-900/40 border border-slate-805 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs font-mono">
                    <div className="space-y-1.5 max-w-[80%]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          log.event.includes("SUCCESS") || log.event.includes("ENABLED") ? "bg-green-950/80 text-green-400 border border-green-500/10" :
                          log.event.includes("REMOVED") || log.event.includes("REFRESH") ? "bg-yellow-950/80 text-yellow-500 border border-yellow-500/10" :
                          log.event.includes("FAILURE") || log.event.includes("DELETED") ? "bg-red-950/80 text-red-400 border border-red-500/10" : "bg-cyan-950/80 text-cyan-400 border border-cyan-500/10"
                        }`}>
                          {log.event.replace("_", " ")}
                        </span>
                        
                        <span className="text-slate-550 text-[10px] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {log.timestamp}
                        </span>

                        <span className="text-slate-500 font-sans text-[11px] font-normal">
                          via {log.deviceInfo}
                        </span>
                      </div>

                      <p className="text-slate-300 font-sans leading-relaxed text-xs">{log.details}</p>
                    </div>

                    <div className="sm:text-right self-end sm:self-start">
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-slate-805 block">
                        {log.ipAddress}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 text-[11px] rounded-xl text-slate-400 font-sans leading-normal">
            <Info className="w-4 h-4 text-cyan-400 inline shrink-0 mr-1.5 -mt-0.5" />
            <strong>Minimal Compliance Framework:</strong> In keeping with strict user data defense legislation (e.g. GDPR, CCPA, and secure design paradigms), physical tracking headers, geo-coordinates, cookies identifiers, or device MAC profiles are strictly omitted.
          </div>
        </div>

      </div>
    </div>
  );
}
