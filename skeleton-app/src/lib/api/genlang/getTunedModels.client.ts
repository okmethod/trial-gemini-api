import type { TunedModel } from "$lib/types/model";
import { checkToken } from "$lib/utils/auth";
import { GOOGLE_CLOUD_PROJECT as projectId } from "$lib/constants/common";

async function getTunedModels(fetchFunction: typeof fetch): Promise<TunedModel[]> {
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/tunedModels";
  const token = checkToken();
  const requestInit: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-goog-user-project": projectId,
    },
  };
  try {
    const response = await fetchFunction(apiUrl, requestInit);
    if (!response.ok) {
      console.error("Failed to fetch tuned models:", response.status);
      return [];
    }
    const data = (await response.json()) as { tunedModels: TunedModel[] };
    return data.tunedModels;
  } catch (error) {
    console.error("Failed to fetch tuned models:", error);
  }
  return [];
}

export default getTunedModels;
