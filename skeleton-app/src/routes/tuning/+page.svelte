<script lang="ts">
  import { getToastStore, getModalStore } from "@skeletonlabs/skeleton";
  import type { ToastSettings, ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import type { TunedModel } from "$lib/types/model";
  import getTunedModels from "$lib/api/genlang/getTunedModels.client";
  import postTunedModelsPermissions from "$lib/api/genlang/postTunedModelsPermissions.client";
  import { fetchText } from "$lib/utils/generativeLanguage";
  import { checkToken } from "$lib/utils/auth";
  import { formatDateToJST } from "$lib/utils/format";
  import { downloadFile } from "$lib/utils/download.client";
  import AuthModal from "$lib/components/AuthModal.svelte";
  import type { PokePrompt } from "$lib/constants/poke";

  export let data: {
    trainingPokeDict: Record<number, PokePrompt>;
  };

  // 認証モーダル表示
  const modalStore = getModalStore();
  function modalSettings(modalComponent: ModalComponent): ModalSettings {
    return {
      type: "component",
      component: modalComponent,
      backdropClasses: "fixed inset-0 !bg-gray-300/90",
    };
  }
  let accessToken: string | null = null;
  accessToken = checkToken();
  function showAuthModal(): void {
    const modalComponent: ModalComponent = {
      ref: AuthModal,
      props: {
        setToken: _setToken,
      },
    };
    function _setToken(token: string | null): void {
      accessToken = token;
    }
    const m = modalSettings(modalComponent);
    modalStore.trigger(m);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(accessToken || "");
    showHintToast();
  }

  // トースト表示
  const toastStore = getToastStore();
  function toastSettings(message: string): ToastSettings {
    return {
      message: message,
      background: "bg-green-100 select-none",
      timeout: 2000,
    };
  }
  function showHintToast(): void {
    const t = toastSettings("Copied!");
    toastStore.trigger(t);
  }

  // モデル一覧取得
  let tunedModels: TunedModel[] = [];
  async function updateModels() {
    tunedModels = await getTunedModels(window.fetch);
  }
  let tunedModelsJsonFileName = "tunedModels.json";
  async function downloadTunedModelsJson() {
    const filteredModels = tunedModels.map((model) => ({
      name: model.name,
      displayName: model.displayName,
      updateTime: model.updateTime,
      state: model.state,
    }));
    void downloadFile(JSON.stringify(filteredModels, null, 2), tunedModelsJsonFileName, "application/json");
  }

  // 画像解釈
  async function explainImages() {
    console.log("Ready to export");

    for (const key in data.trainingPokeDict) {
      const pokeData = data.trainingPokeDict[key];
      const generatedtext = await fetchText(null, [pokeData.prompt, pokeData.imagePart]);
      console.log(`Generated content for ${pokeData.name}:`, generatedtext);
    }
  }

  let exportFileName = "tuning.csv";
  let isProcessing = false;
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle">
    <h1 class="cTitleStyle">チューニング・サポーター</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !min-w-[300px] !max-w-[600px]">
    <!-- 各種メニュー -->
    <div class="m-4 space-y-4">
      <div class="flex flex-col md:flex-row space-x-3">
        <div>
          <div class="cInputFormAndMessagePartStyle">
            <span>アクセストークン取得</span>
            <form on:submit|preventDefault={showAuthModal}>
              <button
                type="submit"
                disabled={isProcessing}
                class="cIconButtonStyle {isProcessing ? '!bg-gray-500' : ''}"
              >
                <div class="cIconDivStyle">
                  <Icon icon="mdi:login" class="cIconStyle" />
                </div>
              </button>
            </form>
          </div>
          <div class="cInputFormAndMessagePartStyle">
            <input type="password" id="accessToken" bind:value={accessToken} class="border rounded px-4 py-1 h-full" />
            <form on:submit|preventDefault={copyToClipboard}>
              <button
                type="submit"
                disabled={isProcessing}
                class="cIconButtonStyle {isProcessing ? '!bg-gray-500' : ''}"
              >
                <div class="cIconDivStyle">
                  <Icon icon="mdi:content-copy" class="cIconStyle" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row space-x-3">
        <div>
          <div class="cInputFormAndMessagePartStyle">
            <span>チューニング済みモデル一覧</span>
            <form on:submit|preventDefault={updateModels}>
              <button
                type="submit"
                disabled={isProcessing}
                class="cIconButtonStyle {isProcessing ? '!bg-gray-500' : ''}"
              >
                <div class="cIconDivStyle">
                  <Icon icon="mdi:table-refresh" class="cIconStyle" />
                </div>
              </button>
            </form>
          </div>
          <div class="table-container">
            <!-- Native Table Element -->
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>name</th>
                  <th>displayName</th>
                  <th>date</th>
                  <th>state</th>
                  <th>grant</th>
                </tr>
              </thead>
              <tbody>
                {#each tunedModels as model}
                  <tr>
                    <td>{model.name}</td>
                    <td>{model.displayName}</td>
                    <td>{formatDateToJST(model.updateTime)}</td>
                    <td>{model.state}</td>
                    <td>
                      <button>
                        <form on:submit|preventDefault={() => postTunedModelsPermissions(window.fetch, model.name)}>
                          <button
                            type="submit"
                            disabled={isProcessing}
                            class="cIconButtonStyle {isProcessing ? '!bg-gray-500' : ''}"
                          >
                            <div class="cIconDivStyle">
                              <Icon icon="mdi:lock-open-plus-outline" class="cIconStyle" />
                            </div>
                          </button>
                        </form>
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="cInputFormAndMessagePartStyle">
        <input
          type="text"
          id="tunedModelsJsonFileName"
          bind:value={tunedModelsJsonFileName}
          class="border rounded px-4 py-1 h-full"
        />
        <form on:submit|preventDefault={downloadTunedModelsJson}>
          <button type="submit" disabled={isProcessing} class="cIconButtonStyle {isProcessing ? '!bg-gray-500' : ''}">
            <div class="cIconDivStyle">
              <Icon icon="mdi:download-box-outline" class="cIconStyle" />
            </div>
          </button>
        </form>
      </div>

      <div class="flex flex-col md:flex-row space-x-3">
        <div>
          <div class="cInputFormAndMessagePartStyle">
            <span>画像解釈</span>
          </div>
          <div class="cInputFormAndMessagePartStyle">
            <input
              type="text"
              id="exportFileName"
              bind:value={exportFileName}
              class="border rounded px-4 py-1 h-full"
            />
            <form on:submit|preventDefault={explainImages}>
              <button
                type="submit"
                disabled={isProcessing}
                class="cIconButtonStyle {isProcessing ? '!bg-gray-500' : ''}"
              >
                <div class="cIconDivStyle">
                  <Icon icon="mdi:download-box-outline" class="cIconStyle" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
