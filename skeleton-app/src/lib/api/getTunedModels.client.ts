import { get } from "svelte/store";
import { idToken } from "$lib/stores/auth";

const projectId = "gen-lang-client-0287279129";

interface TunedModel {
  name: string;
  displayName: string;
  createTime: string;
  state: string;
}

async function getTunedModels(): Promise<TunedModel[]> {
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/tunedModels";
  const token = get(idToken);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-goog-user-project": projectId,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as { tunedModels: TunedModel[] };
    return data.tunedModels;
  } catch (error) {
    console.error("Failed to fetch tuned models:", error);
  }
  return [];
}

export default getTunedModels;
