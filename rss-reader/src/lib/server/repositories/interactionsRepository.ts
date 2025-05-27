import { db } from '../db';
import { interactions } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { uuidToBuffer } from '../utils/uuid';
import type { Interactions } from "../db/schema";


export type Interaction = {
    id?: number;
    usersId: string;
    articlesId: number;
    clickedAt?: string;
};

export async function getAllInteractions(): Promise<Interactions[]> {
    return await db.select().from(interactions);
}

export async function getInteractionById(id: number): Promise<Interactions | null> {
    const [interaction] = await db.select().from(interactions).where(eq(interactions.id, id)).limit(1);
    return interaction || null;
}

export async function getInteractionsByUser(userId: string): Promise<Interactions[]> {
    return await db.select().from(interactions).where(eq(interactions.usersId, userId));
}

export async function getInteractionsByArticle(articleId: number): Promise<Interactions[]> {
    return await db.select().from(interactions).where(eq(interactions.articlesId, articleId));
}

export async function getInteractionByUserAndArticle(userId: string, articleId: number): Promise<Interactions | null> {
    const [interaction] = await db
        .select()
        .from(interactions)
        .where(and(
            eq(interactions.usersId, userId),
            eq(interactions.articlesId, articleId)
        ))
        .limit(1);
    return interaction || null;
}

export async function createInteraction(interactionData: Interaction): Promise<number> {
    const data = {
        ...interactionData,
        usersId: uuidToBuffer(interactionData.usersId) as unknown as string
    };
    const [result] = await db.insert(interactions).values(data);
    return (result as any).insertId;
}

export async function deleteInteraction(id: number): Promise<number> {
    const [result] = await db.delete(interactions).where(eq(interactions.id, id));
    return (result as any).affectedRows;
} 