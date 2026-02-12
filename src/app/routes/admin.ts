process.loadEnvFile(".env");
import { Router, Request, Response, NextFunction } from "express";
import { config } from "../../config.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import { resetUsers } from "../../lib/db/queries/users.js";
const adminRouter = Router();
adminRouter.get("/metrics", (req: Request, res: Response) => {
    res.status(200);
    res.set("content-type", "text/html");
    res.send(
    `<html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
        </body>
    </html>`);
});
adminRouter.post("/reset", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(config.api.platform !== "dev") 
            throw new ForbiddenError("This endpoint is only available in dev environment");
        await resetUsers();
        res.status(200).send({
            message: "Database reset successful"
        });
    }catch(err) {
        next(err);
    }
});
export default adminRouter;