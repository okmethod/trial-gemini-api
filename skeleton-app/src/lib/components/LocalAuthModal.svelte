<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import { idToken } from "$lib/stores/auth";
  import postTokenEndpoint from "$lib/api/postTokenEndpoint.client";
  import { authUrl } from "$lib/utils/getAuthToken.client";

  export let parent;

  const modalStore = getModalStore();

  let step: "inputAuthCode" | "term" = "inputAuthCode";
  let authCode = "";
  let token: string | null = null;
  const handleNext = async () => {
    switch (step) {
      case "inputAuthCode":
        try {
          token = await postTokenEndpoint(authCode);
          idToken.set(token);
        } catch (error) {
          console.error(error);
        }
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
      <div class="h-full h-full bg-white rounded-lg">
        <div class="p-4 flex flex-col h-full">
          <h2 class="text-xl font-bold mb-2">モデル切り替え</h2>
          <div class="mt-4 space-y-10">
            <div class="m-4 space-y-4">
              {#if step === "inputAuthCode"}
                <span class="block">Googleアカウントの認証が必要です。</span>
                <span class="block">
                  <a
                    href={authUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-500 hover:underline font-bold ml-8"
                  >
                    認証コード取得URL
                  </a>
                </span>
                <input id="authCode" type="text" bind:value={authCode} class="w-3/4 ml-4" placeholder="ここに入力" />
              {:else}
                <span class="block">認証に {token ? "成功" : "失敗"} しました。</span>
              {/if}
            </div>
            <div class="flex items-center justify-center space-x-2">
              <form on:submit|preventDefault={handleNext}>
                <button type="submit" class="cIconButtonStyle">
                  <div class="w-20 h-5 flex items-center justify-center">
                    <span> {step !== "term" ? "次へ" : "終了"} </span>
                  </div>
                </button>
              </form>
              <form on:submit|preventDefault={closeModal}>
                <button type="submit" class="cIconButtonStyle">
                  <div class="w-20 h-5 flex items-center justify-center">
                    <span> キャンセル</span>
                  </div>
                </button>
              </form>
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
