import { db } from '../db';
import { sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
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
  const idBuffer = Buffer.from(id, 'hex');
  const [sessionRecord] = await db.select().from(sessions).where(eq(sessions.id, idBuffer as unknown as string)).limit(1);
  return sessionRecord || null;
}

export async function getSessionsByUserId(userId: string): Promise<Sessions[]> {
  return await db.select().from(sessions).where(eq(sessions.userId, userId));
}

export async function createSession(sessionData: Session): Promise<string> {
  const uuid = Buffer.from(randomUUID().replace(/-/g, ''), 'hex');
  const userId = Buffer.from(sessionData.userId.replace(/-/g, ''), 'hex');
  const data = { ...sessionData, id: uuid as unknown as string, userId: userId as unknown as string };
  await db.insert(sessions).values(data);
  return uuid.toString('hex');
}

export async function updateSession(id: string, updateData: Partial<Session>): Promise<number> {
  const [result] = await db.update(sessions).set(updateData).where(eq(sessions.id, id));
  return (result as any).affectedRows;
}

export async function deleteSession(id: string): Promise<number> {
  const idBuffer = Buffer.from(id, 'hex');
  const [result] = await db.delete(sessions).where(eq(sessions.id, idBuffer as unknown as string));
  return (result as any).affectedRows;
}
