import type { LoadEvent } from "@sveltejs/kit";
import type { GenerativeModel } from "@google/generative-ai";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

async function fetchApiKey(fetchFunction: typeof fetch) {
  try {
    const response = await fetchFunction("/api/api-key");
    const data = await response.json();
    return data.apiKey;
  } catch (error) {
    console.error("Error fetching API key:", error);
  }
}

export async function load({ fetch }: LoadEvent): Promise<{ model: GenerativeModel }> {
  const apiKey = (process.env.GEMINI_API_KEY as string) ?? (await fetchApiKey(fetch));

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  return { model };
}
