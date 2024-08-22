<script context="module" lang="ts">
  import { GoogleGenerativeAI } from "@google/generative-ai"; // クライアントサイドで実行する場合
</script>

<script lang="ts">
  //const { GoogleGenerativeAI } = require("@google/generative-ai"); サーバサイドで実行する場合
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let chatHistory: { sender: string; message: string }[] = [];
  let userInput = "";
  async function sendMessage() {
    if (userInput.trim() === "") return;
    chatHistory = [...chatHistory, { sender: "user", message: userInput }];
    const prompt = userInput;
    userInput = "";

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiMessage = response.text();

      chatHistory = [...chatHistory, { sender: "ai", message: aiMessage }];
    } catch (error) {
      console.error("Error generating content:", error);
    }
  }

  function reset() {
    chatHistory = [];
  }
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">Example</h1>
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
      <div class="chat-history">
        <div class="p-2 bg-gray-100 rounded">
          <span>chat history</span>
          {#each chatHistory as chat}
            <div class={chat.sender === "user" ? "user-message" : "ai-message"}>
              <strong>{chat.sender === "user" ? "You" : "AI"}:</strong>
              {chat.message}
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="m-4">
      <div class="user-input">
        <input type="text" bind:value={userInput} placeholder="Type your message..." />
        <button on:click={sendMessage} class="cIconButtonStyle">
          <div class="cSpanDivStyle">
            <span> Send </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
