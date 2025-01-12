import { GoogleGenerativeAI } from "@google/generative-ai";
import { defineString } from "firebase-functions/params";
import { getEnv } from "../utils/getEnv.js";

const apiKey = defineString("GEMINI_API_KEY");

class GoogleGenerativeAISingleton {
  private static instance: GoogleGenerativeAI | null = null;

  // Singleton pattern
  private constructor() {}

  public static getInstance(): GoogleGenerativeAI {
    if (!GoogleGenerativeAISingleton.instance) {
      GoogleGenerativeAISingleton.instance = GoogleGenerativeAISingleton.initializeInstance(
        getEnv("GEMINI_API_KEY", apiKey),
      );
    }
    return GoogleGenerativeAISingleton.instance;
  }

  private static initializeInstance(apiKey: string): GoogleGenerativeAI {
    try {
      return new GoogleGenerativeAI(apiKey);
    } catch (err) {
      console.error("Failed to initialize GoogleGenerativeAI:", err);
      throw new Error("Failed to initialize GoogleGenerativeAI");
    }
  }
}

export default GoogleGenerativeAISingleton;
