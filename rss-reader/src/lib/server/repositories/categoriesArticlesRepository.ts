import { db } from '../db';
import { categoriesArticles } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export async function getAllCategoriesArticles(): Promise<typeof categoriesArticles.$inferSelect[]> {
  return await db.select().from(categoriesArticles);
}

export async function getCategoriesArticlesByCategoryId(categoryId: number): Promise<typeof categoriesArticles.$inferSelect[]> {
  return await db.select().from(categoriesArticles).where(eq(categoriesArticles.categoryId, categoryId));
}

export async function getCategoriesArticlesByArticleId(articleId: number): Promise<typeof categoriesArticles.$inferSelect[]> {
  return await db.select().from(categoriesArticles).where(eq(categoriesArticles.articleId, articleId));
}

export async function createCategoryArticleAssociation(categoryId: number, articleId: number): Promise<void> {
  await db.insert(categoriesArticles).values({ categoryId, articleId });
}

export async function deleteCategoryArticleAssociation(categoryId: number, articleId: number): Promise<number> {
  const result = await db.delete(categoriesArticles)
    .where(and(eq(categoriesArticles.categoryId, categoryId), eq(categoriesArticles.articleId, articleId)));
  return (result as any).affectedRows;
}
