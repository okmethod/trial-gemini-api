<script lang="ts">
  import type { GenerativeModel, StartChatParams } from "@google/generative-ai";
  import postChatReply from "$lib/api/postChatReply.client";
  import modelParams from "./modelParams";
  import initialPrompt from "./initialPrompt";

  export let data: {
    model: GenerativeModel | null;
    hogeTorusImageUrl: string;
  };

  interface Chat {
    role: "user" | "model";
    parts: string;
  }

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

  function reset() {
    chatHistory = [];
    userInput = initialPrompt;
    sendMessage();
  }
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">Pokenator</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !mt-1 !ml-4 !mr-4">
    <!-- ボタン -->
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
    </div>
    <div class="m-4">
      <div>
        <img src={data.hogeTorusImageUrl} alt="Pokenator" class="w-40 h-40 rounded" />
      </div>
      <div class="p-2 w-80 h-96 overflow-y-scroll bg-gray-100 rounded">
        {#each chatHistory.slice(1) as chat}
          <div class={chat.role === "user" ? "user-message" : "ai-message"}>
            <strong>{chat.role === "user" ? "You" : "AI"}:</strong>
            {chat.parts}
          </div>
        {/each}
      </div>
    </div>
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
