process.loadEnvFile(".env");
import express from "express";
import { middlewareLogResponses } from "./app/middlewares/middlewareLogResponses.js";
import { middlewareMetricsInc } from "./app/middlewares/middlewareMetricsInc.js";
import { config } from "./config.js";
import { errorHandlerMiddleware } from "./app/middlewares/errorHandlerMiddleware.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import chirpsRouter from "./app/routes/chirps.js";
import usersRouter from "./app/routes/users.js";
import authRouter from "./app/routes/auth.js";
import adminRouter from "./app/routes/admin.js";
const migrationClient = postgres(config.db.url, {
    max: 1
});
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
const PORT = 8080;
const API_PREFIX = '/api';
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses)
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(`${API_PREFIX}/chirps`, chirpsRouter);
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}`, authRouter);
app.use("/admin", adminRouter);
app.use(errorHandlerMiddleware);