import React, { useEffect, useState } from "react";
import api from "../api.ts";
import { TodoForm, Task } from "./TodoForm.tsx";
import { Todo } from "./Todo.tsx";
import { EditTodoForm } from "./EditTodoForm.tsx";

const formatDate = (value: string | null | undefined): string => {
    if (!value) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const TodoWrapper = () => {

    const [todos, setTodos] = useState<Task[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchError, setFetchError] = useState<string>("");

    // Fetch tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setFetchError("");

                const response = await api.get("/tasks");

                const tasks = response.data.tasks ?? response.data;

                const formattedTasks: Task[] = tasks.map(
                    (task: any) => ({
                        id: String(task.id),
                        title: task.title,
                        description: task.description || "",
                        status: task.status,
                        dueDate: formatDate(
                            task.due_date || task.dueDate
                        ),
                    })
                );

                setTodos(formattedTasks);

            } catch (error) {
                console.error("Error fetching tasks:", error);
                setFetchError(
                    "Unable to load tasks. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Add task
    const addTodo = async (
        taskData: Omit<Task, "id">
    ) => {
        try {
            const response = await api.post(
                "/tasks",
                {
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    dueDate:
                        formatDate(taskData.dueDate) || null,
                }
            );

            const createdTask =
                response.data.task ?? response.data;

            const formattedTask: Task = {
                id: String(createdTask.id),
                title: createdTask.title,
                description:
                    createdTask.description || "",
                status: createdTask.status,
                dueDate: formatDate(
                    createdTask.due_date ||
                    createdTask.dueDate
                ),
            };

            setTodos((previousTodos) => [
                ...previousTodos,
                formattedTask,
            ]);

        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Complete / Pending
    const toggleComplete = async (id: string) => {

        const currentTask = todos.find(
            (todo) => todo.id === id
        );

        if (!currentTask) return;

        const newStatus =
            currentTask.status === "completed"
                ? "pending"
                : "completed";

        try {
            await api.put(
                `/tasks/${id}`,
                {
                    title: currentTask.title,
                    description: currentTask.description,
                    status: newStatus,
                    dueDate:
                        formatDate(
                            currentTask.dueDate
                        ) || null,
                }
            );

            setTodos((previousTodos) =>
                previousTodos.map((todo) =>
                    todo.id === id
                        ? {
                            ...todo,
                            status: newStatus,
                        }
                        : todo
                )
            );

        } catch (error) {
            console.error(
                "Error updating task status:",
                error
            );
        }
    };

    // Delete task
    const deleteTodo = async (id: string) => {
        try {
            await api.delete(`/tasks/${id}`);

            setTodos((previousTodos) =>
                previousTodos.filter(
                    (todo) => todo.id !== id
                )
            );

        } catch (error) {
            console.error(
                "Error deleting task:",
                error
            );
        }
    };

    // Enter edit mode
    const editTodo = (id: string) => {
        setTodos((previousTodos) =>
            previousTodos.map((todo) =>
                todo.id === id
                    ? {
                        ...todo,
                        isEditing: true,
                    }
                    : todo
            )
        );
    };

    // Update task
    const editTask = async (
        id: string,
        title: string,
        description: string,
        status: "pending" | "completed",
        dueDate: string
    ) => {
        try {
            await api.put(
                `/tasks/${id}`,
                {
                    title,
                    description,
                    status,
                    dueDate:
                        formatDate(dueDate) || null,
                }
            );

            setTodos((previousTodos) =>
                previousTodos.map((todo) =>
                    todo.id === id
                        ? {
                            ...todo,
                            title,
                            description,
                            status,
                            dueDate: formatDate(dueDate),
                            isEditing: false,
                        }
                        : todo
                )
            );

        } catch (error) {
            console.error(
                "Error editing task:",
                error
            );
        }
    };

    // Filter
    const filteredTodos = todos.filter((todo) => {

        if (filter === "completed") {
            return todo.status === "completed";
        }

        if (filter === "pending") {
            return todo.status === "pending";
        }

        return true;
    });

    // Sort completed tasks below pending tasks
    const sortedTodos = [...filteredTodos].sort(
        (a, b) =>
            Number(a.status === "completed") -
            Number(b.status === "completed")
    );

    return (
        <div className="TodoWrapper">

            <h1>Task Management System</h1>

            <TodoForm
                addTodo={addTodo}
                setFilter={setFilter}
            />

            {loading && (
                <p>Loading tasks...</p>
            )}

            {fetchError && (
                <p className="auth-error">
                    {fetchError}
                </p>
            )}

            {!loading &&
                sortedTodos.length === 0 && (
                    <p>No tasks found.</p>
                )}

            {sortedTodos.map((todo) =>
                todo.isEditing ? (

                    <EditTodoForm
                        key={todo.id}
                        editTodo={editTask}
                        task={todo}
                    />

                ) : (

                    <Todo
                        key={todo.id}
                        task={todo}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                        editTodo={editTodo}
                    />

                )
            )}

        </div>
    );
};