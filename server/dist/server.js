"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import dotenv from "dotenv";
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
// dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
app.get("/", (_req, res) => {
    res.json({
        message: "Task Management System Backend Running",
    });
});
exports.default = app;
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        try {
            const connection = await db_1.db.getConnection();
            console.log("MySQL database connected successfully");
            connection.release();
        }
        catch (error) {
            console.error("MySQL connection failed:", error);
        }
    });
}
