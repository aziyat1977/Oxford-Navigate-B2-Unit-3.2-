import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeManifesto = async (text: string): Promise<string> => {
  if (!apiKey) return "SYSTEM ERROR: API KEY NOT DETECTED. CANNOT CONNECT TO MAINFRAME.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are the "Temporal Audit Algorithm" from 2040.
      Analyze the recruit's "Life in 2040" submission.
      
      Recruit's Text: "${text}"
      
      Mandatory Checklist:
      1. Future Continuous usage ("I will be working", "I will be living")?
      2. Future Perfect usage ("I will have bought", "I will have finished")?
      3. Vocabulary usage ("Fritter away", "Invest time", "While away", "Run out of")?
      
      Response Logic:
      - If they use simple "I will work", mock them: "BASIC PREDICTION DETECTED. USE 'WILL BE -ING'."
      - If they miss Future Perfect, say: "ERROR: MILESTONE UNCONFIRMED. USE 'WILL HAVE -ED'."
      - If they succeed, praise them as a "Time Billionaire".
      
      Tone: Cyberpunk, Robotic, Educational. Keep it under 50 words.`,
    });
    return response.text || "CONNECTION INTERRUPTED.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ERROR: NEURAL LINK FAILED. RETRY SEQUENCE INITIATED.";
  }
};