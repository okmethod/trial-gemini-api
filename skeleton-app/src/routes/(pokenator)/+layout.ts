import { pickRandomElementsFromArray } from "$lib/utils/collections";

const imageUrlTemplate = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export async function load(): Promise<{ hogeTorusImageUrl: string }> {
  const hogeTorusPokeIds = [641, 642, 645, 905];
  const hogeTorusImageUrl = pickRandomElementsFromArray(hogeTorusPokeIds, 1).map((pokeId) =>
    imageUrlTemplate(pokeId),
  )[0];

  return { hogeTorusImageUrl };
}
