import { IsValidUrl, extractImageUrl } from "$lib";
import { parseRss, verifyRss } from "$lib/server/services";
import { getAllRss, createRss, getAllArticles, getCategoryByName, getArticleByLink, createArticle, createCategory, createCategoryArticleAssociation } from "$lib/server/repositories";
import type { NewRss, NewArticle, NewCategory } from "$lib/server/repositories";

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export async function load() {
   const allArticles = await getAllArticles();

  try {
    return { feed: allArticles };
  } catch (error) {
    if (error instanceof Error) {
      return { feed: null, error: error.message };
    } else {
      return { feed: null, error: "Ocurrió un error desconocido" };
    }
  }
}

export const actions = {
  addRss: async ({ request }) => {    
    const formData = await request.formData();
    const urlValue = formData.get("link");    

    if (!IsValidUrl(urlValue)) {
      return fail(400, {error: "La URL no es válida"});
    }
    
    if (await verifyRss(urlValue) === null) {
      return fail(400, {error: "La URL no es un feed RSS válido"});
    }

    const newRss: NewRss = { url: urlValue.trim() };    
    await createRss(newRss);
    return { success: true };
  },
  reload: async () => {
    const allRss = await getAllRss();

    for (const rss of allRss) {
      const feed = await parseRss(rss.url);

      if (feed) {
        for (const item of feed.items) {
          const dateObj = new Date(item.pubDate);
          const formattedPubDate = !isNaN(dateObj.getTime())
            ? dateObj.toISOString().slice(0, 19).replace("T", " ")
            : null;

          const newArticle: NewArticle = {
            rssId: rss.id,
            title: item.title,
            link: item.link,
            publishedAt: formattedPubDate,
            description: item.content,
            imageUrl: extractImageUrl(item),
            author: item.creator,
          };          

          if (item.categories) {
            for (const categoryName of item.categories) {
              const category = await getCategoryByName(categoryName);
              let categoryId: number;
              if (category === null) {
                const newCategory: NewCategory = { name: categoryName };
                categoryId = await createCategory(newCategory);
              } else {
                categoryId = category.id;
              };

              const article = await getArticleByLink(newArticle.link);
              let articleId: number; 
              if (article === null) {
                articleId = await createArticle(newArticle);
                await createCategoryArticleAssociation(categoryId, articleId);
              }              
            }
          } else {
            const article = await getArticleByLink(newArticle.link);
            if (article === null) {
              await createArticle(newArticle);
            }
          }
        }
      }
    }

  }
} satisfies Actions;

