/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Shield, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Lock, 
  KeyRound, 
  Clock, 
  Eye, 
  FileText, 
  LayoutDashboard, 
  Cpu, 
  AlertTriangle, 
  Settings2, 
  Mic, 
  Sparkles,
  Zap
} from "lucide-react";
import { UserSession } from "../types";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserSession;
  securityScore: number;
  privacyScore: number;
  onLogout: () => void;
  accentColor: "cyan" | "violet";
  toggleAccent: () => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  user,
  securityScore,
  privacyScore,
  onLogout,
  accentColor,
  toggleAccent
}: NavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getAccentClass = (isActive: boolean) => {
    if (isActive) {
      return accentColor === "cyan" 
        ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400" 
        : "bg-violet-500/10 text-violet-400 border-l-2 border-violet-400";
    }
    return "text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent transition-all";
  };

  const getButtonAccentClass = () => {
    return accentColor === "cyan"
      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-black font-semibold"
      : "bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] text-white font-semibold";
  };

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: "landing", label: "Front Terminal", icon: Shield },
    { id: "dashboard", label: "Security Dashboard", icon: LayoutDashboard },
    { id: "passkeys", label: "Multi-Device Passkeys", icon: KeyRound },
    { id: "mfa", label: "TOTP MFA Core", icon: Lock },
    { id: "recovery", label: "Cryptographic Reset", icon: AlertTriangle },
    { id: "sessions", label: "Active Session Footprint", icon: Clock },
    { id: "privacy", label: "Privacy Guard Settings", icon: Eye },
    { id: "logs", label: "Minimal Audit Logs", icon: FileText },
    { id: "admin", label: "Threat Analytics Console", icon: Settings2 },
    { id: "threat", label: "Threat Modeling Vector", icon: Shield },
    { id: "architecture", label: "Software Architecture", icon: Cpu },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <header id="app_header" className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/70 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <button 
            id="mobile_menu_trigger"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-white md:hidden"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("landing")}>
            <div className={`p-1.5 rounded-lg ${accentColor === 'cyan' ? 'bg-cyan-500/10' : 'bg-violet-500/10'}`}>
              <Shield className={`w-6 h-6 ${accentColor === 'cyan' ? 'text-cyan-400' : 'text-violet-400'}`} />
            </div>
            <div>
              <span className="font-sans font-bold tracking-tight text-white block">PrivateAuth</span>
              <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase block -mt-1">Shield Tech</span>
            </div>
          </div>
        </div>

        {/* Global Security Metrics */}
        {user.isLoggedIn && (
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/60 rounded-full border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Security Check:</span>
              <span className={`text-[11px] font-bold font-mono ${securityScore >= 70 ? 'text-cyan-400' : 'text-red-400'}`}>
                {securityScore}%
              </span>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${securityScore >= 70 ? 'bg-cyan-400' : 'bg-red-400'}`}
                  style={{ width: `${securityScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/60 rounded-full border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Confidentiality Checklist:</span>
              <span className={`text-[11px] font-bold font-mono ${privacyScore >= 70 ? 'text-violet-400' : 'text-yellow-400'}`}>
                {privacyScore}%
              </span>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${privacyScore >= 70 ? 'bg-violet-400' : 'bg-yellow-400'}`}
                  style={{ width: `${privacyScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Accent Color Switcher */}
          <button 
            id="accent_color_toggle"
            onClick={toggleAccent}
            className="p-1 px-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-950/40"
            title="Switch Core Cyber Accents"
          >
            <Zap className={`w-3.5 h-3.5 ${accentColor === 'cyan' ? 'text-cyan-400 fill-cyan-400' : 'text-violet-400 fill-violet-400'}`} />
            <span className="hidden sm:inline">Theme Profile</span>
          </button>

          {user.isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-right">
                <span className="hidden sm:block text-xs text-slate-400 font-sans">
                  Hello, <strong className="text-white font-medium">{user.anonymousMode ? "anonymous_user" : user.username}</strong>
                </span>
                <span className="sm:hidden text-xs text-slate-400 font-mono">
                  {user.anonymousMode ? "anon" : user.username.substring(0, 8)}
                </span>
              </div>
              
              <button 
                id="header_logout"
                onClick={onLogout}
                className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                title="Secure Disconnection"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                id="header_login_req"
                onClick={() => setActiveTab("login")}
                className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg font-medium"
              >
                Sign In
              </button>
              <button 
                id="header_register_req"
                onClick={() => setActiveTab("register")}
                className={`text-xs px-3.5 py-1.5 rounded-lg transition-all ${getButtonAccentClass()}`}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside id="desktop_sidebar" className="fixed top-16 left-0 bottom-0 w-64 bg-slate-950 border-r border-slate-900 flex-none hidden md:flex flex-col justify-between py-6 z-30">
        <div className="flex flex-col gap-6 overflow-y-auto px-4 h-full">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-3 block mb-2">Auth Operations</span>
            <nav className="flex flex-col gap-1">
              {navItems.slice(0, 8).map((item) => {
                const Icon = item.icon;
                const isAvailable = user.isLoggedIn || item.id === "landing";
                return (
                  <button
                    key={item.id}
                    id={`sidebar_tab_${item.id}`}
                    onClick={() => {
                      if (isAvailable) {
                        setActiveTab(item.id);
                      } else {
                        setActiveTab("login");
                      }
                    }}
                    className={`flex items-center gap-3 py-2.5 px-3 text-sm rounded-lg text-left font-sans ${getAccentClass(activeTab === item.id)} ${!isAvailable && "opacity-50 cursor-pointer"}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{item.label}</span>
                    {!isAvailable && <Lock className="w-3 h-3 text-slate-600" />}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-3 block mb-2 font-sans">Training & Threat Modeling</span>
            <nav className="flex flex-col gap-1">
              {navItems.slice(8).map((item) => {
                const Icon = item.icon;
                const isAvailable = user.isLoggedIn || item.id === "landing" || item.id === "threat" || item.id === "architecture";
                return (
                  <button
                    key={item.id}
                    id={`sidebar_tab_${item.id}`}
                    onClick={() => {
                      if (isAvailable) {
                        setActiveTab(item.id);
                      } else {
                        setActiveTab("login");
                      }
                    }}
                    className={`flex items-center gap-3 py-2.5 px-3 text-sm rounded-lg text-left font-sans ${getAccentClass(activeTab === item.id)} ${!isAvailable && "opacity-50 cursor-pointer"}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-xs">{item.label}</span>
                    {!isAvailable && <Lock className="w-3 h-3 text-slate-600" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="px-6 pt-4 border-t border-slate-900 flex flex-col gap-2">
          <div className="flex items-center gap-2 py-1 px-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-500">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>SHIELD SECURITY ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div id="mobile_drawer_overlay" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 md:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute top-0 bottom-0 left-0 w-4/5 max-w-sm bg-slate-950 border-r border-slate-900 p-6 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-6 overflow-y-auto h-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className={`w-6 h-6 ${accentColor === 'cyan' ? 'text-cyan-400' : 'text-violet-400'}`} />
                  <span className="font-sans font-bold text-white tracking-tight">PrivateAuth Shield</span>
                </div>
                <button 
                  id="mobile_drawer_close"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-3 block mb-2">Auth Center</span>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isAvailable = user.isLoggedIn || item.id === "landing" || item.id === "threat" || item.id === "architecture";
                    return (
                      <button
                        key={item.id}
                        id={`mobile_tab_${item.id}`}
                        onClick={() => {
                          setIsOpen(false);
                          if (isAvailable) {
                            setActiveTab(item.id);
                          } else {
                            setActiveTab("login");
                          }
                        }}
                        className={`flex items-center gap-3 py-2.5 px-3 text-sm rounded-lg text-left ${getAccentClass(activeTab === item.id)} ${!isAvailable && 'opacity-50'}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1">{item.label}</span>
                        {!isAvailable && <Lock className="w-3 h-3 text-slate-600" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900 flex flex-col gap-4">
              {user.isLoggedIn && (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium font-sans"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
