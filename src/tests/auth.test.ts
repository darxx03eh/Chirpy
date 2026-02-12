import { describe, it, expect } from "vitest";
import { getBearerToken, makeJWT, validateJWT } from "../auth";
import { get } from "node:http";

describe("JWT Authentication", () => {
    const secret = "supersecret";
    const wrongSecret = "wrongsecret";
    const userId = "user-123";

    it("should create and validate a JWT", () => {
        const token = makeJWT(userId, 60, secret);
        const result = validateJWT(token, secret);

        expect(result).toBe(userId);
    });

    it("should reject an expired token", async () => {
        const token = makeJWT(userId, -10, secret);
        expect(() => validateJWT(token, secret)).toThrow();
    });

    it("should reject a token signed with the wrong secret", () => {
        const token = makeJWT(userId, 60, secret);
        expect(() => validateJWT(token, wrongSecret)).toThrow();
    });
});

describe("getBearerToken", () => {
    it("should extract token from head", () => {
        const req = {
            get: (header: string) => 
                header === "Authorization" ? "Bearer mytoken" : undefined
        } as any;
        const token = getBearerToken(req);
        expect(token).toBe("mytoken");
    });

    it("shoud throw if head missing", () => {
        const req = {
            get: (header: string) => undefined
        } as any;
        expect(() => getBearerToken(req)).toThrow();
        });
});