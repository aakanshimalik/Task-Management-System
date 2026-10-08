"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.generateRefreshToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateRefreshToken = () => {
    return crypto_1.default.randomBytes(64).toString("hex");
};
exports.generateRefreshToken = generateRefreshToken;
const generateAccessToken = (userId) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
