import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { RefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(refreshToken: RefreshToken) {
    const [result] = await db.insert(refreshTokens)
    .values(refreshToken).onConflictDoNothing().returning();
    return result;
}

export async function getRefreshToken(refreshToken: string) {
    const [result] = await db.select()
    .from(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    return result;
}

export async function revokeRefreshToken(refreshToken: string) {
    const [result] = await db.update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, refreshToken)).returning();
    return result;
}