import { db } from '../db';
import { usersRss } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { uuidToBuffer } from '../utils/uuid';

export async function getAllUsersRss(): Promise<typeof usersRss.$inferSelect[]> {
  return await db.select().from(usersRss);
}

export async function getUsersRssByUserId(userId: string): Promise<typeof usersRss.$inferSelect[]> {
  const userIdBuffer = uuidToBuffer(userId);
  return await db.select().from(usersRss).where(eq(usersRss.userId, userIdBuffer as unknown as string));
}

export async function getUsersRssByRssId(rssId: number): Promise<typeof usersRss.$inferSelect[]> {
  return await db.select().from(usersRss).where(eq(usersRss.rssId, rssId));
}

export async function createUserRssAssociation(userId: string, rssId: number): Promise<void> {
  const userIdBuffer = uuidToBuffer(userId);
  await db.insert(usersRss).values({ userId: userIdBuffer as unknown as string, rssId });
}

export async function deleteUserRssAssociation(userId: string, rssId: number): Promise<number> {
  const userIdBuffer = uuidToBuffer(userId);
  const [result] = await db.delete(usersRss)
    .where(and(eq(usersRss.userId, userIdBuffer as unknown as string), eq(usersRss.rssId, rssId)));
  return (result as any).affectedRows;
}
