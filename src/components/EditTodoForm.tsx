import React, { useState } from "react";
import { Task } from "./TodoForm";

interface EditTodoFormProps {
    editTodo: (
        id: string,
        title: string,
        description: string,
        status: "pending" | "completed",
        dueDate: string
    ) => void;
    task: Task;
}

export const EditTodoForm = ({
    editTodo,
    task,
}: EditTodoFormProps) => {
    const [title, setTitle] = useState<string>(task.title);
    const [description, setDescription] = useState<string>(
        task.description
    );
    const [status, setStatus] = useState<"pending" | "completed">(
        task.status
    );
    const [dueDate, setDueDate] = useState<string>(task.dueDate);

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (title.trim() === "") {
            return;
        }

        editTodo(
            task.id,
            title.trim(),
            description.trim(),
            status,
            dueDate
        );
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
                onChange={(event) =>
                    setDescription(event.target.value)
                }
            />

            <input
                type="date"
                className="todo-input"
                value={dueDate}
                onChange={(event) =>
                    setDueDate(event.target.value)
                }
            />

            <select
                className="filterbtn"
                value={status}
                onChange={(event) =>
                    setStatus(
                        event.target.value as
                            | "pending"
                            | "completed"
                    )
                }
            >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>

            <button type="submit" className="todo-btn">
                Update Task
            </button>
        </form>
    );
};