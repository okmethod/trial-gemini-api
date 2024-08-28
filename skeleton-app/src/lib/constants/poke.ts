import type { InlineDataPart } from "@google/generative-ai";
import { urlToGenerativePart } from "$lib/utils/part";

interface PokeData {
  name: string;
  type1: string;
  type2: string | null;
}

export interface PokePrompt extends PokeData {
  imageUrl: string;
  imagePart: InlineDataPart;
  prompt: string;
}

export const pokeDict: Record<number, PokeData> = {
  1: {
    name: "フシギダネ",
    type1: "くさ",
    type2: "どく",
  },
  4: {
    name: "ヒトカゲ",
    type1: "ほのお",
    type2: null,
  },
  7: {
    name: "ゼニガメ",
    type1: "みず",
    type2: null,
  },
};

const imageUrlTemplate = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export async function createPokePrompt(
  fetchFunction: typeof window.fetch,
  pokeDict: Record<number, PokeData>,
  promptTemplate: (name: string) => string,
): Promise<Record<number, PokePrompt>> {
  return {
    ...Object.fromEntries(
      await Promise.all(
        Object.entries(pokeDict).map(async ([id, pokeData]) => [
          id,
          {
            ...pokeData,
            imageUrl: imageUrlTemplate(Number(id)),
            imagePart: await urlToGenerativePart(fetchFunction, imageUrlTemplate(Number(id)), "image/png"),
            prompt: promptTemplate(pokeData.name),
          },
        ]),
      ),
    ),
  };
}
