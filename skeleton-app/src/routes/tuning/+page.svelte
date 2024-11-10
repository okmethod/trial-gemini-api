<script lang="ts">
  import { getToastStore, getModalStore } from "@skeletonlabs/skeleton";
  import type { ToastSettings, ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import type { TunedModel } from "$lib/types/model";
  import getTunedModels from "$lib/api/genlang/getTunedModels.client";
  import postTunedModelsPermissions from "$lib/api/genlang/postTunedModelsPermissions.client";
  import { fetchText } from "$lib/genlang/generateContent";
  import { checkToken } from "$lib/utils/auth";
  import { formatDateToJST } from "$lib/utils/format";
  import { downloadFile } from "$lib/utils/download.client";
  import IconButton from "$lib/components/IconButton.svelte";
  import AuthModal from "$lib/components/modals/AuthModal.svelte";
  import type { PokePrompt } from "$lib/constants/poke";

  export let data: {
    trainingPokePrompts: Record<number, PokePrompt>;
  };

  const toastStore = getToastStore();
  function toastSettings(message: string): ToastSettings {
    return {
      message: message,
      background: "bg-surface-900 select-none",
      timeout: 2000,
    };
  }

  const modalStore = getModalStore();
  function modalSettings(modalComponent: ModalComponent): ModalSettings {
    return {
      type: "component",
      component: modalComponent,
      backdropClasses: "fixed inset-0 !bg-gray-300/90",
    };
  }

  // 認証モーダル表示
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
    _showHintToast();

    function _showHintToast(): void {
      const t = toastSettings("Copied!");
      toastStore.trigger(t);
    }
  }

  // モデル一覧取得
  let tunedModels: TunedModel[] = [];
  async function updateModels() {
    tunedModels = await getTunedModels(window.fetch);
    _updateModelTableToast(tunedModels.length);

    function _updateModelTableToast(count: number): void {
      const t = toastSettings(`Updated: ${count} models`);
      toastStore.trigger(t);
    }
  }

  async function updatePermissions(modelName: string) {
    const permissons = await postTunedModelsPermissions(window.fetch, modelName);
    _updatePermissionsToast(permissons.length);

    function _updatePermissionsToast(count: number): void {
      const t = toastSettings(count > 0 ? "Permissions Updated." : "No permissions updated.");
      toastStore.trigger(t);
    }
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

    for (const key in data.trainingPokePrompts) {
      const pokeData = data.trainingPokePrompts[key];
      const generatedtext = await fetchText(null, [pokeData.prompt, pokeData.imagePart]);
      console.log(`Generated content for ${pokeData.name}:`, generatedtext);
    }
  }

  let exportFileName = "tuning.csv";
  let isProcessing = false;
</script>

<div class="cRouteBodyStyle">
  <div class="cTitlePartStyle">
    <h1 class="cTitleStyle">チューニング・サポーター</h1>
  </div>

  <div class="cContentPartStyle !min-w-[300px] !max-w-[600px]">
    <!-- 各種メニュー -->
    <div class="m-4 space-y-4">
      <div class="flex flex-col md:flex-row space-x-3">
        <div>
          <div class="cInputFormAndMessagePartStyle">
            <span>アクセストークン取得</span>
            <IconButton icon="mdi:login" cButton="btn-sm" onClick={showAuthModal} disabled={isProcessing} />
          </div>
          <div class="cInputFormAndMessagePartStyle">
            <input
              type="password"
              id="accessToken"
              bind:value={accessToken}
              class="h-full text-surface-900 border rounded px-4 py-1"
            />
            <IconButton icon="mdi:content-copy" cButton="btn-sm" onClick={copyToClipboard} disabled={isProcessing} />
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row space-x-3">
        <div>
          <div class="cInputFormAndMessagePartStyle">
            <span>チューニング済みモデル一覧</span>
            <IconButton icon="mdi:table-refresh" cButton="btn-sm" onClick={updateModels} disabled={isProcessing} />
          </div>
          <div class="table-container py-2">
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
                      <IconButton
                        icon="mdi:lock-open-plus-outline"
                        cButton="btn-sm"
                        onClick={() => updatePermissions(model.name)}
                        disabled={isProcessing}
                      />
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
          class="text-surface-900 border rounded px-4 py-1 h-full"
        />
        <IconButton
          icon="mdi:download-box-outline"
          cButton="btn-sm"
          onClick={downloadTunedModelsJson}
          disabled={isProcessing}
        />
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
              class="text-surface-900 border rounded px-4 py-1 h-full"
            />
            <IconButton
              icon="mdi:download-box-outline"
              cButton="btn-sm"
              onClick={explainImages}
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
