<script lang="ts">
  import type { GenerativeModel, StartChatParams } from "@google/generative-ai";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import type { Chat } from "$lib/types/chat";
  import postChatReply from "$lib/api/postChatReply.client";
  import ChatLogModal from "$lib/components/ChatLogModal.svelte";
  import modelParams from "./modelParams";
  import initialPrompt from "./initialPrompt";

  export let data: {
    model: GenerativeModel | null;
    hogeTorusImageUrl: string;
  };

  async function fetchChatReply(chatHistory: Chat[], userInput: string): Promise<string | null> {
    const chatParam: StartChatParams = {
      history: chatHistory.map((chat) => ({
        role: chat.role,
        parts: [{ text: chat.parts }],
      })),
    };
    let reply: string | null;
    if (data?.model) {
      // development
      const chat = data.model.startChat(chatParam);
      const response = await chat.sendMessage(userInput);
      reply = response.response.text();
    } else {
      // production
      const response = await postChatReply(window.fetch, modelParams, chatParam, userInput);
      reply = response.response.candidates ? (response.response.candidates[0].content.parts[0].text ?? null) : null;
    }
    return reply;
  }

  let chatHistory: Chat[] = [];
  let userInput = "";
  async function sendMessage() {
    if (userInput.trim() === "") return;
    chatHistory = [...chatHistory, { role: "user", parts: userInput }];

    const reply = (await fetchChatReply(chatHistory, userInput)) ?? "今日はもう、つかれちゃったよ";
    chatHistory = [...chatHistory, { role: "model", parts: reply }];

    userInput = "";
  }
  let latestAiOutput: string | null = null;
  $: latestAiOutput = chatHistory.filter((chat) => chat.role === "model").slice(-1)[0]?.parts ?? null;

  function reset() {
    chatHistory = [];
    userInput = initialPrompt;
    latestAiOutput = null;
    sendMessage();
  }

  // モーダル表示
  const modalStore = getModalStore();
  function modalSettings(modalComponent: ModalComponent): ModalSettings {
    return {
      type: "component",
      component: modalComponent,
      backdropClasses: "fixed inset-0 !bg-gray-300/90",
    };
  }

  function showChatLogModal(): void {
    const modalComponent: ModalComponent = {
      ref: ChatLogModal,
      props: {
        title: "チャットログ",
        chatHistory: chatHistory,
      },
    };
    const m = modalSettings(modalComponent);
    modalStore.trigger(m);
  }

  // スタイル
  function cTextSize(message: string | null): string {
    if (message === null) {
      return "text-base";
    }
    switch (true) {
      case message.length > 80:
        return "text-xs";
      case message.length > 60:
        return "text-sm";
      default:
        return "text-base";
    }
  }
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">Pokenator</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !mt-1 !ml-1 !mr-1">
    <!-- 上部ボタン -->
    <div class="flex items-center justify-center space-x-2">
      <div class="cInputFormAndMessagePartStyle">
        <form
          on:submit|preventDefault={() => {
            userInput = "はい";
            sendMessage();
          }}
        >
          <button type="submit" class="cIconButtonStyle">
            <div class="cSpanDivStyle">
              <span> Yes </span>
            </div>
          </button>
        </form>
      </div>
      <div class="cInputFormAndMessagePartStyle">
        <form
          on:submit|preventDefault={() => {
            userInput = "いいえ";
            sendMessage();
          }}
        >
          <button type="submit" class="cIconButtonStyle">
            <div class="cSpanDivStyle">
              <span> No </span>
            </div>
          </button>
        </form>
      </div>
      <div class="cInputFormAndMessagePartStyle">
        <form on:submit|preventDefault={reset}>
          <button type="submit" class="cIconButtonStyle">
            <div class="cSpanDivStyle">
              <span> Reset </span>
            </div>
          </button>
        </form>
      </div>
      <form on:submit|preventDefault={showChatLogModal}>
        <button type="submit" class="cIconButtonStyle">
          <div class="cIconDivStyle">
            <Icon icon="mdi:forum-outline" class="cIconStyle" />
          </div>
        </button>
      </form>
    </div>

    <!-- Pokenator 表示 -->
    <div class="mt-4 mb-4">
      <div class="flex items-center justify-center space-x-2">
        <div>
          <img src={data.hogeTorusImageUrl} alt="Pokenator" class="w-24 h-24" />
        </div>
        <div class="relative p-2 w-48 h-48 bg-gray-100 rounded-xl">
          <div
            class="absolute top-16 left-0 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100 -ml-2"
          />
          {#if latestAiOutput}
            <span class={cTextSize(latestAiOutput)}>{latestAiOutput}</span>
          {:else}
            <span>ゲームを始めよう！</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- 任意メッセージ送信 -->
    <div class="m-4">
      <div class="flex items-center justify-center space-x-2">
        <input id="message" type="text" class="rounded" bind:value={userInput} placeholder="Type your message..." />
        <button on:click={sendMessage} class="cIconButtonStyle">
          <div class="cSpanDivStyle">
            <span> Send </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
