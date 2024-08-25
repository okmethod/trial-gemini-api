import { GoogleGenerativeAI } from "@google/generative-ai";
import { pickRandomElementsFromArray } from "$lib/utils/collections";

const imageUrlTemplate = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export async function load(): Promise<{
  genAI: GoogleGenerativeAI | null;
  hogeTorusImageUrl: string;
}> {
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string) : null;

  const hogeTorusPokeIds = [641, 642, 645, 905];
  const hogeTorusImageUrl = pickRandomElementsFromArray(hogeTorusPokeIds, 1).map((pokeId) =>
    imageUrlTemplate(pokeId),
  )[0];

  return { genAI, hogeTorusImageUrl };
}
