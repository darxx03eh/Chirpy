import { Middleware } from "./types"
import { config } from "../../config.js";
export const middlewareMetricsInc: Middleware = (req, res, next) => {
    res.on("finish", () => {
        config.api.fileserverHits++;
    });
    next();
};