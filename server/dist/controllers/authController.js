"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const RefreshToken_1 = require("../models/RefreshToken");
const tokenService_1 = require("../services/tokenService");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            res.status(400).json({
                message: "Name, email and password are required",
            });
            return;
        }
        // Check if user already exists
        const existingUser = await (0, User_1.findUserByEmail)(email);
        if (existingUser) {
            res.status(409).json({
                message: "User with this email already exists",
            });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const userId = await (0, User_1.createUser)(name, email, hashedPassword);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: userId,
                name,
                email,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Server error during registration",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
            return;
        }
        const user = await (0, User_1.findUserByEmail)(email);
        if (!user) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }
        // Generate short-lived access token
        const accessToken = (0, tokenService_1.generateAccessToken)(user.id);
        // Generate long-lived refresh token
        const refreshToken = (0, tokenService_1.generateRefreshToken)();
        // Refresh token expires in 7 days
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        // Store refresh token in database
        await (0, RefreshToken_1.createRefreshToken)(user.id, refreshToken, expiresAt);
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error during login",
        });
    }
};
exports.login = login;
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                message: "Refresh token is required",
            });
            return;
        }
        // Find refresh token in database
        const storedToken = await (0, RefreshToken_1.findRefreshToken)(refreshToken);
        if (!storedToken) {
            res.status(401).json({
                message: "Invalid refresh token",
            });
            return;
        }
        // Check expiration
        if (new Date(storedToken.expires_at) < new Date()) {
            res.status(401).json({
                message: "Refresh token has expired",
            });
            return;
        }
        // Generate a new access token
        const accessToken = (0, tokenService_1.generateAccessToken)(storedToken.user_id);
        res.status(200).json({
            accessToken,
        });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({
            message: "Server error while refreshing token",
        });
    }
};
exports.refreshAccessToken = refreshAccessToken;
