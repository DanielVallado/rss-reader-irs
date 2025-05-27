import { json } from '@sveltejs/kit';
import { registerArticleClick } from '$lib/server/services/articlesService';

export const POST = async ({ request }) => {
  const { userId, articleId } = await request.json();
  if (!userId || !articleId) {
    return json({ error: 'Faltan datos' }, { status: 400 });
  }
  await registerArticleClick(userId, articleId);
  return json({ success: true });
}; 