import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeManifesto = async (text: string): Promise<string> => {
  if (!apiKey) return "SYSTEM ERROR: API KEY NOT DETECTED. CANNOT CONNECT TO MAINFRAME.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are the "Temporal Audit Algorithm" from 2035.
      Analyze the recruit's manifesto.
      
      Recruit's Text: "${text}"
      
      Mandatory Checklist:
      1. Did they use Future Continuous (will be -ing) to describe a process?
      2. Did they use Future Perfect (will have -ed) to describe a completed milestone?
      3. Did they use specific time vocabulary (fritter away, kill time, while away, invest)?
      
      Response Logic:
      - If they miss the grammar, be glitchy and critical: "ERROR: LACKING TEMPORAL ASPECT. USE 'WILL HAVE...'".
      - If they use simple "will + verb", mock them: "BASIC PREDICTION DETECTED. UPGRADE TO B2 LEVEL."
      - If they succeed, praise them as a "Time Billionaire".
      
      Tone: Cyberpunk, Robotic, but Educational. Keep it under 50 words.`,
    });
    return response.text || "CONNECTION INTERRUPTED.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ERROR: NEURAL LINK FAILED. RETRY SEQUENCE INITIATED.";
  }
};