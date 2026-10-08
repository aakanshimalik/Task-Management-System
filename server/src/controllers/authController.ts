import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
    createUser,
    findUserByEmail,
} from "../models/User";
import {
    createRefreshToken,
    findRefreshToken,
} from "../models/RefreshToken";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../services/tokenService";
import jwt from "jsonwebtoken";

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
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
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            res.status(409).json({
                message: "User with this email already exists",
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = await createUser(
            name,
            email,
            hashedPassword
        );

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: userId,
                name,
                email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error during registration",
        });
    }
};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
            return;
        }

        const user = await findUserByEmail(email);

        if (!user) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }

        // Generate short-lived access token
        const accessToken = generateAccessToken(user.id);

        // Generate long-lived refresh token
        const refreshToken = generateRefreshToken();

        // Refresh token expires in 7 days
        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        // Store refresh token in database
        await createRefreshToken(
            user.id,
            refreshToken,
            expiresAt
        );

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
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login",
        });
    }
};

export const refreshAccessToken = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({
                message: "Refresh token is required",
            });
            return;
        }

        // Find refresh token in database
        const storedToken = await findRefreshToken(refreshToken);

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
        const accessToken = generateAccessToken(
            storedToken.user_id
        );

        res.status(200).json({
            accessToken,
        });
    } catch (error) {
        console.error("Refresh token error:", error);

        res.status(500).json({
            message: "Server error while refreshing token",
        });
    }
};