import { writable } from "svelte/store";

export enum GenerationId {
  GenerationI = "generation-i",
}

export const generationId = writable<GenerationId>(GenerationId.GenerationI);

export interface GenerationData {
  label: string;
  description: string;
  lastPokeId: number;
  symbolPokeIds: number[];
}

export const generations: Record<GenerationId, GenerationData> = {
  "generation-i": {
    label: "第1世代",
    description: "赤・緑・青・黄",
    lastPokeId: 151,
    symbolPokeIds: [1, 4, 7],
  },
};
