import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import { db } from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

// dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (_req, res) => {
    res.json({
        message: "Task Management System Backend Running",
    });
});

export default app;

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);

        try {
            const connection = await db.getConnection();
            console.log("MySQL database connected successfully");
            connection.release();
        } catch (error) {
            console.error("MySQL connection failed:", error);
        }
    });
}