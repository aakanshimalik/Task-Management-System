"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRefreshToken = exports.findRefreshToken = exports.createRefreshToken = void 0;
const db_1 = require("../config/db");
const createRefreshToken = async (userId, token, expiresAt) => {
    const [result] = await db_1.db.execute(`INSERT INTO refresh_tokens
        (user_id, token, expires_at)
        VALUES (?, ?, ?)`, [userId, token, expiresAt]);
    return result.insertId;
};
exports.createRefreshToken = createRefreshToken;
const findRefreshToken = async (token) => {
    const [rows] = await db_1.db.execute(`SELECT *
         FROM refresh_tokens
         WHERE token = ?
         LIMIT 1`, [token]);
    return rows.length > 0 ? rows[0] : null;
};
exports.findRefreshToken = findRefreshToken;
const deleteRefreshToken = async (token) => {
    await db_1.db.execute(`DELETE FROM refresh_tokens
         WHERE token = ?`, [token]);
};
exports.deleteRefreshToken = deleteRefreshToken;
