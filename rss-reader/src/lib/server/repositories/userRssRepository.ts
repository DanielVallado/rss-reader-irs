import { db } from '../db';
import { usersRss } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export async function getAllUsersRss(): Promise<typeof usersRss.$inferSelect[]> {
  return await db.select().from(usersRss);
}

export async function getUsersRssByUserId(userId: string): Promise<typeof usersRss.$inferSelect[]> {
  return await db.select().from(usersRss).where(eq(usersRss.userId, userId));
}

export async function getUsersRssByRssId(rssId: number): Promise<typeof usersRss.$inferSelect[]> {
  return await db.select().from(usersRss).where(eq(usersRss.rssId, rssId));
}

export async function createUserRssAssociation(userId: string, rssId: number): Promise<void> {
  await db.insert(usersRss).values({ userId, rssId });
}

export async function deleteUserRssAssociation(userId: string, rssId: number): Promise<number> {
  const result = await db.delete(usersRss)
    .where(and(eq(usersRss.userId, userId), eq(usersRss.rssId, rssId)));
  return (result as any).affectedRows;
}
