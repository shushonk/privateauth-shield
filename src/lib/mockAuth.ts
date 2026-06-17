/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserSession, Passkey, SecuritySession, SecurityLog, PrivacySettings, LogEvent } from "../types";
import { anonymizeIP, generateMockRecoveryCodes } from "./securityUtils";

const STATE_KEYS = {
  USER_SESSION: "privateauth_user_session",
  PASSKEYS: "privateauth_passkeys",
  SESSIONS: "privateauth_sessions",
  LOGS: "privateauth_logs",
  RECOVERY_CODES: "privateauth_recovery_codes",
  PRIVACY_SETTING: "privateauth_privacy_settings",
};

// Default structures if local storage is empty
const defaultUser: UserSession = {
  username: "proto_alice",
  isLoggedIn: true, // Auto-logged in on initial app loading for nice immediate dashboard, but user can log out
  mfaSetUp: false,
  mfaVerified: false,
  anonymousMode: false,
  optionalEmail: "alice@protonmail.ch",
  mfaSecret: "",
};

const defaultPasskeys: Passkey[] = [
  {
    id: "pk_1",
    name: "YubiKey 5C NFC",
    createdAt: "2026-05-15 14:32",
    lastUsedAt: "2026-06-16 08:30",
    trustLevel: "High",
  },
  {
    id: "pk_2",
    name: "Apple Touch ID (MacBook Air)",
    createdAt: "2026-06-01 10:15",
    lastUsedAt: "2026-06-16 09:02",
    trustLevel: "Trusted",
  },
];

const defaultSessions: SecuritySession[] = [
  {
    id: "sess_current",
    current: true,
    browser: "Chrome",
    device: "MacBook Air",
    os: "macOS",
    createdTime: "2026-06-16 08:12",
    lastActiveTime: "Just now",
    ipAddress: "192.168.1.15",
    trustLevel: "Trusted",
  },
  {
    id: "sess_2",
    current: false,
    browser: "Firefox",
    device: "iPhone 15",
    os: "iOS",
    createdTime: "2026-06-15 18:41",
    lastActiveTime: "12 hours ago",
    ipAddress: "172.56.24.89",
    trustLevel: "Trusted",
  },
  {
    id: "sess_3",
    current: false,
    browser: "Safari",
    device: "Unknown PC",
    os: "Linux",
    createdTime: "2026-06-12 02:11",
    lastActiveTime: "4 days ago",
    ipAddress: "85.203.41.22",
    trustLevel: "Unknown Device",
  },
];

const defaultLogs: SecurityLog[] = [
  {
    id: "log_1",
    event: LogEvent.LOGIN_SUCCESS,
    timestamp: "2026-06-16 08:12",
    deviceInfo: "Chrome / MacBook Air",
    ipAddress: "192.168.x.x",
    details: "Interactive password fallback login",
  },
  {
    id: "log_2",
    event: LogEvent.TOKEN_REFRESH,
    timestamp: "2026-06-16 08:42",
    deviceInfo: "Chrome / MacBook Air",
    ipAddress: "192.168.x.x",
    details: "Session duration extended securely",
  },
  {
    id: "log_3",
    event: LogEvent.PASSKEY_ADDED,
    timestamp: "2026-06-01 10:15",
    deviceInfo: "Safari / MacBook Air",
    ipAddress: "192.168.x.x",
    details: "Added passkey for Apple Touch ID",
  },
  {
    id: "log_4",
    event: LogEvent.LOGIN_SUCCESS,
    timestamp: "2026-06-15 18:41",
    deviceInfo: "Firefox / iPhone 15",
    ipAddress: "172.56.x.x",
    details: "Login via active mobile passkey verification",
  },
];

const defaultPrivacy: PrivacySettings = {
  dataMinimization: true,
  optionalEmailEnabled: true,
  anonymousMode: false,
  disableAnalytics: true,
  ipAnonymization: true,
  consentGranted: true,
};

// Load helpers
export function getSavedUser(): UserSession {
  const data = localStorage.getItem(STATE_KEYS.USER_SESSION);
  if (!data) {
    initializeLocalStorage();
    return defaultUser;
  }
  return JSON.parse(data);
}

export function saveUser(user: UserSession) {
  localStorage.setItem(STATE_KEYS.USER_SESSION, JSON.stringify(user));
}

export function getSavedPasskeys(): Passkey[] {
  const data = localStorage.getItem(STATE_KEYS.PASSKEYS);
  return data ? JSON.parse(data) : defaultPasskeys;
}

export function savePasskeys(passkeys: Passkey[]) {
  localStorage.setItem(STATE_KEYS.PASSKEYS, JSON.stringify(passkeys));
}

export function getSavedSessions(): SecuritySession[] {
  const data = localStorage.getItem(STATE_KEYS.SESSIONS);
  return data ? JSON.parse(data) : defaultSessions;
}

export function saveSessions(sessions: SecuritySession[]) {
  localStorage.setItem(STATE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getSavedLogs(): SecurityLog[] {
  const data = localStorage.getItem(STATE_KEYS.LOGS);
  return data ? JSON.parse(data) : defaultLogs;
}

export function saveLogs(logs: SecurityLog[]) {
  localStorage.setItem(STATE_KEYS.LOGS, JSON.stringify(logs));
}

export function getSavedRecoveryCodes(): string[] {
  const data = localStorage.getItem(STATE_KEYS.RECOVERY_CODES);
  return data ? JSON.parse(data) : [];
}

export function saveRecoveryCodes(codes: string[]) {
  localStorage.setItem(STATE_KEYS.RECOVERY_CODES, JSON.stringify(codes));
}

export function getSavedPrivacySettings(): PrivacySettings {
  const data = localStorage.getItem(STATE_KEYS.PRIVACY_SETTING);
  return data ? JSON.parse(data) : defaultPrivacy;
}

export function savePrivacySettings(settings: PrivacySettings) {
  localStorage.setItem(STATE_KEYS.PRIVACY_SETTING, JSON.stringify(settings));
}

// Function to reset databases to clean state
export function initializeLocalStorage() {
  if (!localStorage.getItem(STATE_KEYS.USER_SESSION)) {
    localStorage.setItem(STATE_KEYS.USER_SESSION, JSON.stringify(defaultUser));
  }
  if (!localStorage.getItem(STATE_KEYS.PASSKEYS)) {
    localStorage.setItem(STATE_KEYS.PASSKEYS, JSON.stringify(defaultPasskeys));
  }
  if (!localStorage.getItem(STATE_KEYS.SESSIONS)) {
    localStorage.setItem(STATE_KEYS.SESSIONS, JSON.stringify(defaultSessions));
  }
  if (!localStorage.getItem(STATE_KEYS.LOGS)) {
    localStorage.setItem(STATE_KEYS.LOGS, JSON.stringify(defaultLogs));
  }
  if (!localStorage.getItem(STATE_KEYS.PRIVACY_SETTING)) {
    localStorage.setItem(STATE_KEYS.PRIVACY_SETTING, JSON.stringify(defaultPrivacy));
  }
}

// Action Helper Functions
export function createSecurityLogEntry(event: LogEvent, details: string, ip = "192.168.1.15", device = "Chrome / MacBook Air") {
  const logs = getSavedLogs();
  const rawIp = getSavedPrivacySettings().ipAnonymization ? anonymizeIP(ip) : ip;
  const newLog: SecurityLog = {
    id: `log_${Date.now()}`,
    event,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    deviceInfo: device,
    ipAddress: rawIp,
    details,
  };
  logs.unshift(newLog); // added to beginning
  saveLogs(logs);
}

export function addPasskey(name: string, trust: "High" | "Trusted" | "Standard"): Passkey[] {
  const passkeys = getSavedPasskeys();
  const newKey: Passkey = {
    id: `pk_${Date.now()}`,
    name,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    lastUsedAt: null,
    trustLevel: trust,
  };
  passkeys.push(newKey);
  savePasskeys(passkeys);
  createSecurityLogEntry(LogEvent.PASSKEY_ADDED, `Registered new passkey: ${name}`);
  return passkeys;
}

export function removePasskey(id: string): Passkey[] {
  let passkeys = getSavedPasskeys();
  const target = passkeys.find((k) => k.id === id);
  if (target) {
    passkeys = passkeys.filter((k) => k.id !== id);
    savePasskeys(passkeys);
    createSecurityLogEntry(LogEvent.PASSKEY_REMOVED, `Revoked passkey: ${target.name}`);
  }
  return passkeys;
}

export function revokeSession(id: string): SecuritySession[] {
  let sessions = getSavedSessions();
  const target = sessions.find((s) => s.id === id);
  if (target) {
    sessions = sessions.filter((s) => s.id !== id);
    saveSessions(sessions);
    createSecurityLogEntry(LogEvent.SESSION_REVOKED, `Revoked device session on: ${target.device} (${target.browser})`);
  }
  return sessions;
}

export function revokeAllOtherSessions(): SecuritySession[] {
  let sessions = getSavedSessions();
  const otherSessions = sessions.filter((s) => !s.current);
  sessions = sessions.filter((s) => s.current);
  saveSessions(sessions);
  
  if (otherSessions.length > 0) {
    createSecurityLogEntry(LogEvent.SESSION_REVOKED, `Revoked all other devices (${otherSessions.length} total)`);
  }
  return sessions;
}

export function generateAndSaveRecoveryCodes(): string[] {
  const codes = generateMockRecoveryCodes();
  saveRecoveryCodes(codes);
  createSecurityLogEntry(LogEvent.RECOVERY_CODES_CREATED, "Generated new collection of 10 recovery backup codes");
  return codes;
}

export function exportUserDataJSON(): string {
  const user = getSavedUser();
  const passkeys = getSavedPasskeys();
  const sessions = getSavedSessions();
  const logs = getSavedLogs();
  const privacy = getSavedPrivacySettings();
  
  const payload = {
    exportMetadata: {
      platform: "PrivateAuth Shield",
      exportedAt: new Date().toISOString(),
      securityDisclaimer: "This file contains privacy configuration values and security metadata. Plaintext keys or passwords are not stored in our databases.",
    },
    userProfile: {
      username: user.username,
      optionalEmail: user.optionalEmail || null,
      anonymousModeEnabled: user.anonymousMode,
      mfaConfigured: user.mfaSetUp,
    },
    privacyPreferences: privacy,
    registeredCredentials: passkeys.map((k) => ({
      name: k.name,
      registeredAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      trustLevel: k.trustLevel,
    })),
    loginLogs: logs,
    sessionMap: sessions,
  };
  
  createSecurityLogEntry(LogEvent.DATA_EXPORTED, "User personal privacy archive exported successfully");
  return JSON.stringify(payload, null, 2);
}

export function deleteUserAccount() {
  localStorage.removeItem(STATE_KEYS.USER_SESSION);
  localStorage.removeItem(STATE_KEYS.PASSKEYS);
  localStorage.removeItem(STATE_KEYS.SESSIONS);
  localStorage.removeItem(STATE_KEYS.LOGS);
  localStorage.removeItem(STATE_KEYS.RECOVERY_CODES);
  localStorage.removeItem(STATE_KEYS.PRIVACY_SETTING);
  
  // Create virtual success state
  const cleanLogs = [
    {
      id: `log_deleted_${Date.now()}`,
      event: LogEvent.ACCOUNT_DELETED,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      deviceInfo: "System Core",
      ipAddress: "192.168.x.x",
      details: "Self-destruct privacy command executed.",
    }
  ];
  localStorage.setItem(STATE_KEYS.LOGS, JSON.stringify(cleanLogs));
}
