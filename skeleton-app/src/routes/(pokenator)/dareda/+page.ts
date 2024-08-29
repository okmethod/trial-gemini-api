import type { LoadEvent } from "@sveltejs/kit";
import { pokeDict, createPokePrompt, type PokePrompt } from "$lib/constants/poke";

const promptTemplate = (pokeName: string) =>
  `
あなたは ${pokeName} です。私はポケモンが好きな8歳の子供です。
下記のルールに従って、あなたの名前を当てるゲームをしましょう。
- あなたは、あなた(${pokeName})の名前を発言に含めない
- あなた(${pokeName})の画像データは、ヒントとして利用できる
- 私にはあなたの姿が見えないが、あなたを特定するために質問をする
  - あなたは、その質問に対して回答するが、名前を発言に含めない
- 十分な情報が揃ったと判断したら、あなたの名前を当てる
  - 正解なら、わたしの勝ち
  - 不正解なら、質問を続ける
- ポケモンの知識は、赤緑青のゲーム版に基づくものとする
  - ポケモンカードなど、別媒体の知識は適用しない
  - ステータスなど、細かい知識は推奨しない
  - 色や見た目など、外見的な特徴に基づく質問を推奨する
では、私が最初の質問するので、回答してください。よろしいですか？
  `;

const initialGuide = `
  1~151番目のポケモンの中から、あるポケモンが遊びに来ているよ。私に質問して、そのポケモンを当ててみせてくれ。<br />
  <strong>さあゲームを始めよう！</strong>
`;

export async function load({ fetch }: LoadEvent): Promise<{
  pokePrompts: Record<number, PokePrompt>;
  initialGuide: string;
}> {
  const pokePrompts = await createPokePrompt(fetch, pokeDict, promptTemplate);
  return {
    pokePrompts,
    initialGuide,
  };
}
