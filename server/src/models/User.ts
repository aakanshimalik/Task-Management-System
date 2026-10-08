import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;
}

export interface UserRow extends RowDataPacket, User {}

export const findUserByEmail = async (
    email: string
): Promise<UserRow | null> => {
    const [rows] = await db.execute<UserRow[]>(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    return rows.length > 0 ? rows[0] : null;
};

export const findUserById = async (
    id: number
): Promise<UserRow | null> => {
    const [rows] = await db.execute<UserRow[]>(
        "SELECT * FROM users WHERE id = ? LIMIT 1",
        [id]
    );

    return rows.length > 0 ? rows[0] : null;
};

export const createUser = async (
    name: string,
    email: string,
    password: string
): Promise<number> => {
    const [result] = await db.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password]
    );

    return (result as { insertId: number }).insertId;
};