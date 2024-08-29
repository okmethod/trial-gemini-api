import type { Part } from "@google/generative-ai";

export interface Chat {
  role: "user" | "model";
  parts: Array<string | Part>;
}
