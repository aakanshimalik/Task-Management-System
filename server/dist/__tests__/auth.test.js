"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const db_1 = require("../config/db");
const globals_2 = require("@jest/globals");
(0, globals_1.describe)("Authentication API", () => {
    (0, globals_1.test)("should register a new user", async () => {
        const uniqueEmail = `test${Date.now()}@example.com`;
        const response = await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/register")
            .send({
            name: "Test User",
            email: uniqueEmail,
            password: "Test12345",
        });
        (0, globals_1.expect)(response.statusCode).toBe(201);
        (0, globals_1.expect)(response.body).toHaveProperty("message", "User registered successfully");
        (0, globals_1.expect)(response.body.user).toHaveProperty("id");
        (0, globals_1.expect)(response.body.user).toHaveProperty("name", "Test User");
        (0, globals_1.expect)(response.body.user).toHaveProperty("email", uniqueEmail);
    });
    (0, globals_1.test)("should login an existing user and return tokens", async () => {
        const uniqueEmail = `login${Date.now()}@example.com`;
        // First register the user
        await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/register")
            .send({
            name: "Login Test User",
            email: uniqueEmail,
            password: "Test12345",
        });
        // Then login
        const response = await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/login")
            .send({
            email: uniqueEmail,
            password: "Test12345",
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.body).toHaveProperty("message", "Login successful");
        (0, globals_1.expect)(response.body).toHaveProperty("accessToken");
        (0, globals_1.expect)(response.body).toHaveProperty("refreshToken");
        (0, globals_1.expect)(response.body.user).toHaveProperty("email", uniqueEmail);
    });
    (0, globals_1.test)("should access protected task API with a valid access token", async () => {
        const uniqueEmail = `task${Date.now()}@example.com`;
        // Register user
        await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/register")
            .send({
            name: "Task Test User",
            email: uniqueEmail,
            password: "Test12345",
        });
        // Login user
        const loginResponse = await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/login")
            .send({
            email: uniqueEmail,
            password: "Test12345",
        });
        const accessToken = loginResponse.body.accessToken;
        // Access protected task endpoint
        const response = await (0, supertest_1.default)(server_1.default)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${accessToken}`);
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.body).toHaveProperty("tasks");
    });
    (0, globals_1.test)("should create a new task for an authenticated user", async () => {
        const uniqueEmail = `createTask${Date.now()}@example.com`;
        // Register user
        await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/register")
            .send({
            name: "Create Task User",
            email: uniqueEmail,
            password: "Test12345",
        });
        // Login user
        const loginResponse = await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/login")
            .send({
            email: uniqueEmail,
            password: "Test12345",
        });
        const accessToken = loginResponse.body.accessToken;
        // Create task
        const response = await (0, supertest_1.default)(server_1.default)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            title: "Test Task",
            description: "Task created during automated testing",
            status: "pending",
            dueDate: "2026-10-15",
        });
        (0, globals_1.expect)(response.statusCode).toBe(201);
        (0, globals_1.expect)(response.body).toHaveProperty("task");
        (0, globals_1.expect)(response.body.task).toHaveProperty("title", "Test Task");
        (0, globals_1.expect)(response.body.task).toHaveProperty("description", "Task created during automated testing");
        (0, globals_1.expect)(response.body.task).toHaveProperty("status", "pending");
    });
    (0, globals_1.test)("should update and delete a task for an authenticated user", async () => {
        const uniqueEmail = `updateTask${Date.now()}@example.com`;
        // Register user
        await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/register")
            .send({
            name: "Update Task User",
            email: uniqueEmail,
            password: "Test12345",
        });
        // Login user
        const loginResponse = await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/login")
            .send({
            email: uniqueEmail,
            password: "Test12345",
        });
        const accessToken = loginResponse.body.accessToken;
        // Create task
        const createResponse = await (0, supertest_1.default)(server_1.default)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            title: "Original Task",
            description: "Original description",
            status: "pending",
            dueDate: "2026-10-15",
        });
        (0, globals_1.expect)(createResponse.statusCode).toBe(201);
        const taskId = createResponse.body.task.id;
        // Update task
        const updateResponse = await (0, supertest_1.default)(server_1.default)
            .put(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            title: "Updated Task",
            description: "Updated description",
            status: "completed",
            dueDate: "2026-10-20",
        });
        console.log("UPDATE RESPONSE:", updateResponse.body);
        (0, globals_1.expect)(updateResponse.statusCode).toBe(200);
        // Delete task
        const deleteResponse = await (0, supertest_1.default)(server_1.default)
            .delete(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        (0, globals_1.expect)(deleteResponse.statusCode).toBe(200);
    });
    (0, globals_1.test)("should generate a new access token using a valid refresh token", async () => {
        const uniqueEmail = `refresh${Date.now()}@example.com`;
        // Register user
        await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/register")
            .send({
            name: "Refresh Test User",
            email: uniqueEmail,
            password: "Test12345",
        });
        // Login user
        const loginResponse = await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/login")
            .send({
            email: uniqueEmail,
            password: "Test12345",
        });
        (0, globals_1.expect)(loginResponse.statusCode).toBe(200);
        const refreshToken = loginResponse.body.refreshToken;
        (0, globals_1.expect)(refreshToken).toBeDefined();
        // Request a new access token
        const refreshResponse = await (0, supertest_1.default)(server_1.default)
            .post("/api/auth/refresh")
            .send({
            refreshToken,
        });
        (0, globals_1.expect)(refreshResponse.statusCode).toBe(200);
        (0, globals_1.expect)(refreshResponse.body).toHaveProperty("accessToken");
        (0, globals_1.expect)(refreshResponse.body.accessToken).toBeDefined();
    });
});
(0, globals_2.afterAll)(async () => {
    await db_1.db.end();
});
