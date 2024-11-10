<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import type { Chat } from "$lib/types/chat";
  import { fetchChatReply } from "$lib/genlang/generateChatContent";
  import transMarkdownToSanitizedHtml from "$lib/utils/transHtml";
  import IconButton from "$lib/components/IconButton.svelte";
  import SelectModelModal from "$lib/components/modals/SelectModelModal.svelte";
  import ChatLogModal from "$lib/components/modals/ChatLogModal.svelte";

  export let data: {
    hogeTorusImageUrl: string;
    initialPrompt: string;
    initialGuide: string;
  };

  let currentModelName: string | null = null;
  const FailedAiOutput = "今日はもう、つかれちゃったよ...";

  let chatHistory: Chat[] = [];
  let currentUserInput = "";
  let currentAiOutput = data.initialGuide;
  let turnCounter = 0;
  let gameStatus: GameStatus = "init";
  let isProcessing = false;
  async function sendMessage() {
    if (currentUserInput.trim() === "") return;
    isProcessing = true;
    const userInput = currentUserInput;
    currentUserInput = "";
    turnCounter += 1;
    console.debug("turn:", turnCounter);
    gameStatus = decideGameStatus(turnCounter);

    let aiOutput: string | null;
    aiOutput = await fetchChatReply(window.fetch, currentModelName, chatHistory, [userInput]);
    if (!aiOutput) {
      aiOutput = FailedAiOutput;
      turnCounter += 99;
    }
    chatHistory = [...chatHistory, { role: "user", parts: [userInput] }, { role: "model", parts: [aiOutput] }];

    currentAiOutput = await transMarkdownToSanitizedHtml(aiOutput);
    isProcessing = false;
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
    currentUserInput = "";
    currentAiOutput = data.initialGuide;
  }

  function startGame() {
    resetGame();
    currentUserInput = data.initialPrompt;
    sendMessage();
  }

  const fullText = "......??????";
  let index = 0;
  let processingMessage = fullText[index];
  let interval: ReturnType<typeof setInterval>;
  function updateProcessingMessage() {
    if (isProcessing) {
      if (index < fullText.length) {
        processingMessage += fullText[index];
        index++;
      } else {
        clearInterval(interval);
      }
    } else {
      index = 0;
      processingMessage = fullText[index];
    }
  }
  onMount(() => {
    interval = setInterval(updateProcessingMessage, 500);
  });
  onDestroy(() => {
    clearInterval(interval);
  });

  // モーダル表示
  const modalStore = getModalStore();
  function modalSettings(modalComponent: ModalComponent): ModalSettings {
    return {
      type: "component",
      component: modalComponent,
      backdropClasses: "fixed inset-0 !bg-gray-300/90",
    };
  }

  function showSelectModelModal(): void {
    const modalComponent: ModalComponent = {
      ref: SelectModelModal,
      props: {
        currentModelName: currentModelName,
        selectModel: _selectModel,
      },
    };
    function _selectModel(selectedModelName: string): void {
      currentModelName = selectedModelName;
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

  /* eslint-disable svelte/no-at-html-tags */
  /* {@html}ディレクティブ を使う前は必ずサニタイズすること！ */
</script>

<div class="cRouteBodyStyle">
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">Pokenator</h1>
  </div>

  <div class="cContentPartStyle !mt-1 !ml-1 !mr-1">
    <!-- 上部ボタン -->
    <div class="flex items-center justify-between space-x-2 ml-8 mr-8">
      <IconButton icon="mdi:search" cButton="btn-sm" onClick={showSelectModelModal} />
      <div class="flex-grow"><!--spacer--></div>
      <IconButton icon="mdi:restart" cButton="btn-sm" onClick={resetGame} />
      <IconButton icon="mdi:forum-outline" cButton="btn-sm" onClick={showChatLogModal} />
    </div>

    <!-- Pokenator 表示 -->
    <div class="m-4">
      <div class="flex flex-col items-center justify-center">
        <div class="w-24 h-24 mb-1">
          <img src={data.hogeTorusImageUrl} alt="Pokenator" class="w-full h-full object-contain" />
        </div>
        <div class="cSpeechBubbleHeaderStyle" />
        <div class="cSpeechBubbleBodyStyle">
          {#if isProcessing}
            <span>{processingMessage}</span>
          {:else}
            <span>{@html `${currentAiOutput}`} </span>
          {/if}
        </div>
      </div>
    </div>

    <!-- 下部ボタン -->
    <div class="flex items-center justify-center space-x-2">
      {#if gameStatus === "init"}
        <button type="button" on:click={startGame} class="btn variant-filled"> はじめる </button>
      {:else if gameStatus === "onGame"}
        <button
          type="button"
          on:click={() => {
            currentUserInput = "はい";
            sendMessage();
          }}
          class="btn variant-filled"
        >
          はい
        </button>
        <button
          type="button"
          on:click={() => {
            currentUserInput = "いいえ";
            sendMessage();
          }}
          class="btn variant-filled"
        >
          いいえ
        </button>
      {:else if gameStatus === "giveUp"}
        <input
          id="message"
          type="text"
          class="text-surface-900 rounded"
          bind:value={currentUserInput}
          placeholder="ポケモンの名前"
        />
        <button type="button" on:click={sendMessage} class="btn variant-filled"> こたえる </button>
      {:else if gameStatus === "gameOver"}
        <button type="button" on:click={startGame} class="btn variant-filled"> もう一度 </button>
      {:else}
        <button type="button" on:click={resetGame} class="btn variant-filled"> リセット </button>
      {/if}
    </div>
  </div>
</div>
