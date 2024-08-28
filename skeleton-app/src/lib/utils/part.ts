import type { InlineDataPart } from "@google/generative-ai";

export async function urlToGenerativePart(
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
