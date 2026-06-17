/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Trash2, 
  X, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  FileText
} from "lucide-react";

// Lib & Types
import { UserSession, Passkey, SecuritySession, SecurityLog, PrivacySettings, LogEvent } from "./types";
import { 
  calculateSecurityScore, 
  calculatePrivacyScore 
} from "./lib/securityUtils";
import { 
  getSavedUser, 
  saveUser, 
  getSavedPasskeys, 
  savePasskeys, 
  getSavedSessions, 
  saveSessions, 
  getSavedLogs, 
  saveLogs, 
  getSavedPrivacySettings, 
  savePrivacySettings, 
  createSecurityLogEntry,
  addPasskey,
  removePasskey,
  revokeSession,
  revokeAllOtherSessions,
  generateAndSaveRecoveryCodes,
  exportUserDataJSON,
  deleteUserAccount,
  initializeLocalStorage
} from "./lib/mockAuth";

// Components
import Navigation from "./components/Navigation";
import VoiceAssistant from "./components/VoiceAssistant";
import AiAssistant from "./components/AiAssistant";

// Pages
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PasskeysPage from "./pages/PasskeysPage";
import MfaPage from "./pages/MfaPage";
import RecoveryPage from "./pages/RecoveryPage";
import SessionsPage from "./pages/SessionsPage";
import PrivacyPage from "./pages/PrivacyPage";
import LogsPage from "./pages/LogsPage";
import AdminPage from "./pages/AdminPage";
import ThreatPage from "./pages/ThreatPage";
import ArchitecturePage from "./pages/ArchitecturePage";

export default function App() {
  // Ensure storage is initialized
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  // Global State Stores
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [user, setUser] = useState<UserSession>(() => getSavedUser());
  const [passkeys, setPasskeys] = useState<Passkey[]>(() => getSavedPasskeys());
  const [sessions, setSessions] = useState<SecuritySession[]>(() => getSavedSessions());
  const [logs, setLogs] = useState<SecurityLog[]>(() => getSavedLogs());
  const [privacy, setPrivacy] = useState<PrivacySettings>(() => getSavedPrivacySettings());

  // Global Accents Configurations (Cyan or Violet)
  const [accentColor, setAccentColor] = useState<"cyan" | "violet">("cyan");

  // Notifications systems
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Modals controller
  const [showErasureModal, setShowErasureModal] = useState(false);

  // Sync helpers
  const triggerToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateUser = (next: UserSession) => {
    setUser(next);
    saveUser(next);
  };

  const handleAddPasskeyOnClient = (name: string, trust: "High" | "Trusted" | "Standard") => {
    const list = addPasskey(name, trust);
    setPasskeys(list);
    setLogs(getSavedLogs());
    triggerToast(`Biometric credential "${name}" registered successfully.`, "success");
  };

  const handleRemovePasskeyOnClient = (id: string) => {
    const list = removePasskey(id);
    setPasskeys(list);
    setLogs(getSavedLogs());
    triggerToast("Hardware token revoked permanent state.", "info");
  };

  const handleUpdateMfaOnClient = (isEnabled: boolean, secret?: string) => {
    const nextUser = { ...user, mfaSetUp: isEnabled, mfaSecret: secret || "" };
    handleUpdateUser(nextUser);
    createSecurityLogEntry(
      isEnabled ? LogEvent.MFA_ENABLED : LogEvent.MFA_DISABLED, 
      isEnabled ? "Local Authenticator TOTP Multi-factor activated." : "TOTP Multi-factor disabled."
    );
    setLogs(getSavedLogs());
    triggerToast(
      isEnabled ? "Dynamic TOTP MFA active. System integrity verified." : "MFA features deactivated.", 
      isEnabled ? "success" : "info"
    );
  };

  const handleRevokeSessionOnClient = (id: string) => {
    const list = revokeSession(id);
    setSessions(list);
    setLogs(getSavedLogs());
    triggerToast("External device session decoupled.", "info");
  };

  const handleRevokeAllOthersOnClient = () => {
    const list = revokeAllOtherSessions();
    setSessions(list);
    setLogs(getSavedLogs());
    triggerToast("All other active handshakes decoupled successfully.", "info");
  };

  const handleRegisterSuccess = (newUser: UserSession, codes: string[], key?: Passkey) => {
    setUser(newUser);
    saveUser(newUser);

    if (codes && codes.length > 0) {
      localStorage.setItem("privateauth_recovery_codes", JSON.stringify(codes));
    }

    if (key) {
      const keys = getSavedPasskeys();
      keys.push(key);
      savePasskeys(keys);
      setPasskeys(keys);
    }

    createSecurityLogEntry(LogEvent.LOGIN_SUCCESS, `Assembled client registration successfully`);
    setLogs(getSavedLogs());
    triggerToast("Cryptographic account assembled! Safe sessions initialized.", "success");
    setActiveTab("dashboard");
  };

  const handleLoginSuccess = (verifiedUser: UserSession) => {
    setUser(verifiedUser);
    saveUser(verifiedUser);
    setLogs(getSavedLogs());
    triggerToast("Handshake verification successful! viewport unlocked.", "success");
  };

  const handleLogout = () => {
    const nextUser: UserSession = {
      username: user.username,
      isLoggedIn: false,
      mfaSetUp: user.mfaSetUp,
      mfaVerified: false,
      anonymousMode: user.anonymousMode,
      optionalEmail: user.optionalEmail,
    };
    setUser(nextUser);
    saveUser(nextUser);
    createSecurityLogEntry(LogEvent.SESSION_REVOKED, `Signoff session executed from application header`);
    setLogs(getSavedLogs());
    triggerToast("Active credentials disconnected safely.", "info");
    setActiveTab("landing");
  };

  const handleExportDataOnClient = () => {
    try {
      const dataStr = exportUserDataJSON();
      const element = document.createElement("a");
      const file = new Blob([dataStr], { type: "application/json" });
      element.href = URL.createObjectURL(file);
      element.download = "privateauth_profile_archive.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      triggerToast("JSON data archive compiled and downloaded.", "success");
      setLogs(getSavedLogs());
    } catch (e) {
      triggerToast("Failed compiling personal data archive.", "error");
    }
  };

  const handleWipeAccountOnClient = () => {
    deleteUserAccount();
    setUser({
      username: "proto_alice",
      isLoggedIn: false,
      mfaSetUp: false,
      mfaVerified: false,
      anonymousMode: false,
      optionalEmail: undefined,
    });
    setPasskeys([]);
    setSessions([]);
    setLogs([]);
    setPrivacy({
      dataMinimization: true,
      optionalEmailEnabled: false,
      anonymousMode: false,
      disableAnalytics: true,
      ipAnonymization: true,
      consentGranted: true,
    });
    setShowErasureModal(false);
    triggerToast("Privacy sovereign wipe completed. All storage destroyed.", "info");
    setActiveTab("landing");
  };

  const toggleAccent = () => {
    setAccentColor(prev => prev === "cyan" ? "violet" : "cyan");
    triggerToast(`Visual accent profile switched.`, "info");
  };

  const handleAddLog = (event: LogEvent, details: string) => {
    createSecurityLogEntry(event, details);
    setLogs(getSavedLogs());
  };

  // Score metrics
  const hasPasskey = passkeys.length > 0;
  const metricsScoreSecurity = calculateSecurityScore(
    hasPasskey,
    passkeys.length,
    user.mfaSetUp,
    !!localStorage.getItem("privateauth_recovery_codes"),
    sessions.length,
    true
  );

  const metricsScorePrivacy = calculatePrivacyScore(
    privacy.dataMinimization,
    !!user.optionalEmail,
    privacy.anonymousMode,
    privacy.disableAnalytics,
    privacy.ipAnonymization
  );

  const accentBorderClass = accentColor === "cyan" ? "border-cyan-400" : "border-violet-400";
  const accentTextClass = accentColor === "cyan" ? "text-cyan-400" : "text-violet-400";
  const accentBgClass = accentColor === "cyan" ? "bg-cyan-500/10 text-cyan-400" : "bg-violet-500/10 text-violet-400";

  return (
    <div id="app_frame" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans transition-all selection:bg-cyan-950 selection:text-cyan-400">
      
      {/* Dynamic Toast alerts overlay */}
      {toast && (
        <div id="toast_notification_panel" className="fixed top-20 right-6 z-55 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <div className={`p-4 rounded-xl border flex items-center gap-3 shadow-xl backdrop-blur-md bg-slate-950/95 ${
            toast.type === "success" ? "border-emerald-500/20 text-emerald-400" :
            toast.type === "error" ? "border-red-500/20 text-red-400" : "border-blue-500/20 text-blue-400"
          }`}>
            {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="text-xs font-mono font-bold leading-normal">{toast.text}</span>
          </div>
        </div>
      )}

      {/* Main Structural Drawer Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        securityScore={metricsScoreSecurity.score}
        privacyScore={metricsScorePrivacy.score}
        onLogout={handleLogout}
        accentColor={accentColor}
        toggleAccent={toggleAccent}
      />

      {/* Application core workspace container split */}
      <div className="flex-1 flex pt-16 md:pl-64">
        
        {/* Main interactive Tab Content container */}
        <main id="main_workspace" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl mx-auto space-y-8 pb-32">
          
          {activeTab === "landing" && (
            <LandingPage onNav={setActiveTab} user={user} accentColor={accentColor} />
          )}

          {activeTab === "dashboard" && (
            <DashboardPage
              user={user}
              passkeys={passkeys}
              sessions={sessions}
              logs={logs}
              securityScore={metricsScoreSecurity.score}
              privacyScore={metricsScorePrivacy.score}
              securityScoreLevel={metricsScoreSecurity.level}
              privacyScoreLevel={metricsScorePrivacy.level}
              securityScoreColor={metricsScoreSecurity.color}
              privacyScoreColor={metricsScorePrivacy.color}
              onNav={setActiveTab}
              onExportData={handleExportDataOnClient}
              onDeleteAccountReq={() => setShowErasureModal(true)}
              accentColor={accentColor}
              privacy={privacy}
            />
          )}

          {activeTab === "login" && (
            <LoginPage
              storedUser={user}
              storedPasskeys={passkeys}
              onLoginSuccess={handleLoginSuccess}
              onNav={setActiveTab}
              accentColor={accentColor}
              onAddLog={handleAddLog}
            />
          )}

          {activeTab === "register" && (
            <RegisterPage
              onRegisterSuccess={handleRegisterSuccess}
              accentColor={accentColor}
              onNav={setActiveTab}
            />
          )}

          {activeTab === "passkeys" && (
            <PasskeysPage
              passkeys={passkeys}
              onAddPasskey={handleAddPasskeyOnClient}
              onRemovePasskey={handleRemovePasskeyOnClient}
              accentColor={accentColor}
            />
          )}

          {activeTab === "mfa" && (
            <MfaPage
              user={user}
              onUpdateMfa={handleUpdateMfaOnClient}
              accentColor={accentColor}
            />
          )}

          {activeTab === "recovery" && (
            <RecoveryPage
              accentColor={accentColor}
              onAddLog={handleAddLog}
            />
          )}

          {activeTab === "sessions" && (
            <SessionsPage
              sessions={sessions}
              onRevokeSession={handleRevokeSessionOnClient}
              onRevokeAllOthers={handleRevokeAllOthersOnClient}
              accentColor={accentColor}
            />
          )}

          {activeTab === "privacy" && (
            <PrivacyPage
              user={user}
              privacy={privacy}
              onUpdatePrivacy={setPrivacy}
              onUpdateUser={handleUpdateUser}
              onExportData={handleExportDataOnClient}
              onDeleteAccountReq={() => setShowErasureModal(true)}
              accentColor={accentColor}
            />
          )}

          {activeTab === "logs" && (
            <LogsPage
              logs={logs}
              accentColor={accentColor}
            />
          )}

          {activeTab === "admin" && (
            <AdminPage
              accentColor={accentColor}
              rateLimitActive={false}
            />
          )}

          {activeTab === "threat" && (
            <ThreatPage
              accentColor={accentColor}
            />
          )}

          {activeTab === "architecture" && (
            <ArchitecturePage
              accentColor={accentColor}
            />
          )}

          {/* Combined bento expansions layout (AI & Voice interactive boxes) */}
          {activeTab !== "landing" && activeTab !== "login" && activeTab !== "register" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-900 mt-12">
              <VoiceAssistant onCommand={setActiveTab} accentColor={accentColor} />
              <AiAssistant accentColor={accentColor} />
            </div>
          )}

        </main>
      </div>

      {/* REVERSIBLE/IRREVERSIBLE ERASURE ENFORCEMENT MODAL */}
      {showErasureModal && (
        <div id="erasure_warning_modal" className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-55 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-950 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 bg-slate-950 border-b border-red-955 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
              <span className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase">Irreversible Sovereign Wipe Command</span>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                You are authorizing a **Sovereign Wipe self-destruct function**. This process wipes local keys, deactivates active cookies, clears recovery tokens, and removes audit tables from browser storage files permanently.
              </p>
              
              <div className="p-3 bg-red-950/20 border border-red-950 rounded-xl text-[10px] leading-normal text-slate-400 font-sans">
                Notice: PrivateAuth stores no credentials on cloud databases, representing zero backups. This command cannot be undone. All active decryption indexes expire instantly.
              </div>

              <div className="flex gap-2">
                <button
                  id="erasure_cancel"
                  onClick={() => setShowErasureModal(false)}
                  className="flex-1 py-1.5 rounded-lg border border-slate-805 text-slate-400 text-xs font-mono cursor-pointer"
                >
                  ABORT
                </button>
                <button
                  id="erasure_comply"
                  onClick={handleWipeAccountOnClient}
                  className="flex-1 py-1.5 rounded-lg bg-red-500 hover:bg-red-650 text-white text-xs font-mono font-bold uppercase transition-all tracking-wider cursor-pointer"
                >
                  EXECUTE WIPE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

