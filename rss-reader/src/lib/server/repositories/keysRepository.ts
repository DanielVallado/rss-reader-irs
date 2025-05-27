import { db } from '../db';
import { keys } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateUuidBuffer, uuidToBuffer } from '../utils/uuidConversion';
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
  const idBuffer = uuidToBuffer(id);
  const [keyRecord] = await db.select().from(keys).where(eq(keys.id, idBuffer as unknown as string)).limit(1);
  return keyRecord || null;
}

export async function getKeysByUserId(userId: string): Promise<Keys[]> {
  const userIdBuffer = uuidToBuffer(userId);
  return await db.select().from(keys).where(eq(keys.userId, userIdBuffer as unknown as string));
}

export async function createKey(keyData: Key): Promise<string> {
  const uuid = generateUuidBuffer();
  const userId = uuidToBuffer(keyData.userId);
  const data = { ...keyData, id: uuid as unknown as string, userId: userId as unknown as string };
  await db.insert(keys).values(data);
  return uuid.toString('hex');
}

export async function updateKey(id: string, keyData: Partial<Key>): Promise<number> {
  const idBuffer = uuidToBuffer(id);
  const [result] = await db.update(keys).set(keyData).where(eq(keys.id, idBuffer as unknown as string));
  return (result as any).affectedRows;
}

export async function deleteKey(id: string): Promise<number> {
  const idBuffer = uuidToBuffer(id);
  const [result] = await db.delete(keys).where(eq(keys.id, idBuffer as unknown as string));
  return (result as any).affectedRows;
}
