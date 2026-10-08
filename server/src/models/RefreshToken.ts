import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";

export interface RefreshTokenRow extends RowDataPacket {
    id: number;
    user_id: number;
    token: string;
    expires_at: Date;
    created_at: Date;
}

export const createRefreshToken = async (
    userId: number,
    token: string,
    expiresAt: Date
): Promise<number> => {
    const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO refresh_tokens
        (user_id, token, expires_at)
        VALUES (?, ?, ?)`,
        [userId, token, expiresAt]
    );

    return result.insertId;
};

export const findRefreshToken = async (
    token: string
): Promise<RefreshTokenRow | null> => {
    const [rows] = await db.execute<RefreshTokenRow[]>(
        `SELECT *
         FROM refresh_tokens
         WHERE token = ?
         LIMIT 1`,
        [token]
    );

    return rows.length > 0 ? rows[0] : null;
};

export const deleteRefreshToken = async (
    token: string
): Promise<void> => {
    await db.execute(
        `DELETE FROM refresh_tokens
         WHERE token = ?`,
        [token]
    );
};