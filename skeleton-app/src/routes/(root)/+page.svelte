<script lang="ts">
  import type { GenerativeModel, StartChatParams } from "@google/generative-ai";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import type { Chat } from "$lib/types/chat";
  import postChatReply from "$lib/api/postChatReply.client";
  import transMarkdownToSanitizedHtml from "$lib/utils/transHtml";
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
  let aiOutput = "";
  async function sendMessage() {
    if (userInput.trim() === "") return;
    chatHistory = [...chatHistory, { role: "user", parts: userInput }];

    const reply = (await fetchChatReply(chatHistory, userInput)) ?? "今日はもう、つかれちゃったよ...";
    chatHistory = [...chatHistory, { role: "model", parts: reply }];

    userInput = "";
    aiOutput = await transMarkdownToSanitizedHtml(reply);
  }

  function resetChat() {
    chatHistory = [];
    userInput = "";
    aiOutput = "";
  }

  function startGame() {
    resetChat();
    userInput = initialPrompt;
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
      case message.length > 200:
        return "text-xs";
      case message.length > 100:
        return "text-sm";
      default:
        return "text-base";
    }
  }

  const cButtonSpan = "w-16 h-5 flex items-center justify-center";
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
      <form on:submit|preventDefault={resetChat}>
        <button type="submit" class="cIconButtonStyle">
          <div class="cIconDivStyle">
            <Icon icon="mdi:restart" class="cIconStyle" />
          </div>
        </button>
      </form>
      <form on:submit|preventDefault={showChatLogModal}>
        <button type="submit" class="cIconButtonStyle">
          <div class="cIconDivStyle">
            <Icon icon="mdi:forum-outline" class="cIconStyle" />
          </div>
        </button>
      </form>
    </div>

    <!-- Pokenator 表示 -->
    <div class="m-4">
      <div class="flex flex-col items-center justify-center">
        <div class="w-24 h-24 mb-1">
          <img src={data.hogeTorusImageUrl} alt="Pokenator" class="w-full h-full object-contain" />
        </div>
        <div
          class="
            border-b-8 border-b-gray-100
            border-t-8 border-t-transparent
            border-l-8 border-l-transparent
            border-r-8 border-r-transparent
          "
        />
        <div class="w-72 h-48 p-2 bg-gray-100 rounded-xl">
          {#if aiOutput === ""}
            <span>ゲームを始めよう！</span>
          {:else}
            <span class={cTextSize(aiOutput)}>{@html aiOutput}</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- 下部ボタン -->
    <div class="flex items-center justify-center space-x-2">
      {#if aiOutput === ""}
        <form on:submit|preventDefault={startGame}>
          <button type="submit" class="cIconButtonStyle">
            <div class={cButtonSpan}>
              <span> はじめる </span>
            </div>
          </button>
        </form>
      {:else}
        <form
          on:submit|preventDefault={() => {
            userInput = "はい";
            sendMessage();
          }}
        >
          <button type="submit" class="cIconButtonStyle">
            <div class={cButtonSpan}>
              <span> はい </span>
            </div>
          </button>
        </form>
        <form
          on:submit|preventDefault={() => {
            userInput = "いいえ";
            sendMessage();
          }}
        >
          <button type="submit" class="cIconButtonStyle">
            <div class={cButtonSpan}>
              <span> いいえ </span>
            </div>
          </button>
        </form>
      {/if}
    </div>

    <div class="h-6"><!--spacer--></div>

    <!-- 任意メッセージ送信 -->
    <div class="m-4">
      <div class="flex items-center justify-center space-x-2">
        <input id="message" type="text" class="rounded" bind:value={userInput} placeholder="your message..." />
        <button on:click={sendMessage} class="cIconButtonStyle">
          <div class="cSpanDivStyle">
            <span> Send </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
