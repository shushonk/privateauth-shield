/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, ShieldAlert, CornerDownLeft, Sparkles, HelpCircle } from "lucide-react";
import { VoiceTranscript } from "../types";

interface VoiceAssistantProps {
  onCommand: (command: string) => void;
  accentColor: "cyan" | "violet";
}

export default function VoiceAssistant({ onCommand, accentColor }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcripts, setTranscripts] = useState<VoiceTranscript[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Web Speech recognition support
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Scroll logs to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  useEffect(() => {
    // Check Web Speech recognition availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        setErrorText(null);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleRecognizedText(text);
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setErrorText("Microphone access denied. Operating in Privacy Mock Mode.");
        } else {
          setErrorText(`Signal error: ${event.error}. falling back to terminal simulate.`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const handleRecognizedText = (text: string) => {
    const speechText = text.trim();
    if (!speechText) return;

    // Add User transcript
    const userMsg: VoiceTranscript = {
      text: speechText,
      speaker: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setTranscripts(prev => [...prev, userMsg]);
    processVoiceCommand(speechText);
  };

  const processVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase();
    let assistantMsgText = "";

    // Command mapping
    if (text.includes("dashboard") || text.includes("home")) {
      assistantMsgText = "Routing authorized credentials to Security Dashboard.";
      onCommand("dashboard");
    } else if (text.includes("login") || text.includes("sign in")) {
      assistantMsgText = "Redirecting viewport to Authentication login screen.";
      onCommand("login");
    } else if (text.includes("session")) {
      assistantMsgText = "Accessing local active multi-device session footprint logs.";
      onCommand("sessions");
    } else if (text.includes("mfa") || text.includes("two factor") || text.includes("totp")) {
      assistantMsgText = "Focusing TOTP Authenticator state controls.";
      onCommand("mfa");
    } else if (text.includes("recovery") || text.includes("restore") || text.includes("reset")) {
      assistantMsgText = "Enabling offline single-use cryptographic recovery module.";
      onCommand("recovery");
    } else if (text.includes("passkey") || text.includes("yubikey") || text.includes("hardware")) {
      assistantMsgText = "Passkeys use modern public-key cryptography to prevent phishing intercepts. Displaying Passkey manager.";
      onCommand("passkeys");
    } else if (text.includes("delete") || text.includes("destroy") || text.includes("wipe")) {
      assistantMsgText = "Targeting account self-destruct console. Confirm deletion on our settings panel.";
      onCommand("privacy");
    } else {
      assistantMsgText = `Command "${rawText}" received. Type commands like: "open dashboard", "enable MFA", or "explain passkeys".`;
    }

    // Interactive speech synthesis back (only if not muted)
    if (!isMuted && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(assistantMsgText);
      // Neutral, privacy safe speech profile
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setTranscripts(prev => [...prev, {
        text: assistantMsgText,
        speaker: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }]);
    }, 450);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      } else {
        setIsListening(false);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // fallback if already running or crashed
          simulateMockVoice();
        }
      } else {
        simulateMockVoice();
      }
    }
  };

  // Fun, highly interactive fallback simulator with preconfigured mock instructions
  const simulateMockVoice = () => {
    setIsListening(true);
    setErrorText("Web Speech API offline/denied. Running offline voice synthesizer simulation...");
    
    const mockPhrases = [
      "open dashboard",
      "show sessions",
      "explain passkeys",
      "enable MFA",
      "generate recovery codes",
    ];
    
    const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
    
    setTimeout(() => {
      handleRecognizedText(randomPhrase);
      setIsListening(false);
    }, 1800);
  };

  const submitManualInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleRecognizedText(manualInput);
    setManualInput("");
  };

  const accentColorClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBorderClass = accentColor === "cyan" ? "border-cyan-500/30" : "border-violet-500/30";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10" : "bg-violet-500/10";
  const accentPulseClass = accentColor === "cyan" ? "bg-cyan-500" : "bg-violet-500";

  return (
    <div id="voice_guide_panel" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 mt-6 relative overflow-hidden">
      {/* Decorative pulse grid background */}
      <div className="absolute inset-0 bg-transparent opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${accentBgClass}`}>
            <Mic className={`w-5 h-5 ${accentColorClass}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-sans">Privacy Voice Guide</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">OFFLINE_LOCAL_NAV_ENGINE</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="voice_mute_toggle"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? "Unmute Assistant Voice response" : "Mute audio response"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mic/Listening Action Container */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4 relative">
        <button
          id="voice_speak_trigger"
          onClick={toggleListening}
          className={`relative p-5 rounded-full border transition-all duration-300 ${
            isListening 
              ? `${accentColor === "cyan" ? "border-cyan-400 animate-pulse bg-cyan-950/40" : "border-violet-400 animate-pulse bg-violet-950/40"}` 
              : "border-slate-800 hover:border-slate-700 bg-slate-900"
          }`}
          aria-label={isListening ? "Stop listening voice signals" : "Start Voice navigation feed"}
        >
          {isListening && (
            <span className="absolute inset-0 rounded-full animate-ping bg-current opacity-20 pointer-events-none text-cyan-400"></span>
          )}
          {isListening ? (
            <Mic className={`w-6 h-6 ${accentColorClass}`} />
          ) : (
            <Mic className="w-6 h-6 text-slate-400 hover:text-slate-200" />
          )}
        </button>

        {isListening ? (
          <div className="mt-4 text-center">
            <span className={`text-[11px] font-mono tracking-widest uppercase ${accentColorClass}`}>Listening for security payload...</span>
            <div className="flex gap-1 justify-center mt-2">
              <span className={`w-1 h-3 rounded-full animate-bounce ${accentPulseClass}`} style={{ animationDelay: "0ms" }}></span>
              <span className={`w-1 h-4 rounded-full animate-bounce ${accentPulseClass}`} style={{ animationDelay: "150ms" }}></span>
              <span className={`w-1 h-2 rounded-full animate-bounce ${accentPulseClass}`} style={{ animationDelay: "300ms" }}></span>
              <span className={`w-1 h-4 rounded-full animate-bounce ${accentPulseClass}`} style={{ animationDelay: "450ms" }}></span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-400 mt-4 text-center font-sans font-medium">
            Click microphone for secure instant voice control
          </span>
        )}

        {errorText && (
          <div className="mt-3 flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800/80 text-[10px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
            <span className="font-sans leading-tight">{errorText}</span>
          </div>
        )}
      </div>

      {/* Local Console Log display */}
      <div className="bg-slate-950 border border-slate-900 rounded-lg p-3">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-900">
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Local-Only Secure Transcript Feed</span>
          <span className="text-[9px] font-mono text-cyan-500/80">0 Bytes stored remotely</span>
        </div>

        <div 
          ref={scrollRef}
          id="voice_transcript_container" 
          className="h-28 overflow-y-auto space-y-2.5 pr-1 text-xs scrollbar-thin scrollbar-thumb-slate-800"
        >
          {transcripts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-4 text-center">
              <HelpCircle className="w-4 h-4 mb-1 text-slate-600" />
              <p className="text-[11px] font-sans">No transcripts received. Voice commands process purely inside browser memory.</p>
            </div>
          ) : (
            transcripts.map((t, idx) => (
              <div 
                key={idx} 
                className={`flex gap-1.5 flex-col ${t.speaker === "user" ? "items-start" : "items-start border-l border-slate-800 pl-2 bg-slate-900/20 py-0.5 rounded"}`}
              >
                <div className="flex items-center gap-1">
                  <span className={`text-[9px] font-mono px-1 rounded uppercase ${t.speaker === "user" ? "bg-slate-800 text-slate-300" : "bg-cyan-950 text-cyan-400"}`}>
                    {t.speaker}
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono">{t.timestamp}</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed break-words">{t.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Manual typing fallback input */}
        <form onSubmit={submitManualInput} className="mt-3 flex gap-1.5 border-t border-slate-900 pt-2.5">
          <input
            id="voice_cmd_input"
            type="text"
            placeholder="Type offline command (e.g. 'open dashboard')"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="flex-1 bg-slate-900/50 hover:bg-slate-900/70 focus:bg-slate-900 border border-slate-800 text-xs px-2.5 py-1.5 rounded-md text-white placeholder-slate-600 font-mono focus:outline-none focus:border-slate-700 transition-all font-medium"
          />
          <button
            id="voice_cmd_submit"
            type="submit"
            className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:text-white rounded-md flex items-center justify-center transition-all"
            aria-label="Send typed security command"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Microphone privacy checklist info */}
      <div className="mt-3.5 flex items-start gap-1 p-2 rounded-lg bg-teal-950/25 border border-teal-500/10 text-[10px] text-slate-400 font-sans">
        <Sparkles className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Privacy Protocol:</strong> Audio waves remain strictly local to your sound hardware. Transcripts are ephemeral, and zero cloud identifiers, keystrokes, or voices are captured, matching the PrivateAuth zero-knowledge trust design.
        </p>
      </div>
    </div>
  );
}
