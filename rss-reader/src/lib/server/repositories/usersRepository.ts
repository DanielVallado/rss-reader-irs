import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateUuidBuffer, uuidToBuffer } from '../utils/uuid';
import type { Users } from '../db/schema';

export type User = {
	username: string;
	email: string;
	imageUrl?: string;
};

export async function getAllUsers(): Promise<Users[]> {
	return await db.select().from(users);
}

export async function getUserById(id: string): Promise<Users | null> {
	const idBuffer = uuidToBuffer(id);
	const [userRecord] = await db.select().from(users).where(eq(users.id, idBuffer as unknown as string)).limit(1);
	return userRecord || null;
}

export async function getUserByEmail(email: string): Promise<Users | null> {
	const [userRecord] = await db.select().from(users).where(eq(users.email, email)).limit(1);
	return userRecord || null;
}

export async function createUser(newUser: User & { id?: string }): Promise<string> {
	const uuid = newUser.id ? uuidToBuffer(newUser.id) : generateUuidBuffer();
	const data = { ...newUser, id: uuid as unknown as string };
	await db.insert(users).values(data);
	return uuid.toString('hex');
}

export async function updateUser(id: string, updateData: Partial<User>): Promise<number> {
	const idBuffer = uuidToBuffer(id);
	const [result] = await db.update(users).set(updateData).where(eq(users.id, idBuffer as unknown as string));
	return (result as any).affectedRows;
}

export async function deleteUser(id: string): Promise<number> {
	const idBuffer = uuidToBuffer(id);
	const [result] = await db.delete(users).where(eq(users.id, idBuffer as unknown as string));
	return (result as any).affectedRows;
}
