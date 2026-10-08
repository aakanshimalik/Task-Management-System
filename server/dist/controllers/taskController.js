"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTask = exports.editTask = exports.getTask = exports.getTasks = exports.addTask = void 0;
const Task_1 = require("../models/Task");
// CREATE TASK
const addTask = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }
        const { title, description, status, dueDate, } = req.body;
        if (!title || title.trim() === "") {
            res.status(400).json({
                message: "Task title is required",
            });
            return;
        }
        const taskStatus = status === "completed"
            ? "completed"
            : "pending";
        const taskId = await (0, Task_1.createTask)(userId, title.trim(), description?.trim() || "", taskStatus, dueDate || null);
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
    }
    catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({
            message: "Server error while creating task",
        });
    }
};
exports.addTask = addTask;
// GET ALL TASKS
const getTasks = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }
        const tasks = await (0, Task_1.getTasksByUserId)(userId);
        res.status(200).json({
            tasks,
        });
    }
    catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({
            message: "Server error while fetching tasks",
        });
    }
};
exports.getTasks = getTasks;
// GET SINGLE TASK
const getTask = async (req, res) => {
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
        const task = await (0, Task_1.getTaskById)(taskId, userId);
        if (!task) {
            res.status(404).json({
                message: "Task not found",
            });
            return;
        }
        res.status(200).json({
            task,
        });
    }
    catch (error) {
        console.error("Get task error:", error);
        res.status(500).json({
            message: "Server error while fetching task",
        });
    }
};
exports.getTask = getTask;
// UPDATE TASK
const editTask = async (req, res) => {
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
        const { title, description, status, dueDate, } = req.body;
        if (!title || title.trim() === "") {
            res.status(400).json({
                message: "Task title is required",
            });
            return;
        }
        if (status !== "pending" &&
            status !== "completed") {
            res.status(400).json({
                message: "Invalid task status",
            });
            return;
        }
        const updated = await (0, Task_1.updateTask)(taskId, userId, title.trim(), description?.trim() || "", status, dueDate || null);
        if (!updated) {
            res.status(404).json({
                message: "Task not found",
            });
            return;
        }
        res.status(200).json({
            message: "Task updated successfully",
        });
    }
    catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({
            message: "Server error while updating task",
        });
    }
};
exports.editTask = editTask;
// DELETE TASK
const removeTask = async (req, res) => {
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
        const deleted = await (0, Task_1.deleteTask)(taskId, userId);
        if (!deleted) {
            res.status(404).json({
                message: "Task not found",
            });
            return;
        }
        res.status(200).json({
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({
            message: "Server error while deleting task",
        });
    }
};
exports.removeTask = removeTask;
