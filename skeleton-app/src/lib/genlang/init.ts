import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RequestOptions } from "@google/generative-ai";
import { defaultModelParams } from "$lib/constants/modelSettings";

export const apiKey = process.env.GEMINI_API_KEY ? (process.env.GEMINI_API_KEY as string) : null;

export const generativeModel = (apiKey: string, modelName: string | null, token: string | null) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel(defaultModelParams(modelName), requestOptions(token));
  return model;
};

export const requestOptions = (token: string | null): RequestOptions | undefined => {
  if (!token) {
    return undefined;
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return {
    customHeaders: headers,
  };
};
