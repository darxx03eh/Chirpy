process.loadEnvFile(".env");
import { NextFunction, Router, Request, Response } from "express";
import { getBearerToken, validateJWT } from "../../auth.js";
import { config } from "../../config.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { getUserById } from "../../lib/db/queries/users.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { createChirp, deleteChirp, getAllChirps, getChirpById } from "../../lib/db/queries/chirps.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
const chirpsRouter = Router();
chirpsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getBearerToken(req);
        const userId = validateJWT(token, config.api.jwtSecret);
        const PROFANE_WORDS = ["kerfuffle", "sharbert", "fornax"];
        const params = req.body;
        if(!params || typeof params.body !== "string")
            throw new BadRequestError("Invalid request body");
        if(params.body.length > 140)
            throw new BadRequestError("Chirp is too long. Max length is 140");
        const words = params.body.split(/\s+/);
        const cleanWords = words.map((word: string) => {
            if(PROFANE_WORDS.includes(word.toLowerCase()))
                return "****";
            return word;
        })
        const cleanChirp = cleanWords.join(" ");
        const user = await getUserById(userId);
        if(!user)
            throw new NotFoundError("User not found");
        const chirp = await createChirp({
            userId: userId,
            body: cleanChirp
        })
        if(!chirp)
            throw new Error("Failed to create chirp");
        return res.status(201).json(chirp);
    }catch(err) {
        next(err);
    }
});
chirpsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = req.query.authorId as string | undefined;
        const sort = req.query.sort as string | undefined;
        const chirps = await getAllChirps(authorId, sort);
        if(!chirps)
            throw new NotFoundError("No chirps found");
        return res.status(200).json(chirps);
    }catch(err) {
        next(err);
    }
});
chirpsRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chirpId = req.params.id as string;
        const chirp = await getChirpById(chirpId);
        if(!chirp)
            throw new NotFoundError(`Chirp with id: ${chirpId} not found`);
        return res.status(200).json(chirp);
    }catch(err) {
        next(err);
    }
});
chirpsRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getBearerToken(req);
        const userId = validateJWT(token, config.api.jwtSecret);
        const chirpId = req.params.id as string;
        const chirp = await getChirpById(chirpId);
        if(!chirp)
            throw new NotFoundError(`Chirp with id: ${chirpId} not found`);
        if(chirp.userId !== userId)
            throw new ForbiddenError("You are not allowed to delete this chirp");
        await deleteChirp(chirpId);
        return res.status(204).send();
    }catch(err) {
        next(err);
    }
});
export default chirpsRouter;