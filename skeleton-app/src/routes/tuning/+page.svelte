<script lang="ts">
  import { getToastStore, getModalStore } from "@skeletonlabs/skeleton";
  import type { ToastSettings, ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import { fetchText } from "$lib/utils/generativeLanguage";
  import { checkToken } from "$lib/utils/auth";
  import AuthModal from "$lib/components/AuthModal.svelte";
  import type { PokeData } from "./+page";

  export let data: {
    trainingPokeDict: Record<number, PokeData>;
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
            <input
              type="password"
              id="accessToken"
              bind:value={accessToken}
              class="border rounded px-4 py-1 w-full h-full"
            />
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
            <span>画像解釈</span>
          </div>
          <div class="cInputFormAndMessagePartStyle">
            <input
              type="text"
              id="exportFileName"
              bind:value={exportFileName}
              class="border rounded px-4 py-1 w-full h-full"
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
