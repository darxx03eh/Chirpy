import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { User, users } from "../schema.js";

export async function createUser(user: User) {
    const [result] = await db.insert(users)
    .values(user).onConflictDoNothing().returning();

    return result;
}

export async function resetUsers() {
    await db.delete(users);
}

export async function getUserById(id: string) {
    const [result] = await db.select()
    .from(users).where(eq(users.id, id));
    return result;
}

export async function getUserByEmail(email: string) {
    const [result] = await db.select()
    .from(users).where(eq(users.email, email));
    return result;
}

export async function updateUserPasswordAndEmail(user: User) {
    const [result] = await db.update(users)
    .set({ hashedPassword: user.hashedPassword, email: user.email })
    .where(eq(users.id, user.id!)).returning();
    return result;
}

export async function upgradeUserToChirpyRed(id: string) {
    const [result] = await db.update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, id)).returning();
    return result;
}