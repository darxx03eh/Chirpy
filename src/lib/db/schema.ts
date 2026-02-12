import { pgTable, timestamp, varchar, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
    .$onUpdate(() => new Date()),
    email: varchar("email", {
        length: 256
    }).unique().notNull(),
    hashedPassword: varchar("hashed_password", {
        length: 256
    }).notNull().default("unset"),
    isChirpyRed: boolean("is_chirpy_red").default(false).notNull()
});

export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
    .$onUpdate(() => new Date()),
    body: varchar("body", {
        length: 140
    }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull()
});

export const refreshTokens = pgTable("refresh_tokens", {
    token: varchar("token", {
        length: 512
    }).primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
    .$onUpdate(() => new Date()),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at")
});

export type Chirp = typeof chirps.$inferInsert;
export type User =  typeof users.$inferInsert;
export type RefreshToken = typeof refreshTokens.$inferInsert;