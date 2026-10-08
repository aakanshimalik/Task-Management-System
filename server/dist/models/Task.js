"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasksByUserId = exports.createTask = void 0;
const db_1 = require("../config/db");
// Create task
const createTask = async (userId, title, description, status, dueDate) => {
    const [result] = await db_1.db.execute(`INSERT INTO tasks
        (user_id, title, description, status, due_date)
        VALUES (?, ?, ?, ?, ?)`, [
        userId,
        title,
        description,
        status,
        dueDate,
    ]);
    return result.insertId;
};
exports.createTask = createTask;
// Get all tasks belonging to a user
const getTasksByUserId = async (userId) => {
    const [rows] = await db_1.db.execute(`SELECT *
         FROM tasks
         WHERE user_id = ?
         ORDER BY created_at DESC`, [userId]);
    return rows;
};
exports.getTasksByUserId = getTasksByUserId;
// Get one task belonging to a user
const getTaskById = async (taskId, userId) => {
    const [rows] = await db_1.db.execute(`SELECT *
         FROM tasks
         WHERE id = ? AND user_id = ?
         LIMIT 1`, [taskId, userId]);
    return rows.length > 0 ? rows[0] : null;
};
exports.getTaskById = getTaskById;
// Update task
const updateTask = async (taskId, userId, title, description, status, dueDate) => {
    const [result] = await db_1.db.execute(`UPDATE tasks
         SET title = ?,
             description = ?,
             status = ?,
             due_date = ?
         WHERE id = ? AND user_id = ?`, [
        title,
        description,
        status,
        dueDate,
        taskId,
        userId,
    ]);
    return result.affectedRows > 0;
};
exports.updateTask = updateTask;
// Delete task
const deleteTask = async (taskId, userId) => {
    const [result] = await db_1.db.execute(`DELETE FROM tasks
         WHERE id = ? AND user_id = ?`, [taskId, userId]);
    return result.affectedRows > 0;
};
exports.deleteTask = deleteTask;
