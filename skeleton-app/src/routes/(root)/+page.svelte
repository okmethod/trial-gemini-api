<script lang="ts">
  import type { GenerativeModel, StartChatParams } from "@google/generative-ai";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import type { Chat } from "$lib/types/chat";
  import postChatReply from "$lib/api/postChatReply.client";
  import transMarkdownToSanitizedHtml from "$lib/utils/transHtml";
  import SelectModelModal from "$lib/components/SelectModelModal.svelte";
  import ChatLogModal from "$lib/components/ChatLogModal.svelte";
  import { defaultModelParams } from "$lib/constants/modelSettings";
  import { initialPrompt, initialGuide } from "./initialPrompt";

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
      const response = await postChatReply(window.fetch, defaultModelParams(), chatParam, userInput);
      reply = response.response.candidates ? (response.response.candidates[0].content.parts[0].text ?? null) : null;
    }
    return reply;
  }

  const FailedAiOutput = "今日はもう、つかれちゃったよ...";

  let chatHistory: Chat[] = [];
  let userInput = "";
  let aiOutput = initialGuide;
  let turnCounter = 0;
  let gameStatus: GameStatus = "init";
  async function sendMessage() {
    if (userInput.trim() === "") return;
    chatHistory = [...chatHistory, { role: "user", parts: userInput }];

    let reply: string;
    try {
      reply = (await fetchChatReply(chatHistory, userInput)) ?? FailedAiOutput;
    } catch (error) {
      console.error(error);
      reply = FailedAiOutput;
      turnCounter += 99;
    }
    chatHistory = [...chatHistory, { role: "model", parts: reply }];

    userInput = "";
    aiOutput = await transMarkdownToSanitizedHtml(reply);
    turnCounter += 1;
    gameStatus = decideGameStatus(turnCounter);
    console.log(turnCounter);
  }

  type GameStatus = "init" | "onGame" | "giveUp" | "gameOver" | "unknown";
  const maxTurn = 12; // 最大10回答 -> 正解ポケモンこれかな？ -> 正解ポケモン教えて？
  function decideGameStatus(turn: number): GameStatus {
    switch (true) {
      case turn > maxTurn:
        return "gameOver";
      case turn === maxTurn:
        return "giveUp";
      case turn > 0:
        return "onGame";
      case turn === 0:
        return "init";
      default:
        return "unknown";
    }
  }

  function resetGame() {
    chatHistory = [];
    turnCounter = 0;
    gameStatus = decideGameStatus(turnCounter);
    userInput = "";
    aiOutput = initialGuide;
  }

  function startGame() {
    resetGame();
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

  let currentModel = "Model A";
  function showSelectModelModal(): void {
    const modalComponent: ModalComponent = {
      ref: SelectModelModal,
      props: {
        currentModel: currentModel,
        selectModel: _selectModel,
      },
    };
    function _selectModel(selectedModel: string): void {
      currentModel = selectedModel;
    }
    const m = modalSettings(modalComponent);
    modalStore.trigger(m);
  }

  function showChatLogModal(): void {
    const modalComponent: ModalComponent = {
      ref: ChatLogModal,
      props: {
        chatHistory: chatHistory,
      },
    };
    const m = modalSettings(modalComponent);
    modalStore.trigger(m);
  }

  // スタイル
  const cButtonSpan = "w-16 h-5 flex items-center justify-center";

  /* eslint-disable svelte/no-at-html-tags */
  /* {@html}ディレクティブ を使う前は必ずサニタイズすること！ */
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">Pokenator</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !mt-1 !ml-1 !mr-1">
    <!-- 上部ボタン -->
    <div class="flex items-center justify-between space-x-2 ml-8 mr-8">
      <form on:submit|preventDefault={showSelectModelModal}>
        <button type="submit" class="cIconButtonStyle">
          <div class="cIconDivStyle">
            <Icon icon="mdi:brain" class="cIconStyle" />
          </div>
        </button>
      </form>
      <div class="flex-grow"><!--spacer--></div>
      <form on:submit|preventDefault={resetGame}>
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
        <div class="w-72 h-full p-4 bg-gray-100 rounded-xl">
          <span>{@html `${aiOutput}`} </span>
        </div>
      </div>
    </div>

    <!-- 下部ボタン -->
    <div class="flex items-center justify-center space-x-2">
      {#if gameStatus === "init"}
        <form on:submit|preventDefault={startGame}>
          <button type="submit" class="cIconButtonStyle">
            <div class={cButtonSpan}>
              <span> はじめる </span>
            </div>
          </button>
        </form>
      {:else if gameStatus === "onGame"}
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
      {:else if gameStatus === "giveUp"}
        <input id="message" type="text" class="rounded" bind:value={userInput} placeholder="ポケモンの名前" />
        <button on:click={sendMessage} class="cIconButtonStyle">
          <div class={cButtonSpan}>
            <span> こたえる </span>
          </div>
        </button>
      {:else if gameStatus === "gameOver"}
        <form on:submit|preventDefault={startGame}>
          <button type="submit" class="cIconButtonStyle">
            <div class={cButtonSpan}>
              <span> もう一度 </span>
            </div>
          </button>
        </form>
      {:else}
        <form on:submit|preventDefault={resetGame}>
          <button type="submit" class="cIconButtonStyle">
            <div class={cButtonSpan}>
              <span> リセット </span>
            </div>
          </button>
        </form>
      {/if}
    </div>
  </div>
</div>
