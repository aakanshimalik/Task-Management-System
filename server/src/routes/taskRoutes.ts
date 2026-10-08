import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
    addTask,
    getTasks,
    getTask,
    editTask,
    removeTask,
} from "../controllers/taskController";

const router = Router();

// All task routes require authentication
router.use(authenticate);

// Create task
router.post("/", addTask);

// Get all tasks
router.get("/", getTasks);

// Get one task
router.get("/:id", getTask);

// Update task
router.put("/:id", editTask);

// Delete task
router.delete("/:id", removeTask);

export default router;