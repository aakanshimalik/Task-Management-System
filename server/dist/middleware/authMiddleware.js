"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Invalid or expired access token",
        });
    }
};
exports.authenticate = authenticate;
