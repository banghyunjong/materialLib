"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { FABRIC_ANALYSIS_PROMPT, FABRIC_PROPERTY_MAP } from "./prompts/fabric-analysis-prompt"

export async function analyzeFabricText(text: string) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: "API Key not configured on server." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent([
      FABRIC_ANALYSIS_PROMPT,
      `Analyze this text: "${text}"`
    ]);

    const response = await result.response;
    let textResponse = response.text();

    // Clean up potential markdown code blocks
    textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(textResponse);
    
    // Post-processing to infer categoryMajor based on fabric_code
    let categoryMajor = "기타 (Etc)";
    const fabricCode = data.ui_view?.fabric_code;
    
    if (fabricCode && FABRIC_PROPERTY_MAP[fabricCode as keyof typeof FABRIC_PROPERTY_MAP]) {
      categoryMajor = FABRIC_PROPERTY_MAP[fabricCode as keyof typeof FABRIC_PROPERTY_MAP];
    } else {
        // Fallback or default
         if (data.ui_view) {
             data.ui_view.fabric_code = "ZZ"; // Ensure code exists
         }
    }

    // Inject categoryMajor into the response for easier client handling
    return { 
      success: true, 
      data: {
        ...data,
        categoryMajor // Add this top-level for convenience
      } 
    };

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    return { success: false, error: error.message || "Failed to analyze text." };
  }
}