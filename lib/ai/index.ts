import { generateWithGemini } from "./gemini";
import { generateWithGroq } from "./groq";

export type AIProvider = "gemini" | "groq";

export async function generateAI(
  prompt: string,
  provider: AIProvider = "groq"
): Promise<string> {
  try {
    if (provider === "gemini") {
      return await generateWithGemini(prompt);
    }
    return await generateWithGroq(prompt);
  } catch (error) {
    if (provider === "groq") {
      console.warn("Groq failed, falling back to Gemini");
      return await generateWithGemini(prompt);
    }
    throw error;
  }
}