import type { LoadEvent } from "@sveltejs/kit";

async function fetchApiKey(fetchFunction: typeof fetch) {
  try {
    const response = await fetchFunction("/api/api-key");
    const data = await response.json();
    return data.apiKey;
  } catch (error) {
    console.error("Error fetching API key:", error);
  }
}

export async function load({ fetch }: LoadEvent): Promise<{ apiKey: string }> {
  const apiKey = await fetchApiKey(fetch);
  return { apiKey };
}
