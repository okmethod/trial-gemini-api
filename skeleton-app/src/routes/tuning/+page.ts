import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import modelParams from "./modelParams";

interface PokeDataWithoutImage {
  name: string;
  type1: string;
  type2: string | null;
}

export interface PokeData extends PokeDataWithoutImage {
  imageUrl: string;
}

const pokeDict: Record<number, PokeDataWithoutImage> = {
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
  25: {
    name: "ピカチュウ",
    type1: "でんき",
    type2: null,
  },
  133: {
    name: "イーブイ",
    type1: "ノーマル",
    type2: null,
  },
};

const imageUrlTemplate = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export async function load(): Promise<{
  model: GenerativeModel | null;
  trainingPokeDict: Record<number, PokeData>;
}> {
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string) : null;
  const model = genAI?.getGenerativeModel(modelParams) ?? null;

  const trainingPokeDict = {
    ...Object.fromEntries(
      Object.entries(pokeDict).map(([id, pokeData]) => [
        id,
        {
          ...pokeData,
          imageUrl: imageUrlTemplate(Number(id)),
        },
      ]),
    ),
  };

  return { model, trainingPokeDict };
}
