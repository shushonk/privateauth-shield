/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, MessageSquare, AlertCircle, HelpCircle, Loader2, Send, Info } from "lucide-react";

interface AiAssistantProps {
  accentColor: "cyan" | "violet";
}

interface Message {
  text: string;
  sender: "user" | "guard";
  source?: string;
}

export default function AiAssistant({ accentColor }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Affirmative, identity auditor online. I can explain why passkeys are resilient to phishing, why SMS standard OTP is broken, how recovery protocols execute, and how PrivateAuth Shield enforces zero-knowledge architecture. Ask me any question. I cannot grant or override account access rights.",
      sender: "guard",
      source: "Local Auditing Policy"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const presetQuestions = [
    { label: "Why are Passkeys safer?", query: "Why are passkeys safer than standard text passwords?" },
    { label: "Why avoid SMS OTP?", query: "Why is SMS OTP avoided in secure systems?" },
    { label: "How do recovery codes process?", query: "How do recovery codes securely bypass lost devices?" },
    { label: "Define suspicious login?", query: "What is marked as a suspicious login attempt?" },
    { label: "Minimal data defense?", query: "How does privacy-focused auth protect against identity theft?" }
  ];

  const handleAskQuestion = async (query: string) => {
    if (isLoading || !query.trim()) return;

    // Add User message
    setMessages(prev => [...prev, { text: query, sender: "user" }]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query })
      });

      if (!response.ok) {
        throw new Error("Auditing API returned non-200 state");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        text: data.text, 
        sender: "guard", 
        source: data.source || "Security Audit Core" 
      }]);
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, { 
        text: "Signal timeout: Encountered offline or busy backend API. Passkeys utilize public-private keypairs. There are no passwords to phish, intercept, or steal, keeping database intrusion payloads completely useless to adversaries.", 
        sender: "guard",
        source: "Offline Core Fallback" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/30" : "border-violet-500/30";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10" : "bg-violet-500/10";
  const accentButtonClass = accentColor === "cyan" 
    ? "bg-cyan-500 hover:bg-cyan-600 text-black font-semibold" 
    : "bg-violet-500 hover:bg-violet-600 text-white font-semibold";

  return (
    <div id="ai_assistant_panel" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 mt-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`p-1.5 rounded-lg ${accentBgClass}`}>
          <Sparkles className={`w-5 h-5 ${accentColorClass}`} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white font-sans">AI Identity Audit Assistant</h3>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider">SECURE_LEARNING_CODER_AGENT</p>
        </div>
      </div>

      {/* Preset Topics pills */}
      <div className="mb-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2">Select Security Audits:</span>
        <div className="flex flex-wrap gap-1.5">
          {presetQuestions.map((pt, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(pt.query)}
              disabled={isLoading}
              className={`text-[10px] sm:text-xs font-mono px-2.5 py-1.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-md text-slate-300 hover:text-white text-left transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              • {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window Container */}
      <div className="bg-slate-950/90 border border-slate-905 rounded-xl overflow-hidden mb-4">
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-950 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
            <span>Encrypted Terminal Communication</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span>Verified Risk-Only Guide</span>
          </div>
        </div>

        <div className="p-4 h-64 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-slate-600">
                <span>{m.sender === "user" ? "You (Client Application)" : "PrivateAuth Guard (AI Auditor)"}</span>
                {m.source && (
                  <span className="text-slate-500 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">{m.source}</span>
                )}
              </div>
              <p 
                className={`max-w-[90%] text-xs font-mono p-2.5 rounded-xl leading-relaxed ${
                  m.sender === "user" 
                    ? `bg-slate-805 text-white border ${accentBorderClass} rounded-tr-none` 
                    : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <Loader2 className={`w-4 h-4 animate-spin ${accentColorClass}`} />
              <span>Analyzing threat databases and compiling cryptographical breakdown...</span>
            </div>
          )}
        </div>

        {/* Input area */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion(inputText);
          }} 
          className="p-2 bg-slate-900 border-t border-slate-950 flex gap-2"
        >
          <input
            id="ai_assist_input"
            type="text"
            placeholder="Type custom security or privacy question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-slate-700 text-xs px-3 py-2 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none transition-all"
          />
          <button
            id="ai_assist_submit"
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`p-2 rounded-lg transition-all ${accentButtonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Send security query"
          >
            <Send className="w-3.5 h-3.5 text-black" />
          </button>
        </form>
      </div>

      <div className="flex items-start gap-2 p-2.5 bg-red-950/20 border border-red-950 rounded-lg text-[10px] text-slate-400 leading-normal">
        <Info className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
        <p>
          <strong>Security Boundary Check:</strong> This assistant handles queries in isolated client-to-server frames. It cannot override login validations, reset actual server passwords, inspect customer key hashes, or make live firewall routing adjustments. All answers are purely explanatory advisory audits.
        </p>
      </div>
    </div>
  );
}
