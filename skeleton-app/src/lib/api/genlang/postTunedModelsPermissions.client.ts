import { checkToken } from "$lib/utils/auth";
import { GOOGLE_CLOUD_PROJECT as projectId } from "$lib/constants/common";

interface Permission {
  name: string;
  granteeType: string;
  emailAddress: undefined;
  role: string;
}

async function postTunedModelsPermissions(fetchFunction: typeof fetch, TunedModelName: string): Promise<Permission[]> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${TunedModelName}/permissions`;
  const token = checkToken();
  const body = {
    granteeType: "EVERYONE",
    role: "READER",
  };
  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-goog-user-project": projectId,
    },
    body: JSON.stringify(body),
  };
  try {
    const response = await fetchFunction(apiUrl, requestInit);
    if (!response.ok) {
      console.error("Failed to grant tuned models:", response.status);
      return [];
    }
    const data = (await response.json()) as { permissions: Permission[] };
    return data.permissions;
  } catch (error) {
    console.error("Failed to grant tuned models:", error);
  }
  return [];
}

export default postTunedModelsPermissions;
