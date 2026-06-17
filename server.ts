/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization helper for Gemini
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in system environment secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Local rule-based offline security chatbot fallback responses
const OFFLINE_EXPLANATIONS: Record<string, string> = {
  passkeys: `Passkeys are cryptographically backed credentials based on the W3C WebAuthn standard. Unlike passwords, passkeys are unique to every website and consist of a public-private key pair. Your device (e.g., laptop or phone) stores the private key securely and signs a challenge from the server, which validates it using your registered public key. Since no shared secret (password) is sent over the wire or stored on our servers, passkeys are fully immune to phishing, credential stuffing, and passive server leaks.`,
  sms: `SMS-based One-Time Passwords (OTP) should be avoided because cellular routing is highly vulnerable. Attackers can execute "SIM Swapping" by impersonating you at carrier stores to redirect your numbers. Cellular networks are also susceptible to SS7 routing intercepts and device notifications showing secrets on lockscreens. High-security modern architectures instead enforce hardware passkeys or local TOTP app credentials that cannot be intercepted remotely.`,
  recovery: `Recovery backup codes represent single-use, high-entropy cryptographic tokens that act as safety hatches. If you lose your phone (TOTP) and your passkey device, you submit a recovery code. The server compares it to list hashes (hashed with Argon2id), invalidates that specific token, and restores dashboard access. They should be downloaded once, printed or stored in an offline encrypted vault, and kept out of cloud services.`,
  suspicious: `An authentication signal is flagged as "suspicious" if it breaches standard login metrics. This includes geographic anomalies (e.g., logging in from London 5 minutes after a New York transaction - impossible travel), sudden device trust state mutations, or repeated invalid password fallbacks triggering rate limits. PrivateAuth Shield flags these risk scores, enforces mandatory secondary MFA validations, and records events in localized minimal audit logs.`,
  privacy: `Privacy-first auth implements strict "Data Minimization". We do not require or verify real-world emails unless intentionally provided for communication. We use only anonymized IP mapping (e.g., 192.168.x.x) for security audit logs. No biometric data captures leave user-controlled local chips. If our database is heavily breached, zero correlation indices remain, protecting user identity and digital assets completely.`,
};

// API Endpoint for AI Security Assistant
app.post("/api/gemini/explain", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question parameter is required" });
  }

  const queryLower = question.toLowerCase();

  // Try to use Gemini
  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are "PrivateAuth Guard", an elite security and privacy auditor. Your goal is to guide developers on building systems that collect MINIMAL personal data, demonstrating how Passkeys, TOTP, Argon2id, and minimal audit protocols work. Keep responses informative, highly educational, privacy-focused, and concise. Explain: 1. Why passkeys are safer than passwords (phishing protection, public key cryptography). 2. Why SMS OTP is avoided. 3. How recovery codes work. 4. What suspicious login means. 5. How privacy-first auth protects users. Answer within 120-150 words. Do not make real auth decisions.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return res.json({
      status: "success",
      source: "Gemini 3.5 AI Core",
      text: response.text || "I was unable to formulate an answer. Let's research privacy protocols together!"
    });
  } catch (error: any) {
    // Graceful fallback to offline local training core if API key is missing or calls fail.
    // Match queries to offline database.
    let offlineResponse = "That is an excellent security question! PrivateAuth Shield recommends using hardware passkeys, local time-based authenticator apps (TOTP), and minimizing the personal data we store in database systems to prevent data harvesting attacks.";
    
    if (queryLower.includes("passkey")) {
      offlineResponse = OFFLINE_EXPLANATIONS.passkeys;
    } else if (queryLower.includes("sms") || queryLower.includes("otp") || queryLower.includes("phone")) {
      offlineResponse = OFFLINE_EXPLANATIONS.sms;
    } else if (queryLower.includes("recovery") || queryLower.includes("code")) {
      offlineResponse = OFFLINE_EXPLANATIONS.recovery;
    } else if (queryLower.includes("suspicious") || queryLower.includes("signal") || queryLower.includes("failed")) {
      offlineResponse = OFFLINE_EXPLANATIONS.suspicious;
    } else if (queryLower.includes("protect") || queryLower.includes("privacy") || queryLower.includes("minimize")) {
      offlineResponse = OFFLINE_EXPLANATIONS.privacy;
    }

    return res.json({
      status: "success",
      source: "Offline Security Core (No active Gemini API key found / fallback enabled)",
      text: offlineResponse,
      errorDetails: error.message
    });
  }
});

// Setup Vite & static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION static mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PrivateAuth Shield Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
