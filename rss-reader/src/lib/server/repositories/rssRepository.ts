import { db } from "../db";
import { rss } from "../db/schema";
import { eq } from "drizzle-orm";
import type { Rss } from "../db/schema";

export type NewRss = {
  url: string;
};

export async function getAllRss(): Promise<Rss[]> {
  return await db.select().from(rss);
}

export async function getRssById(id: number): Promise<Rss | null> {
  const [rssRecord] = await db
    .select()
    .from(rss)
    .where(eq(rss.id, id))
    .limit(1);
  return rssRecord || null;
}

export async function getRssByUrl(url: string): Promise<Rss | null> {
  const [rssRecord] = await db
    .select()
    .from(rss)
    .where(eq(rss.url, url))
    .limit(1);
  return rssRecord || null;
}

export async function createRss(newRss: NewRss): Promise<number> {
  const result = await db.insert(rss).values(newRss);
  return (result[0] as any).insertId;
}

export async function updateRss(
  id: number,
  updateData: Partial<NewRss>
): Promise<number> {
  const result = await db.update(rss).set(updateData).where(eq(rss.id, id));
  return (result[0] as any).affectedRows;
}

export async function deleteRss(id: number): Promise<number> {
  const result = await db.delete(rss).where(eq(rss.id, id));
  return (result[0] as any).affectedRows;
}
