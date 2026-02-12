import * as argon2 from "argon2";
import jwt, { Jwt, JwtPayload} from "jsonwebtoken";
import { Request } from "express";
import { UnauthorizedError } from "./app/errors/unauthorizedError.js";
import crypto from "crypto";

export type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">
export function makeJWT(
    userId: string,
    expiresIn: number,
    secret: string
): string {
    const iat = Math.floor(Date.now() / 1000);
    const payload: Payload = {
        iss: "chirpy",
        sub: userId,
        iat: iat,
        exp: iat + expiresIn
    };
    return jwt.sign(payload, secret);
}

export function validateJWT(token: string, secret: string): string {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        if(!decoded.sub || typeof decoded.sub !== "string")
            throw new UnauthorizedError("Invalid token payload");
        return decoded.sub;
    }catch(err) {
        throw new UnauthorizedError("Invalid or expired token");
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if(!authHeader)
        throw new UnauthorizedError("Missing Authorization header");

    const [scheme, token] = authHeader.split(" ");
    if(scheme !== "Bearer" || !token)
        throw new UnauthorizedError("Invalid Authorization header format. Expected 'Bearer <token>'");

    return token.trim();
}

export function getAPIKey(req: Request): string {
    const authHeader = req.get("Authorization");
    if(!authHeader)
        throw new UnauthorizedError("Missing Authorization header");
    const [scheme, key] = authHeader.split(" ");
    if(scheme !== "ApiKey" || !key)
        throw new UnauthorizedError("Invalid Authorization header format. Expected 'ApiKey <key>'");
    
    return key.trim();
}

export function makeRefreshToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
}

export async function checkPasswordHash(
    password: string,
    hash: string
): Promise<boolean> {
    return await argon2.verify(hash, password);
}