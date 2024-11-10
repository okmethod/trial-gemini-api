<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import { setAccessToken } from "$lib/stores/auth";
  import { authUrl, authToken } from "$lib/utils/auth";

  export let parent;
  export let setToken: (token: string | null) => void;

  const modalStore = getModalStore();

  let step: "inputAuthCode" | "term" = "inputAuthCode";
  let authCode = "";
  let token: string | null = null;
  const handleNext = async () => {
    switch (step) {
      case "inputAuthCode":
        token = await authToken(window.fetch, authCode);
        // memo: アクセストークンの保存はコールバックに任せたほうが良いかも
        if (token !== null) setAccessToken(token);
        setToken(token);
        step = "term";
        break;
      case "term":
        closeModal();
        break;
      default:
        break;
    }
  };

  function closeModal() {
    modalStore.close();
  }
</script>

{#if $modalStore[0]}
  <div class="" data-parent={parent}>
    <div class="relative min-w-80">
      <div class="h-full h-full bg-surface-900 rounded-lg">
        <div class="h-full flex flex-col items-center p-4">
          <h2 class="text-xl font-bold">アクセストークン取得</h2>
          <div class="flex flex-col items-center mt-8 space-y-4">
            {#if step === "inputAuthCode"}
              <span class="block">Googleアカウントの認証が必要です。</span>
              <span class="block">
                <a href={authUrl()} target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:underline">
                  認証コード取得URL
                </a>
              </span>
              <input
                id="authCode"
                type="text"
                bind:value={authCode}
                class="w-3/4 text-surface-900"
                placeholder="ここに入力"
              />
            {:else}
              <span class="block">認証に {token ? "成功" : "失敗"} しました。</span>
            {/if}

            <div class="flex items-center justify-center space-x-2">
              <button type="button" on:click={handleNext} class="btn variant-filled">
                {step !== "term" ? "次へ" : "終了"}
              </button>
              <button type="button" on:click={closeModal} class="btn variant-filled"> キャンセル </button>
            </div>
          </div>
        </div>
      </div>
      <button on:click={closeModal} class="absolute top-2 right-2 z-10">
        <Icon icon="mdi:close" class="w-5 h-5" />
      </button>
    </div>
  </div>
{/if}
