import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";

export interface Task {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    status: "pending" | "completed";
    due_date: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface TaskRow extends RowDataPacket, Task {}

// Create task
export const createTask = async (
    userId: number,
    title: string,
    description: string,
    status: "pending" | "completed",
    dueDate: string | null
): Promise<number> => {
    const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO tasks
        (user_id, title, description, status, due_date)
        VALUES (?, ?, ?, ?, ?)`,
        [
            userId,
            title,
            description,
            status,
            dueDate,
        ]
    );

    return result.insertId;
};

// Get all tasks belonging to a user
export const getTasksByUserId = async (
    userId: number
): Promise<TaskRow[]> => {
    const [rows] = await db.execute<TaskRow[]>(
        `SELECT *
         FROM tasks
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
};

// Get one task belonging to a user
export const getTaskById = async (
    taskId: number,
    userId: number
): Promise<TaskRow | null> => {
    const [rows] = await db.execute<TaskRow[]>(
        `SELECT *
         FROM tasks
         WHERE id = ? AND user_id = ?
         LIMIT 1`,
        [taskId, userId]
    );

    return rows.length > 0 ? rows[0] : null;
};

// Update task
export const updateTask = async (
    taskId: number,
    userId: number,
    title: string,
    description: string,
    status: "pending" | "completed",
    dueDate: string | null
): Promise<boolean> => {
    const [result] = await db.execute<ResultSetHeader>(
        `UPDATE tasks
         SET title = ?,
             description = ?,
             status = ?,
             due_date = ?
         WHERE id = ? AND user_id = ?`,
        [
            title,
            description,
            status,
            dueDate,
            taskId,
            userId,
        ]
    );

    return result.affectedRows > 0;
};

// Delete task
export const deleteTask = async (
    taskId: number,
    userId: number
): Promise<boolean> => {
    const [result] = await db.execute<ResultSetHeader>(
        `DELETE FROM tasks
         WHERE id = ? AND user_id = ?`,
        [taskId, userId]
    );

    return result.affectedRows > 0;
};