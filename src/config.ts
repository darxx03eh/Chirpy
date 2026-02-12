import { MigrationConfig } from "drizzle-orm/migrator";
import path from "path";
process.loadEnvFile(".env");
export type APIConfig = {
    fileserverHits: number;
    platform: string;
    jwtSecret: string;
    polkaKey: string;
};
export const migrationConfig: MigrationConfig = {
    migrationsFolder: path.join(process.cwd(), "src/lib/db/migrations")
};
export type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

export const config: { api: APIConfig; db: DBConfig } = {
    api: {
        fileserverHits: 0,
        platform: process.env.PLATFORM || "",
        jwtSecret: process.env.JWT_SECRET || "",
        polkaKey: process.env.POLKA_KEY || ""
    },
    db: {
        url: process.env.DB_URL || "",
        migrationConfig: migrationConfig
    }
};

