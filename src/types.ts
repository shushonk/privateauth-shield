/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
  mfaSetUp: boolean; // TOTP is configured
  mfaVerified: boolean; // Verified for current session if configured
  anonymousMode: boolean;
  optionalEmail?: string;
  mfaSecret?: string;
}

export interface Passkey {
  id: string;
  name: string; // nickname, e.g. "Work Macbook Pro"
  createdAt: string;
  lastUsedAt: string | null;
  trustLevel: "High" | "Trusted" | "Standard";
}

export interface SecuritySession {
  id: string;
  current: boolean;
  browser: string;
  device: string;
  os: string;
  createdTime: string;
  lastActiveTime: string;
  ipAddress: string; // e.g. "19x.16x.x.x" for privacy
  trustLevel: "Trusted" | "Unknown Device";
}

export enum LogEvent {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  TOKEN_REFRESH = "TOKEN_REFRESH",
  PASSKEY_ADDED = "PASSKEY_ADDED",
  PASSKEY_REMOVED = "PASSKEY_REMOVED",
  MFA_ENABLED = "MFA_ENABLED",
  MFA_DISABLED = "MFA_DISABLED",
  SESSION_REVOKED = "SESSION_REVOKED",
  DATA_EXPORTED = "DATA_EXPORTED",
  ACCOUNT_DELETED = "ACCOUNT_DELETED",
  RECOVERY_CODES_CREATED = "RECOVERY_CODES_CREATED"
}

export interface SecurityLog {
  id: string;
  event: LogEvent;
  timestamp: string;
  deviceInfo: string;
  ipAddress: string; // anonymized
  details: string;
}

export interface PrivacySettings {
  dataMinimization: boolean;
  optionalEmailEnabled: boolean;
  anonymousMode: boolean;
  disableAnalytics: boolean;
  ipAnonymization: boolean;
  consentGranted: boolean;
}

export interface ThreatModel {
  id: string;
  title: string;
  description: string;
  impactScore: "Low" | "Medium" | "High" | "Critical";
  howWeProtect: string;
}

export interface VoiceTranscript {
  text: string;
  speaker: "user" | "assistant";
  timestamp: string;
}
