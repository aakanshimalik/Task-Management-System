import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex");
};

export const generateAccessToken = (userId: number): string => {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    return jwt.sign(
        { userId },
        secret,
        { expiresIn: "15m" }
    );
};