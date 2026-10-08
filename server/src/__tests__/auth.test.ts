import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../server";
import { db } from "../config/db";
import { afterAll } from "@jest/globals";

describe("Authentication API", () => {

    test("should register a new user", async () => {

        const uniqueEmail =
            `test${Date.now()}@example.com`;

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: uniqueEmail,
                password: "Test12345",
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty(
            "message",
            "User registered successfully"
        );

        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user).toHaveProperty(
            "name",
            "Test User"
        );
        expect(response.body.user).toHaveProperty(
            "email",
            uniqueEmail
        );
    });


    test("should login an existing user and return tokens", async () => {

        const uniqueEmail =
            `login${Date.now()}@example.com`;

        // First register the user
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Login Test User",
                email: uniqueEmail,
                password: "Test12345",
            });

        // Then login
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: uniqueEmail,
                password: "Test12345",
            });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty(
            "message",
            "Login successful"
        );

        expect(response.body).toHaveProperty(
            "accessToken"
        );

        expect(response.body).toHaveProperty(
            "refreshToken"
        );

        expect(response.body.user).toHaveProperty(
            "email",
            uniqueEmail
        );
    });

    test("should access protected task API with a valid access token", async () => {

    const uniqueEmail =
        `task${Date.now()}@example.com`;

    // Register user
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Task Test User",
            email: uniqueEmail,
            password: "Test12345",
        });

    // Login user
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: uniqueEmail,
            password: "Test12345",
        });

    const accessToken = loginResponse.body.accessToken;

    // Access protected task endpoint
    const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("tasks");
});

test("should create a new task for an authenticated user", async () => {

    const uniqueEmail =
        `createTask${Date.now()}@example.com`;

    // Register user
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Create Task User",
            email: uniqueEmail,
            password: "Test12345",
        });

    // Login user
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: uniqueEmail,
            password: "Test12345",
        });

    const accessToken = loginResponse.body.accessToken;

    // Create task
    const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            title: "Test Task",
            description: "Task created during automated testing",
            status: "pending",
            dueDate: "2026-10-15",
        });

    expect(response.statusCode).toBe(201);

    expect(response.body).toHaveProperty("task");

    expect(response.body.task).toHaveProperty(
        "title",
        "Test Task"
    );

    expect(response.body.task).toHaveProperty(
        "description",
        "Task created during automated testing"
    );

    expect(response.body.task).toHaveProperty(
        "status",
        "pending"
    );
});

test("should update and delete a task for an authenticated user", async () => {

    const uniqueEmail =
        `updateTask${Date.now()}@example.com`;

    // Register user
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Update Task User",
            email: uniqueEmail,
            password: "Test12345",
        });

    // Login user
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: uniqueEmail,
            password: "Test12345",
        });

    const accessToken = loginResponse.body.accessToken;

    // Create task
    const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            title: "Original Task",
            description: "Original description",
            status: "pending",
            dueDate: "2026-10-15",
        });

    expect(createResponse.statusCode).toBe(201);

    const taskId = createResponse.body.task.id;

    // Update task
    const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            title: "Updated Task",
            description: "Updated description",
            status: "completed",
            dueDate: "2026-10-20",
        });

    console.log("UPDATE RESPONSE:", updateResponse.body);

expect(updateResponse.statusCode).toBe(200);

    // Delete task
    const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteResponse.statusCode).toBe(200);
});

test("should generate a new access token using a valid refresh token", async () => {

    const uniqueEmail =
        `refresh${Date.now()}@example.com`;

    // Register user
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Refresh Test User",
            email: uniqueEmail,
            password: "Test12345",
        });

    // Login user
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: uniqueEmail,
            password: "Test12345",
        });

    expect(loginResponse.statusCode).toBe(200);

    const refreshToken = loginResponse.body.refreshToken;

    expect(refreshToken).toBeDefined();

    // Request a new access token
    const refreshResponse = await request(app)
        .post("/api/auth/refresh")
        .send({
            refreshToken,
        });

    expect(refreshResponse.statusCode).toBe(200);

    expect(refreshResponse.body).toHaveProperty(
        "accessToken"
    );

    expect(refreshResponse.body.accessToken).toBeDefined();
});

});
afterAll(async () => {
    await db.end();
});