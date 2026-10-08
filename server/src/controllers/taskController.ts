import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
    createTask,
    getTasksByUserId,
    getTaskById,
    updateTask,
    deleteTask,
} from "../models/Task";

// CREATE TASK
export const addTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        const {
            title,
            description,
            status,
            dueDate,
        } = req.body;

        if (!title || title.trim() === "") {
            res.status(400).json({
                message: "Task title is required",
            });
            return;
        }

        const taskStatus =
            status === "completed"
                ? "completed"
                : "pending";

        const taskId = await createTask(
            userId,
            title.trim(),
            description?.trim() || "",
            taskStatus,
            dueDate || null
        );

        res.status(201).json({
            message: "Task created successfully",
            task: {
                id: taskId,
                title: title.trim(),
                description: description?.trim() || "",
                status: taskStatus,
                dueDate: dueDate || null,
            },
        });
    } catch (error) {
        console.error("Create task error:", error);

        res.status(500).json({
            message: "Server error while creating task",
        });
    }
};

// GET ALL TASKS
export const getTasks = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        const tasks = await getTasksByUserId(userId);

        res.status(200).json({
            tasks,
        });
    } catch (error) {
        console.error("Get tasks error:", error);

        res.status(500).json({
            message: "Server error while fetching tasks",
        });
    }
};

// GET SINGLE TASK
export const getTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        const taskId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        if (Number.isNaN(taskId)) {
            res.status(400).json({
                message: "Invalid task ID",
            });
            return;
        }

        const task = await getTaskById(
            taskId,
            userId
        );

        if (!task) {
            res.status(404).json({
                message: "Task not found",
            });
            return;
        }

        res.status(200).json({
            task,
        });
    } catch (error) {
        console.error("Get task error:", error);

        res.status(500).json({
            message: "Server error while fetching task",
        });
    }
};

// UPDATE TASK
export const editTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        const taskId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        if (Number.isNaN(taskId)) {
            res.status(400).json({
                message: "Invalid task ID",
            });
            return;
        }

        const {
            title,
            description,
            status,
            dueDate,
        } = req.body;

        if (!title || title.trim() === "") {
            res.status(400).json({
                message: "Task title is required",
            });
            return;
        }

        if (
            status !== "pending" &&
            status !== "completed"
        ) {
            res.status(400).json({
                message: "Invalid task status",
            });
            return;
        }

        const updated = await updateTask(
            taskId,
            userId,
            title.trim(),
            description?.trim() || "",
            status,
            dueDate || null
        );

        if (!updated) {
            res.status(404).json({
                message: "Task not found",
            });
            return;
        }

        res.status(200).json({
            message: "Task updated successfully",
        });
    } catch (error) {
        console.error("Update task error:", error);

        res.status(500).json({
            message: "Server error while updating task",
        });
    }
};

// DELETE TASK
export const removeTask = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        const taskId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        if (Number.isNaN(taskId)) {
            res.status(400).json({
                message: "Invalid task ID",
            });
            return;
        }

        const deleted = await deleteTask(
            taskId,
            userId
        );

        if (!deleted) {
            res.status(404).json({
                message: "Task not found",
            });
            return;
        }

        res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Delete task error:", error);

        res.status(500).json({
            message: "Server error while deleting task",
        });
    }
};