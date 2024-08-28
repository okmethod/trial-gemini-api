import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent): Promise<{ hogeTorusImageUrl: string }> {
  const parentData = await parent();
  return { hogeTorusImageUrl: parentData.hogeTorusImageUrl };
}
