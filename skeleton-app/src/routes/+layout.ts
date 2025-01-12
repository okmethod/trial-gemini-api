import type { LoadEvent } from "@sveltejs/kit";
import { generations } from "$lib/stores/generation";
import { imageUrlTemplate } from "$lib/constants/poke";
import getHeartbeat from "$lib/api/getHeartbeat";

export async function load({ fetch }: LoadEvent): Promise<{
  generationSymbolUrlDict: Record<number, string>;
}> {
  const res = await getHeartbeat(fetch);
  console.log("Functions API Health Check:", res);

  const generationSymbolUrlDict = generations["generation-i"].symbolPokeIds.reduce(
    (acc, id) => {
      acc[id] = imageUrlTemplate(id);
      return acc;
    },
    {} as Record<number, string>,
  );
  return { generationSymbolUrlDict };
}
