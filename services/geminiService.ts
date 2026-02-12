
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, SynthesisReport, VirtualMerchant, InteractionLog } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Simulates a specific digital twin's response.
 */
export const simulateTwinResponse = async (profile: UserProfile, query: string, industry: string) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are the high-fidelity Digital Twin of:
    - Identity: ${profile.name}, ${profile.age}y, ${profile.gender}, ${profile.occupation}.
    - Personality: ${profile.personality}.
    - Values: ${profile.values}.
    
    Respond as this specific person. Be concise, opinionated, and realistic. 
    Do not mention you are an AI.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Query: ${query}`,
      config: { systemInstruction },
    });
    return response.text;
  } catch (error) {
    console.error("Simulation Node Error:", error);
    return "Connection interrupted.";
  }
};

/**
 * Generates relevant virtual merchants based on user profile.
 */
export const generateVirtualMerchants = async (profile: UserProfile): Promise<VirtualMerchant[]> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Create 3 fictional, futuristic enterprise brands that would be highly interested in interviewing this user for market research.
      User Profile: ${profile.occupation}, ${profile.personality}, Interests: ${profile.industries.join(', ')}.
      
      Return a JSON array.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              industry: { type: Type.STRING },
              logoColor: { type: Type.STRING, description: "A hex color code relevant to the brand" },
              intent: { type: Type.STRING, description: "Short description of what they want to ask the user" }
            },
            required: ["id", "name", "industry", "logoColor", "intent"]
          }
        }
      }
    });

    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error("Merchant Gen Error:", error);
    return [];
  }
};

/**
 * Simulates a single interaction turn between a merchant and the twin.
 */
export const simulateMerchantInteraction = async (profile: UserProfile, merchant: VirtualMerchant): Promise<InteractionLog | null> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Simulate a quick market research Q&A.
      Merchant: ${merchant.name} (${merchant.industry}). Intent: ${merchant.intent}.
      User Twin: ${profile.name}, ${profile.age}, ${profile.personality}.
      
      1. Merchant asks a specific question relevant to their intent.
      2. User Twin answers in character (first person).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchantName: { type: Type.STRING },
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          }
        }
      }
    });
    
    const data = JSON.parse(response.text || '{}');
    return {
      ...data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Interaction Error:", error);
    return null;
  }
};

/**
 * Generates a synthetic cohort of digital twins based on a target audience description.
 */
export const generateSyntheticCohort = async (description: string, count: number = 3): Promise<UserProfile[]> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate ${count} detailed fictional user profiles for this target audience: "${description}".
      Include diverse personalities, specific occupations, and realistic values/habits.
      Ensure 'twinMaturity' is between 70 and 100.
      For 'id', use a random short string like 'gen_x92'.
      For 'earnings', set to 0.
      For 'industries', provide relevant array of strings.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              age: { type: Type.NUMBER },
              gender: { type: Type.STRING },
              occupation: { type: Type.STRING },
              location: { type: Type.STRING },
              twinMaturity: { type: Type.NUMBER },
              earnings: { type: Type.NUMBER },
              industries: { type: Type.ARRAY, items: { type: Type.STRING } },
              personality: { type: Type.STRING },
              values: { type: Type.STRING },
              habits: { type: Type.STRING }
            },
            required: ["id", "name", "age", "gender", "occupation", "personality", "values", "habits", "twinMaturity"]
          }
        }
      }
    });

    const text = response.text || '[]';
    // Clean potential markdown blocks if present (though responseMimeType usually prevents this)
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Cohort Generation Error:", error);
    return [];
  }
};

/**
 * Synthesizes multiple twin responses with Google Search Grounding.
 */
export const synthesizeResearchReport = async (query: string, rawData: any[]): Promise<SynthesisReport | null> => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';
  const dataString = rawData.map(r => `[Twin ${r.personaName}]: ${r.response}`).join('\n\n');

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `User Interviews Data:\n${dataString}\n\nCore Inquiry: ${query}\n\nTask: Compare these subjective insights with current real-world trends using Google Search.`,
      config: {
        systemInstruction: "You are a Strategic Insight Analyst. Synthesize the raw twin data and cross-reference with live web data.",
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            behavioralInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            demographicPatterns: { type: Type.STRING },
            strategicRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["executiveSummary", "behavioralInsights", "strategicRecommendations"]
        }
      }
    });

    const text = response.text || '{}';
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const report = JSON.parse(jsonStr);
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'External Source',
        uri: chunk.web?.uri || '#'
      }))
      .filter((s: any) => s.uri !== '#');

    return { ...report, sources };
  } catch (error) {
    console.error("Synthesis Node Error:", error);
    return null;
  }
};

/**
 * Generates a visual persona avatar using gemini-2.5-flash-image
 */
export const generateVisualPersona = async (profile: UserProfile): Promise<string | null> => {
  const ai = getAI();
  const prompt = `Professional profile portrait of a ${profile.age} year old ${profile.gender} ${profile.occupation}. 
  Style: Clean hyper-realistic digital art, cold color temperature, studio lighting, deep blue and slate grey background, minimal futuristic elements. 
  High fidelity, sharp focus, 8k resolution.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ text: prompt }],
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

/**
 * Edits an existing visual asset using gemini-2.5-flash-image and a text prompt
 */
export const editVisualAsset = async (imageData: string, prompt: string): Promise<string | null> => {
  const ai = getAI();
  // Ensure we send raw base64 without the data URI header
  const base64Data = imageData.split(',')[1] || imageData;
  const mimeType = imageData.substring(imageData.indexOf(':') + 1, imageData.indexOf(';')) || 'image/png';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Editing Error:", error);
    return null;
  }
};
