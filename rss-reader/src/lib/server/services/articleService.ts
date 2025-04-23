import * as repository from "$lib/server/repositories";
import { extractImageUrl } from "$lib";
import { parseRss } from "$lib/server/services";
import { sortArticles } from "$lib/utils/sortArticles";
import sanitizeHtml from "sanitize-html";

import type { Article, Category } from "$lib/server/repositories";


export async function getAllArticles(): Promise<any[]> {
  const allArticles = await repository.getAllArticles();
  const sortedArticles = sortArticles(allArticles, "date");
  return sortedArticles;
}

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

        const newArticle: Article = {
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
            const category = await repository.getCategoryByName(categoryName);
            let categoryId: number;
            if (category === null) {
              const newCategory: Category = { name: categoryName };
              categoryId = await repository.createCategory(newCategory);
            } else {
              categoryId = category.id;
            }

            const article = await repository.getArticleByLink(newArticle.link);
            let articleId: number;
            if (article === null) {
              articleId = await repository.createArticle(newArticle);
              await repository.createCategoryArticleAssociation(
                categoryId,
                articleId
              );
            }
          }
        } else {
          const article = await repository.getArticleByLink(newArticle.link);
          if (article === null) {
            await repository.createArticle(newArticle);
          }
        }
      }
    }
  }
}

function SanitizeText(text: string): string {
  let sanitized = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  sanitized = sanitized.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "");
  return sanitized.replace(/\s+/g, " ").trim();
}

function SanitizeArticle(article: any): any {
  const sanitizedArticle = { ...article };

  if (typeof sanitizedArticle.title === "string") {
    sanitizedArticle.title = SanitizeText(sanitizedArticle.title);
  }
  if (typeof sanitizedArticle.link === "string") {
    sanitizedArticle.link = SanitizeText(sanitizedArticle.link);
  }
  if (typeof sanitizedArticle.pubDate === "string") {
    sanitizedArticle.pubDate = SanitizeText(sanitizedArticle.pubDate);
  }
  if (typeof sanitizedArticle.description === "string") {
    sanitizedArticle.description = SanitizeText(sanitizedArticle.description);
  }
  if (typeof sanitizedArticle.content === "string") {
    sanitizedArticle.content = SanitizeText(sanitizedArticle.content);
  }
  if (typeof sanitizedArticle.creator === "string") {
    sanitizedArticle.creator = SanitizeText(sanitizedArticle.creator);
  }

  return sanitizedArticle;
}
