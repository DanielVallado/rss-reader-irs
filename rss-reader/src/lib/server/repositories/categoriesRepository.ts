import { db } from '../db';
import { categories } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Categories } from '../db/schema';

export type NewCategory = {
  name: string;
};

export async function getAllCategories(): Promise<Categories[]> {
  return await db.select().from(categories);
}

export async function getCategoryById(id: number): Promise<Categories | null> {
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return category || null;
}

export async function createCategory(categoryData: NewCategory): Promise<number> {
  const result = await db.insert(categories).values(categoryData);
  return (result as any).insertId;
}

export async function updateCategory(id: number, categoryData: Partial<NewCategory>): Promise<number> {
  const result = await db.update(categories).set(categoryData).where(eq(categories.id, id));
  return (result as any).affectedRows;
}

export async function deleteCategory(id: number): Promise<number> {
  const result = await db.delete(categories).where(eq(categories.id, id));
  return (result as any).affectedRows;
}
