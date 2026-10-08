import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: number;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                message: "Authorization token is required",
            });
            return;
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            res.status(401).json({
                message: "Invalid authorization format",
            });
            return;
        }

        const secret = process.env.JWT_ACCESS_SECRET;

        if (!secret) {
            res.status(500).json({
                message: "JWT secret is not configured",
            });
            return;
        }

        const decoded = jwt.verify(token, secret) as {
            userId: number;
        };

        req.userId = decoded.userId;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired access token",
        });
    }
};