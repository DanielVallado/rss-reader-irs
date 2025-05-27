import { db } from '../db';
import { sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateUuidBuffer, uuidToBuffer } from '../utils/uuid';
import type { Sessions } from '../db/schema';

export type Session = {
  userId: string;
  ipAddress: string;
  deviceInfo: string;
  userAgent: string;
  expiresAt?: Date | null;
  revokedAt?: Date | null;
};

export async function getAllSessions(): Promise<Sessions[]> {
  return await db.select().from(sessions);
}

export async function getSessionById(id: string): Promise<Sessions | null> {
  const idBuffer = uuidToBuffer(id);
  const [sessionRecord] = await db.select().from(sessions).where(eq(sessions.id, idBuffer as unknown as string)).limit(1);
  return sessionRecord || null;
}

export async function getSessionsByUserId(userId: string): Promise<Sessions[]> {
  const userIdBuffer = uuidToBuffer(userId);
  return await db.select().from(sessions).where(eq(sessions.userId, userIdBuffer as unknown as string));
}

export async function createSession(sessionData: Session): Promise<string> {
  const uuid = generateUuidBuffer();
  const userId = uuidToBuffer(sessionData.userId);
  const data = { ...sessionData, id: uuid as unknown as string, userId: userId as unknown as string };
  await db.insert(sessions).values(data);
  return uuid.toString('hex');
}

export async function updateSession(id: string, updateData: Partial<Session>): Promise<number> {
  const idBuffer = uuidToBuffer(id);
  const [result] = await db.update(sessions).set(updateData).where(eq(sessions.id, idBuffer as unknown as string));
  return (result as any).affectedRows;
}

export async function deleteSession(id: string): Promise<number> {
  const idBuffer = uuidToBuffer(id);
  const [result] = await db.update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.id, idBuffer as unknown as string));
  return (result as any).affectedRows;
}
