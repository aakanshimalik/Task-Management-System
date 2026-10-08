"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
// All task routes require authentication
router.use(authMiddleware_1.authenticate);
// Create task
router.post("/", taskController_1.addTask);
// Get all tasks
router.get("/", taskController_1.getTasks);
// Get one task
router.get("/:id", taskController_1.getTask);
// Update task
router.put("/:id", taskController_1.editTask);
// Delete task
router.delete("/:id", taskController_1.removeTask);
exports.default = router;
