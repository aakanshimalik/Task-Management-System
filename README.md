# Task Management System

A full-stack Task Management System built using **React, TypeScript, Node.js, Express.js, and MySQL**.

The application allows authenticated users to create, view, update, delete, and manage their tasks with status and due-date tracking.

## 🚀 Features

### 👤 Authentication

* User registration and login
* Password hashing using **bcrypt**
* JWT-based authentication
* Access token and refresh token support
* Protected task APIs
* Automatic access-token refresh using Axios interceptors
* User-specific task management

### ✅ Task Management

* Create new tasks
* View all tasks
* View individual tasks
* Edit tasks
* Delete tasks
* Mark tasks as pending or completed
* Add task descriptions
* Set task due dates
* Filter tasks by status

### 💻 Frontend

* React with TypeScript
* React Hooks
* Responsive UI for desktop and mobile
* Login and registration pages
* Task dashboard
* Profile section
* Axios API integration
* Automatic token refresh
* Clean and responsive task management interface

### ⚙️ Backend

* Node.js with Express.js
* TypeScript
* RESTful APIs
* JWT authentication
* Refresh-token mechanism
* Authentication middleware
* Request validation
* Error handling
* Environment variable configuration
* Modular architecture using routes, controllers, models, services, and middleware

### 🗄️ Database

* MySQL relational database
* Users, tasks, and refresh-token tables
* Foreign-key relationships
* Cascading deletion
* Database indexes for optimized queries

### 🧪 Testing

* Jest
* Supertest
* API integration testing
* Authentication testing
* Protected-route testing
* Task CRUD testing
* Refresh-token testing

## 🛠️ Tech Stack

**Frontend:**

* React
* TypeScript
* Axios
* CSS

**Backend:**

* Node.js
* Express.js
* TypeScript
* JWT
* bcryptjs
* MySQL2
* dotenv
* CORS

**Database:**

* MySQL

**Testing:**

* Jest
* Supertest
* ts-jest

**Tools:**

* Git
* GitHub
* VS Code
* Postman

## 📁 Project Structure

```text
Task-Management-System/
│
├── public/
├── src/
│   ├── components/
│   │   ├── EditTodoForm.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Todo.tsx
│   │   ├── TodoForm.tsx
│   │   └── TodoWrapper.tsx
│   ├── api.ts
│   ├── App.tsx
│   └── index.tsx
│
├── server/
│   ├── src/
│   │   ├── __tests__/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## ⚙️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aakanshimalik/Task-Management-System.git
cd Task-Management-System
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=task_management
DB_PORT=3306

JWT_ACCESS_SECRET=YOUR_ACCESS_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET
```

> Do not commit the `.env` file to GitHub.

### 5. Setup MySQL

Create the database:

```sql
CREATE DATABASE task_management;
```

Create the required `users`, `tasks`, and `refresh_tokens` tables according to the project database schema.

### 6. Start the Backend

From the `server` directory:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 7. Start the Frontend

Open another terminal in the project root:

```bash
npm start
```

Frontend:

```text
http://localhost:3000
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Register a new user         |
| POST   | `/api/auth/login`    | Login                       |
| POST   | `/api/auth/refresh`  | Generate a new access token |

### Tasks

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/api/tasks`     | Create a task       |
| GET    | `/api/tasks`     | Get user's tasks    |
| GET    | `/api/tasks/:id` | Get a specific task |
| PUT    | `/api/tasks/:id` | Update a task       |
| DELETE | `/api/tasks/:id` | Delete a task       |

Protected endpoints require:

```text
Authorization: Bearer <access_token>
```

## 🔐 Authentication Flow

```text
Login
  ↓
Access Token + Refresh Token
  ↓
Authenticated API Requests
  ↓
Access Token Expires
  ↓
Axios Interceptor Detects 401
  ↓
Refresh Token Request
  ↓
New Access Token
  ↓
Original Request Retried
```

## 🧪 Running Tests

From the `server` directory:

```bash
npm test
```

The test suite covers:

* User registration
* User login
* Protected task APIs
* Task creation
* Task update
* Task deletion
* Access-token refresh

## 🔒 Security

* Passwords are hashed using bcrypt.
* Protected APIs require JWT authentication.
* Refresh tokens are stored in the database.
* SQL queries use parameterized values.
* Sensitive configuration is stored in environment variables.
* `.env` is excluded from version control.
* Users can access only their own tasks.

## 👩‍💻 Author

**Aakanshi Malik**

* GitHub: https://github.com/aakanshimalik
* LinkedIn: https://www.linkedin.com/in/aakanshi-malik-996738298

## 📄 License

This project was developed as part of a technical assignment and learning project.
