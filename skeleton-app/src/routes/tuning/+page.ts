import type { LoadEvent } from "@sveltejs/kit";
import { pokeDict, createPokePrompt, type PokePrompt } from "$lib/constants/poke";

const promptTemplate = (pokeName: string) =>
  `これは ${pokeName} の画像です。この画像から外見的な特徴を抽出してください`;

export async function load({ fetch }: LoadEvent): Promise<{
  trainingPokePrompts: Record<number, PokePrompt>;
}> {
  const trainingPokePrompts = await createPokePrompt(fetch, pokeDict, promptTemplate);

  return { trainingPokePrompts };
}
