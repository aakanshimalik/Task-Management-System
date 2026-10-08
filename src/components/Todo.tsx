import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { Task } from "./TodoForm";

interface TodoProps {
    task: Task;
    toggleComplete: (id: string) => void;
    deleteTodo: (id: string) => void;
    editTodo: (id: string) => void;
}

export const Todo = ({
    task,
    toggleComplete,
    deleteTodo,
    editTodo,
}: TodoProps) => {
    return (
        <div className="Todo">

            <div className="task-content">

                <h3
                    onClick={() => toggleComplete(task.id)}
                    className={
                        task.status === "completed"
                            ? "completed"
                            : ""
                    }
                >
                    {task.title}
                </h3>

                <p>{task.description}</p>

                <p>
                    <strong>Status:</strong>{" "}
                    {task.status}
                </p>

                <p>
                    <strong>Due Date:</strong>{" "}
                    {task.dueDate || "No due date"}
                </p>

            </div>

            <div className="task-actions">

                <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => editTodo(task.id)}
                />

                <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteTodo(task.id)}
                />

            </div>

        </div>
    );
};