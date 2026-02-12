import { asc, eq, desc } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, chirps } from "../schema.js";

export async function createChirp(chirp: Chirp) {
    const [result] = await db.insert(chirps)
    .values(chirp).onConflictDoNothing().returning();
    return result;
}

export async function getAllChirps(authorId?: string, sort?: string) {
    let query = db.select().from(chirps);
    if(authorId) query = query.where(eq(chirps.userId, authorId)) as typeof query;
    if(sort === "desc") query = query.orderBy(desc(chirps.createdAt)) as typeof query;
    else query = query.orderBy(asc(chirps.createdAt)) as typeof query;
    const results = await query;
    return results;
}

export async function getChirpById(id: string) {
    const [result] = await db.select()
    .from(chirps).where(eq(chirps.id, id));
    return result;
}

export async function deleteChirp(id: string) {
    await db.delete(chirps).where(eq(chirps.id, id));
}