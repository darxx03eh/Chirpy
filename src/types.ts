import { User } from "./lib/db/schema.js";
export type UserResponse = Omit<User, "hashedPassword">;
