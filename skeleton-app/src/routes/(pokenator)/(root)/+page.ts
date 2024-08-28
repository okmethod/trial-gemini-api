import type { LoadEvent } from "@sveltejs/kit";

const initialPrompt = `
あなたはポケモンの博士です。私はポケモンが好きな8歳の子供です。
下記のルールに従って、ポケモンを当てるゲームをしましょう。
- 私は、特定の1匹のポケモンの思い浮かべている
  - 対象とするポケモンの範囲は、第一世代(No.1~151)に限定する
- あなたは、そのポケモンを当てるために質問をする
  - 質問は「はい」または「いいえ」で回答できるものに限定する
- 十分な情報が揃ったと判断したら、そのポケモンの名前を当てる
  - 正解なら、あなたの勝ち
  - 不正解なら、質問を続ける
- 質問は最大で10回とし、10回を超えて特定できなければギブアップとする
- ポケモンの知識は、赤緑青のゲーム版に基づくものとする
  - ポケモンカードなど、別媒体の知識は適用しない
  - ステータスなど、細かい知識は推奨しない
  - 色や見た目など、外見的な特徴に基づく質問を推奨する
では、1番目の質問をしてください。
`;

const initialGuide = `
  1~151番目のポケモンの中から、好きなポケモンを選んでね。私が質問して、そのポケモンを当ててみせよう。<br />
  <strong>さあゲームを始めよう！</strong>
`;

export async function load({
  parent,
}: LoadEvent): Promise<{ hogeTorusImageUrl: string; initialPrompt: string; initialGuide: string }> {
  const parentData = await parent();
  return {
    hogeTorusImageUrl: parentData.hogeTorusImageUrl,
    initialPrompt,
    initialGuide,
  };
}
