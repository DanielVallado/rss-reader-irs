import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
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
	const [userRecord] = await db.select().from(users).where(eq(users.id, id)).limit(1);
	return userRecord || null;
}

export async function getUserByEmail(email: string): Promise<Users | null> {
	const [userRecord] = await db.select().from(users).where(eq(users.email, email)).limit(1);
	return userRecord || null;
}

export async function createUser(newUser: User): Promise<string> {
	const id = randomUUID().replace(/-/g, "");
	const data = { ...newUser, id };
	await db.insert(users).values(data);
	return id;
}

export async function updateUser(id: string, updateData: Partial<User>): Promise<number> {
	const [result] = await db.update(users).set(updateData).where(eq(users.id, id));
	return (result as any).affectedRows;
}

export async function deleteUser(id: string): Promise<number> {
	const [result] = await db.delete(users).where(eq(users.id, id));
	return (result as any).affectedRows;
}
