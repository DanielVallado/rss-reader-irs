import * as repository from "$lib/server/repositories";
import { extractImageUrl } from "$lib";
import { sortArticles } from "$lib/core";
import { parseRss } from "$lib/server/services";
import sanitizeHtml from "sanitize-html";
import * as interactionsRepository from "$lib/server/repositories/interactionsRepository";

import type { Article, Category } from "$lib/server/repositories";


export type ArticleWithCategories = Article & { categories: string[] };

export async function getAllArticles(): Promise<ArticleWithCategories[]> {
  const [articles, categoryArticleRelations, categories] = await Promise.all([
    repository.getAllArticles(),
    repository.getAllCategoriesArticles(),
    repository.getAllCategories(),
  ]);

  const categoryNameById = new Map<number, string>(categories.map(
      (category) => [category.id!, category.name] as [number, string]
    )
  );

  const categoryNamesByArticleId = categoryArticleRelations.reduce(
    (acc, relation) => {
      const { articleId, categoryId } = relation;
      const name = categoryNameById.get(categoryId);
      if (!acc[articleId]) acc[articleId] = [];
      if (name) acc[articleId].push(name);
      return acc;
    },
    {} as Record<number, string[]>
  );

  const enrichedArticles: ArticleWithCategories[] = articles.map(article => ({
    ...article,
    categories: categoryNamesByArticleId[article.id] || []
  }));

  const sortedEnrichedArticles = sortArticles(enrichedArticles, "date");

  return sortedEnrichedArticles;
}

export async function createArticle(allRss: any): Promise<void> {
  for (const rss of allRss) {
    const feed = await parseRss(rss.url);

    if (feed) {
      for (const item of feed.items) {
        const cleanItem = sanitizeArticle(item);

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

export async function countArticles(): Promise<number> {
  return await repository.countArticles();
}

export function sanitizeArticle(article: any): any {
  const sanitizedArticle = { ...article };

  if (typeof sanitizedArticle.title === "string") {
    sanitizedArticle.title = sanitizeText(sanitizedArticle.title);
  }
  if (typeof sanitizedArticle.link === "string") {
    sanitizedArticle.link = sanitizeText(sanitizedArticle.link);
  }
  if (typeof sanitizedArticle.pubDate === "string") {
    sanitizedArticle.pubDate = sanitizeText(sanitizedArticle.pubDate);
  }
  if (typeof sanitizedArticle.description === "string") {
    sanitizedArticle.description = sanitizeText(sanitizedArticle.description);
  }
  if (typeof sanitizedArticle.content === "string") {
    sanitizedArticle.content = sanitizeText(sanitizedArticle.content);
  }
  if (typeof sanitizedArticle.creator === "string") {
    sanitizedArticle.creator = sanitizeText(sanitizedArticle.creator);
  }

  return sanitizedArticle;
}

function sanitizeText(text: string): string {
  let sanitized = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  sanitized = sanitized.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "");
  return sanitized.replace(/\s+/g, " ").trim();
}

export async function registerArticleClick(userId: string, articleId: number): Promise<number> {
  return await interactionsRepository.createInteraction({ usersId: userId, articlesId: articleId });
}
