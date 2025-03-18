import { extractImageUrl } from "$lib";
import { SanitizeArticle } from "$lib/server/sanitizeArticle";
import { parseRss } from "$lib/server/services";
import { getCategoryByName, getArticleByLink, createArticle, createCategory, createCategoryArticleAssociation } from "$lib/server/repositories";
import type { NewArticle, NewCategory } from "$lib/server/repositories";

export async function saveArticles(allRss: any): Promise<void> {
  for (const rss of allRss) {
    const feed = await parseRss(rss.url);

    if (feed) {
      for (const item of feed.items) {
        const cleanItem = SanitizeArticle(item);

        const dateObj = new Date(cleanItem.pubDate);
        const formattedPubDate = !isNaN(dateObj.getTime())
          ? dateObj.toISOString().slice(0, 19).replace("T", " ")
          : null;

        const newArticle: NewArticle = {
          rssId: rss.id,
          title: cleanItem.title,
          link: cleanItem.link,
          publishedAt: formattedPubDate,
          description: cleanItem.content,
          imageUrl: extractImageUrl(item),
          author: cleanItem.creator,
        };

        if (cleanItem.categories) {
          for (const categoryName of cleanItem.categories) {
            const category = await getCategoryByName(categoryName);
            let categoryId: number;
            if (category === null) {
              const newCategory: NewCategory = { name: categoryName };
              categoryId = await createCategory(newCategory);
            } else {
              categoryId = category.id;
            }

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
