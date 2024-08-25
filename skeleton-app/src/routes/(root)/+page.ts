import type { GenerativeModel, RequestOptions } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pickRandomElementsFromArray } from "$lib/utils/collections";
//import { getAuthToken } from "$lib/utils/auth";
import { defaultModelParams } from "$lib/constants/modelSettings";

const imageUrlTemplate = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export async function load(): Promise<{
  model: GenerativeModel | null;
  hogeTorusImageUrl: string;
}> {
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string) : null;

  const token = "your-token-here";
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const requestOptions: RequestOptions = {
    customHeaders: headers,
  };

  const model = genAI?.getGenerativeModel(defaultModelParams("tunedModels/v1-nteipb5ttyxg"), requestOptions) ?? null;

  const hogeTorusPokeIds = [641, 642, 645, 905];
  const hogeTorusImageUrl = pickRandomElementsFromArray(hogeTorusPokeIds, 1).map((pokeId) =>
    imageUrlTemplate(pokeId),
  )[0];

  return { model, hogeTorusImageUrl };
}
