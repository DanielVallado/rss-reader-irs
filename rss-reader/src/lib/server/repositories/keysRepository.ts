import { db } from '../db';
import { keys } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import type { Keys } from '../db/schema';

export type Key = {
  userId: string;
  provider: string;
  providerId: string;
  password?: string;
};

export async function getAllKeys(): Promise<Keys[]> {
  return await db.select().from(keys);
}

export async function getKeyById(id: string): Promise<Keys | null> {
  const [keyRecord] = await db.select().from(keys).where(eq(keys.id, id)).limit(1);
  return keyRecord || null;
}

export async function getKeysByUserId(userId: string): Promise<Keys[]> {
  return await db.select().from(keys).where(eq(keys.userId, userId));
}

export async function createKey(keyData: Key): Promise<string> {
  const id = randomUUID().replace(/-/g, "");
  const data = { ...keyData, id };
  await db.insert(keys).values(data);
  return id;
}

export async function updateKey(id: string, keyData: Partial<Key>): Promise<number> {
  const [result] = await db.update(keys).set(keyData).where(eq(keys.id, id));
  return (result as any).affectedRows;
}

export async function deleteKey(id: string): Promise<number> {
  const [result] = await db.delete(keys).where(eq(keys.id, id));
  return (result as any).affectedRows;
}
