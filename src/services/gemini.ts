/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { PhishingIncident, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzePhishing(input: {
  url?: string;
  emailSubject?: string;
  emailBody?: string;
  image?: string; // base64 encoded image
  communicationType: 'Email' | 'Website' | 'Message' | 'Screenshot';
}) {
  const model = "gemini-3-flash-preview";
  
  const parts: any[] = [
    {
      text: `
        Analyze the following ${input.communicationType} for phishing characteristics:
        ${input.url ? `URL: ${input.url}` : ''}
        ${input.emailSubject ? `Subject: ${input.emailSubject}` : ''}
        ${input.emailBody ? `Body: ${input.emailBody}` : ''}
        ${input.image ? 'An image of the communication is provided for visual analysis.' : ''}

        Return a JSON response with:
        - isPhishing: boolean
        - confidence: number (0-1)
        - riskLevel: "Low" | "Medium" | "High" | "Critical"
        - findings: string[]
        - recommendedAction: string
        - attackName: string (a descriptive title)
      `
    }
  ];

  if (input.image) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: input.image.split(',')[1] // Remove data:image/jpeg;base64, prefix
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      isPhishing: false,
      confidence: 0,
      riskLevel: "Low" as RiskLevel,
      findings: ["Analysis failed due to technical error."],
      recommendedAction: "Manual review required.",
      attackName: "Unknown Threat"
    };
  }
}
