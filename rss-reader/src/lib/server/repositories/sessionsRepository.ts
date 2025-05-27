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
  const [sessionRecord] = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
  return sessionRecord || null;
}

export async function getSessionsByUserId(userId: string): Promise<Sessions[]> {
  return await db.select().from(sessions).where(eq(sessions.userId, userId));
}

export async function createSession(sessionData: Session): Promise<string> {
  const id = randomUUID().replace(/-/g, "");
  const data = { ...sessionData, id };
  await db.insert(sessions).values(data);
  return id;
}

export async function updateSession(id: string, updateData: Partial<Session>): Promise<number> {
  const [result] = await db.update(sessions).set(updateData).where(eq(sessions.id, id));
  return (result as any).affectedRows;
}

export async function deleteSession(id: string): Promise<number> {
  const [result] = await db.delete(sessions).where(eq(sessions.id, id));
  return (result as any).affectedRows;
}
