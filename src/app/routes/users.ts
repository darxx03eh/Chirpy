process.loadEnvFile(".env");
import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/badRequestError.js";
import { getBearerToken, hashPassword, validateJWT } from "../../auth.js";
import { createUser, getUserById, updateUserPasswordAndEmail } from "../../lib/db/queries/users.js";
import { UserResponse } from "../../types.js";
import { config } from "../../config.js";
import { NotFoundError } from "../errors/notFoundError.js";
const usersRouter = Router();
usersRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params = req.body;
        if(!params || typeof params.email !== "string" || typeof params.password !== "string")
            throw new BadRequestError("Invalid request body");
        if(params.email.length > 256)
            throw new BadRequestError("Email is too long. Max length is 256");
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email))
            throw new BadRequestError("Invalid email format");
        const hashedPassword = await hashPassword(params.password);
        const user = await createUser({
            email: params.email,
            hashedPassword: hashedPassword
        });
        if(!user)
            throw new Error("Failed to create user");
        return res.status(201).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isChirpyRed: user.isChirpyRed
        } as UserResponse);
    }catch(err) {
        next(err);
    }
});
usersRouter.put("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getBearerToken(req);
        const userId = validateJWT(token, config.api.jwtSecret);
        const params = req.body;
        if(!params || typeof params.password !== "string" || typeof params.email !== "string")
            throw new BadRequestError("Invalid request body");
        if(params.email.length > 256)
            throw new BadRequestError("Email is too long. Max length is 256");
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email))
            throw new BadRequestError("Invalid email format");
        const user = await getUserById(userId);
        if(!user)
            throw new NotFoundError("User not found");
        const hashedPassword = await hashPassword(params.password);
        const updatedUser = await updateUserPasswordAndEmail({
            id: userId,
            email: params.email,
            hashedPassword: hashedPassword
        });
        if(!updatedUser)
            throw new Error("Failed to update user");
        return res.status(200).json({
            id: updatedUser.id,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
            isChirpyRed: updatedUser.isChirpyRed
        } as UserResponse);
    }catch(err) {
        next(err);
    }
});
export default usersRouter;