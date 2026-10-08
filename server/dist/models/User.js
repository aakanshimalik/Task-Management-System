"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserById = exports.findUserByEmail = void 0;
const db_1 = require("../config/db");
const findUserByEmail = async (email) => {
    const [rows] = await db_1.db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return rows.length > 0 ? rows[0] : null;
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    const [rows] = await db_1.db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
    return rows.length > 0 ? rows[0] : null;
};
exports.findUserById = findUserById;
const createUser = async (name, email, password) => {
    const [result] = await db_1.db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
    return result.insertId;
};
exports.createUser = createUser;
