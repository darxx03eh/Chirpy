process.loadEnvFile(".env");
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/badRequestError.js";
import { getUserByEmail, getUserById, upgradeUserToChirpyRed } from "../../lib/db/queries/users.js";
import { checkPasswordHash, getAPIKey, getBearerToken, makeJWT, makeRefreshToken } from "../../auth.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { config } from "../../config.js";
import { createRefreshToken, getRefreshToken, revokeRefreshToken } from "../../lib/db/queries/refreshTokens.js";
import { UserResponse } from "../../types.js";
import { NotFoundError } from "../errors/notFoundError.js";
const authRouter = Router();
authRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params = req.body;
        if(!params || typeof params.email !== "string" || 
            typeof params.password !== "string"
        )
            throw new BadRequestError("Invalid request body");
        if(params.email.length > 256)
            throw new BadRequestError("Email is too long. Max length is 256");
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email))
            throw new BadRequestError("Invalid email format");
        const user = await getUserByEmail(params.email);
        const check = !user ? false: await checkPasswordHash(params.password, user.hashedPassword);
        if(!user || !check)
            throw new UnauthorizedError("Invalid email or password");
        const maxExpiration = 60 * 60;
        let expiresIn = maxExpiration;
        if(typeof params.expiresInSeconds === "number") 
            expiresIn = Math.min(params.expiresInSeconds, maxExpiration);
        const token = makeJWT(user.id, expiresIn, config.api.jwtSecret);
        const refreshToken = makeRefreshToken();
        const now = new Date();
        const expiresAt = new Date(
            now.getTime() + 60 * 24 * 60 * 60 * 1000
        ); // 60 days
        await createRefreshToken({
            token: refreshToken,
            userId: user.id,
            expiresAt: expiresAt
        });
        return res.status(200).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isChirpyRed: user.isChirpyRed,
            token: token,
            refreshToken: refreshToken
        } as UserResponse);
    }catch(err) {
        next(err);
    }
});
authRouter.post("/polka/webhooks", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = getAPIKey(req);
        if(apiKey !== config.api.polkaKey || !apiKey)
            throw new UnauthorizedError("Invalid API key");
        const event = req.body;
        if(!event || typeof event.event != "string" 
            || typeof event.data != "object" 
            || typeof event.data.userId !== "string" 
            || !event.data)
            throw new BadRequestError("Invalid event format");
        if(event.event !== "user.upgraded")
            return res.status(204).send();
        const user = await getUserById(event.data.userId);
        if(!user)
            throw new NotFoundError("User not found");
        const upgradedUser = await upgradeUserToChirpyRed(event.data.userId);
        if(!upgradedUser)
            throw new Error("Failed to upgrade user");
        return res.status(204).send();
    }catch(err) {
        next(err);
    }
});
authRouter.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const refreshToken = getBearerToken(req);
        const token = await getRefreshToken(refreshToken);
        if(!token)
            throw new UnauthorizedError("Invalid refresh token");
        if(token.revokedAt)
            throw new UnauthorizedError("Refresh token has been revoked");
        if(new Date(token.expiresAt) < new Date())
            throw new UnauthorizedError("Refresh token has expired");
        const accessToken = makeJWT(
            token.userId,
            60 * 60,
            config.api.jwtSecret
        );
        return res.status(200).json({
            token: accessToken
        });
    }catch(err) {
        next(err);
    }
});
authRouter.post("/revoke", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const refreshToken = getBearerToken(req);
        const token = await getRefreshToken(refreshToken);
        if(!token)
            throw new UnauthorizedError("Invalid refresh token");
        await revokeRefreshToken(refreshToken);
        return res.status(204).send();
    }catch(err) {
        next(err);
    }
});
export default authRouter;