import React, { useState } from "react";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: "pending" | "completed";
    dueDate: string;
    isEditing?: boolean;
}

interface TodoFormProps {
    addTodo: (task: Omit<Task, "id">) => void;
    setFilter: (filter: string) => void;
}

export const TodoForm = ({ addTodo, setFilter }: TodoFormProps) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        addTodo({
            title: title.trim(),
            description: description.trim(),
            status: "pending",
            dueDate,
        });

        setTitle("");
        setDescription("");
        setDueDate("");
        setError("");
    };

    return (
        <form className="TodoForm" onSubmit={handleSubmit}>

            <input
                type="text"
                className="todo-input"
                value={title}
                placeholder="Task title"
                onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
                className="todo-input"
                value={description}
                placeholder="Task description"
                onChange={(event) => setDescription(event.target.value)}
            />

            <input
                type="date"
                className="todo-input"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
            />

            {error && (
                <p style={{ color: "red", fontSize: "14px" }}>
                    {error}
                </p>
            )}

            <button type="submit" className="todo-btn">
                Add Task
            </button>

            <div className="task-filter">
                <select
                    onChange={(event) => setFilter(event.target.value)}
                    className="filterbtn"
                    defaultValue="all"
                >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

        </form>
    );
};