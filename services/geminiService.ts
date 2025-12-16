import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeManifesto = async (text: string): Promise<string> => {
  if (!apiKey) return "THE ORACLE CANNOT SEE. (API Key Missing)";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are "The Elder Oracle" of the Timekeeper's Guild.
      Analyze the Apprentice's "Prophecy of 2040".
      
      Apprentice's Prophecy: "${text}"
      
      Mandatory Checklist:
      1. Future Continuous usage ("I will be ruling", "I will be casting")?
      2. Future Perfect usage ("I will have conquered", "I will have mastered")?
      3. Vocabulary usage ("Fritter away", "Invest time", "While away", "Run out of")?
      
      Response Logic:
      - If they use simple "I will work", scold them: "A PEASANT'S VISION! Use 'will be -ing' to see the flow of time."
      - If they miss Future Perfect, say: "THE PROPHECY IS INCOMPLETE. You must foresee what 'will have' happened."
      - If they succeed, bless them: "THE SANDS OF TIME FAVOR YOU, CHRONOMANCER."
      
      Tone: Mystical, Ancient, Gandalf-like, slightly dramatic. Keep it under 50 words.`,
    });
    return response.text || "THE MISTS OBSCURE MY VISION.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "A DARK MAGIC BLOCKS THE PROPHECY.";
  }
};

export const generateBamboozleQuestions = async (): Promise<any[]> => {
  if (!apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 16 unique quiz questions for a "Bamboozle" style game for teenagers (ESL B2 Level).
      
      Topic: Future Perfect vs Future Continuous.
      Vocabulary to include: fritter away, invest, kill time, run out of, set aside, while away, get money's worth.
      
      Themes: Viral trends, TikTok, Gaming (Roblox, Minecraft, Valorant), Celebrities (Taylor Swift, MrBeast), Anime.
      
      Format: JSON Array of objects.
      
      Structure:
      [
        {
          "q": "By 2030, MrBeast _____ (give away) a billion dollars.",
          "a": "will have given away"
        },
        {
           "q": "Don't call me at 8 PM. I _____ (rank up) in Valorant.",
           "a": "will be ranking up"
        }
      ]
      
      Strictly return ONLY the JSON array. No markdown formatting.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Bamboozle Gen Error:", error);
    return [];
  }
};