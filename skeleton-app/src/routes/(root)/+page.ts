import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { pickRandomElementsFromArray } from "$lib/utils/collections";
import modelParams from "./modelParams";

const imageUrlTemplate = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export async function load(): Promise<{
  model: GenerativeModel | null;
  hogeTorusImageUrl: string;
}> {
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string) : null;
  const model = genAI?.getGenerativeModel(modelParams) ?? null;

  const hogeTorusPokeIds = [641, 642, 645];
  const hogeTorusImageUrl = pickRandomElementsFromArray(hogeTorusPokeIds, 1).map((pokeId) =>
    imageUrlTemplate(pokeId),
  )[0];

  return { model, hogeTorusImageUrl };
}
