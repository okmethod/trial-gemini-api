import { generations } from "$lib/stores/generation";
import { imageUrlTemplate } from "$lib/constants/poke";

export async function load(): Promise<{
  generationSymbolUrlDict: Record<number, string>;
}> {
  const generationSymbolUrlDict = generations["generation-i"].symbolPokeIds.reduce(
    (acc, id) => {
      acc[id] = imageUrlTemplate(id);
      return acc;
    },
    {} as Record<number, string>,
  );
  return { generationSymbolUrlDict };
}
