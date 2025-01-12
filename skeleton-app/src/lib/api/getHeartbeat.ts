import { constructRequestInit, fetchApi } from "$lib/utils/request";
import { pathHeartbeat } from "$lib/constants/paths";
import type { ResponseHeartbeatJson } from "$lib/types/heartbeat";

async function getHeartbeat(fetchFunction: typeof window.fetch): Promise<ResponseHeartbeatJson> {
  const url = pathHeartbeat;
  const requestInit = constructRequestInit();
  const requestConfig = {
    ...requestInit,
    method: "GET",
  };
  const response = await fetchApi(fetchFunction, url, requestConfig);
  return (await response.json()) as ResponseHeartbeatJson;
}

export default getHeartbeat;
