/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple password strength analyzer
export interface PasswordStrength {
  score: number; // 0 to 4
  label: "Very Weak" | "Weak" | "Medium" | "Strong" | "Excellent";
  color: string;
  feedback: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  if (!password) {
    return { score: 0, label: "Very Weak", color: "bg-red-500", feedback: ["Password cannot be empty"] };
  }

  let score = 0;
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push("At least 8 characters required");
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("Mix of uppercase and lowercase letters recommended");
  }

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("At least one number recommended");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push("At least one special character recommended");
  }

  let label: PasswordStrength["label"] = "Very Weak";
  let color = "bg-red-500 font-sans";

  if (score === 1) {
    label = "Weak";
    color = "bg-orange-500";
  } else if (score === 2) {
    label = "Medium";
    color = "bg-yellow-500";
  } else if (score === 3) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score === 4) {
    label = "Excellent";
    color = "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]";
  }

  return { score, label, color, feedback };
}

// Generates 10 recovery codes in alphanumeric blocks
export function generateMockRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const block1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const block2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const block3 = Math.random().toString(36).substring(2, 6).toUpperCase();
    codes.push(`${block1}-${block2}-${block3}`);
  }
  return codes;
}

// Anonymizes real-looking and fake IP addresses for privacy logs
export function anonymizeIP(ip: string): string {
  if (!ip) return "Unknown";
  // If it is IPv4, hide last two octets
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.x.x`;
  }
  // If IPv6, hide last sections
  const colons = ip.split(":");
  if (colons.length > 2) {
    return `${colons[0]}:${colons[1]}:xxxx:xxxx`;
  }
  return "192.168.x.x";
}

// Simulates Argon2id hashing details
export const argon2idExplanation = {
  algorithm: "Argon2id (v=19)",
  type: "Memory-hard, Time-hard, Thread-hard Passowrd KDF",
  parameters: {
    m: "65,536 KiB (Memory cost)",
    t: "3 iterations (Time cost)",
    p: "4 threads (Parallelism cost)",
  },
  resistance: "Highly resistant to GPU, FPGA, and ASIC-based password cracking due to custom cache memory-intensive constraints.",
};

// Security Check Score calculation (max 100)
export function calculateSecurityScore(
  hasPasskey: boolean,
  passkeysCount: number,
  mfaEnabled: boolean,
  hasRecoveryCodes: boolean,
  activeSessionsCount: number,
  averageTrustLevel: boolean
): { score: number; level: string; color: string } {
  let score = 0;

  // 1. Passkey-first login: +16% (completed if hasPasskey)
  if (hasPasskey) score += 16;
  // 2. MFA enabled: +20% (completed if mfaEnabled)
  if (mfaEnabled) score += 20;
  // 3. Recovery codes generated: +15% (completed if hasRecoveryCodes)
  if (hasRecoveryCodes) score += 15;
  // 4. Session rotation active: +15% (always active in PrivateAuth Shield)
  score += 15;
  // 5. Rate limiting enabled: +10% (always active by default)
  score += 10;
  // 6. Generic auth errors active: +10% (always active by default)
  score += 10;
  // 7. Minimal audit logging active: +10% (always active by default)
  score += 10;

  score = Math.min(score, 100);

  let level = "Needs Improvement";
  let color = "text-red-400";
  if (score >= 40 && score < 70) {
    level = "Moderate Protection";
    color = "text-yellow-400";
  } else if (score >= 70 && score < 90) {
    level = "High Security";
    color = "text-blue-400";
  } else if (score >= 90) {
    level = "Ironclad Protection";
    color = "text-cyan-400";
  }

  return { score, level, color };
}

// Privacy Score calculation (max 100)
export function calculatePrivacyScore(
  dataMinimizationOn: boolean,
  emailEnabled: boolean,
  anonymousModeOn: boolean,
  disableAnalyticsOn: boolean,
  ipAnonymizationOn: boolean
): { score: number; level: string; color: string } {
  let score = 0;

  // 1. No mandatory email: +15% (completed since email is always optional)
  score += 15;
  // 2. No phone number collection: +15% (completely true, 100% compliant)
  score += 15;
  // 3. No full IP logging (IP Obfuscation): +15% (completed if ipAnonymization is checked)
  if (ipAnonymizationOn) score += 15;
  // 4. No device fingerprinting: +15% (completely true, 100% compliant)
  score += 15;
  // 5. Local voice transcript only: +13% (always completely local voice commands)
  score += 13;
  // 6. Data export available: +10% (always available via export UI)
  score += 10;
  // 7. Account deletion available: +15% (always sovereign wipe-out protocol active)
  score += 15;

  score = Math.min(score, 100);

  let level = "Minimally Private";
  let color = "text-red-400";
  if (score >= 35 && score < 65) {
    level = "Standard Privacy";
    color = "text-yellow-400";
  } else if (score >= 65 && score < 85) {
    level = "Strong Confidentiality";
    color = "text-purple-400";
  } else if (score >= 85) {
    level = "Privacy First Warrior";
    color = "text-violet-400";
  }

  return { score, level, color };
}
