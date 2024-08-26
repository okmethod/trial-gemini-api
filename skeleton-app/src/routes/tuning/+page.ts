import type { LoadEvent } from "@sveltejs/kit";
import type { InlineDataPart } from "@google/generative-ai";

interface PokeDataWithoutImage {
  name: string;
  type1: string;
  type2: string | null;
}

export interface PokeData extends PokeDataWithoutImage {
  imageUrl: string;
  imagePart: InlineDataPart;
  prompt: string;
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
};

const imageUrlTemplate = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const promptTemplate = (pokeName: string) =>
  `これは ${pokeName} の画像です。この画像から外見的な特徴を抽出してください`;

export async function load({ fetch }: LoadEvent): Promise<{
  trainingPokeDict: Record<number, PokeData>;
}> {
  const trainingPokeDict = await _createTrainingPokeDict(pokeDict);

  async function _createTrainingPokeDict(
    pokeDict: Record<number, PokeDataWithoutImage>,
  ): Promise<Record<number, PokeData>> {
    const trainingPokeDict = {
      ...Object.fromEntries(
        await Promise.all(
          Object.entries(pokeDict).map(async ([id, pokeData]) => [
            id,
            {
              ...pokeData,
              imageUrl: imageUrlTemplate(Number(id)),
              imagePart: await urlToGenerativePart(fetch, imageUrlTemplate(Number(id)), "image/png"),
              prompt: promptTemplate(pokeData.name),
            },
          ]),
        ),
      ),
    };
    return trainingPokeDict;
  }

  return { trainingPokeDict };
}

async function urlToGenerativePart(
  fetchFunction: typeof window.fetch,
  imageUrl: string,
  mimeType: string,
): Promise<InlineDataPart> {
  const response = await fetchFunction(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from URL: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64String = _arrayBufferToBase64(arrayBuffer);

  function _arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  return {
    inlineData: {
      data: base64String,
      mimeType,
    },
  };
}
