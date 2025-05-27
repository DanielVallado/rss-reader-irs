import { saveRss, createArticle, getAllArticles, getAllRss, countArticles, getRecommendedArticleIdsForUser, getCollaborativeRecommendedArticleIdsForUser } from "$lib/server/services";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions } from "./$types";
import type { ArticleWithCategories } from '$lib/server/services';

export async function load({ url, locals }) {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  const limit: number = 12;
  const page: number = Number(url.searchParams.get('page')  ?? 1);
  const offset: number = (page - 1) * limit;

  const allArticles: ArticleWithCategories[] = await getAllArticles();
  const articlesMap = new Map(allArticles.map(a => [a.id, a]));

  const total: number = await countArticles();
  const pageCount: number = Math.ceil(total / limit);

  const recommendedIds: number[] = await getRecommendedArticleIdsForUser(locals.user.id, 3);
  const recommendedArticles: ArticleWithCategories[] = recommendedIds
    .map((id: number) => articlesMap.get(id))
    .filter(Boolean) as ArticleWithCategories[];

  const collaborativeIds: number[] = await getCollaborativeRecommendedArticleIdsForUser(locals.user.id, 3);
  const collaborativeArticles: ArticleWithCategories[] = collaborativeIds
    .map((id: number) => articlesMap.get(id))
    .filter(Boolean) as ArticleWithCategories[];

  try {
    return { feed: allArticles, page: page, pageCount: pageCount, user: locals.user, recommendedArticles, collaborativeArticles };
  } catch (error) {
    if (error instanceof Error) {
      return { feed: null, error: error.message };
    } else {
      return { feed: null, error: "Unknown error occurred" };
    }
  }
}

export const actions = {
  addRss: async ({ request }) => {    
    const formData = await request.formData();
    const urlValue = formData.get("link");  

    try {
      await saveRss(urlValue);
      return { success: true };
    } catch (err) {      
      return fail(500, { error: "No pude guardar el RSS, inténtalo de nuevo" });
    }  
  },
  reload: async () => {
    const allRss = await getAllRss();
    await createArticle(allRss); 

    try {
      return { success: true };
    } catch (err) {
      return fail(500, { error: "No pude guardar el RSS, inténtalo de nuevo" });
    }
  }
} satisfies Actions;
