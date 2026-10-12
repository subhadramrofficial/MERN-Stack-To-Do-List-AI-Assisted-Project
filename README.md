# 📝 MERN TaskFlow — Modern Full-Stack Todo Application

A modern, production-structured **MERN** (MongoDB, Express.js, React, Node.js) Todo application with full CRUD operations, task prioritization, due date tracking, search & filter capabilities, and a responsive UI.

---

## 📁 Project Folder Structure

```
mern-todolist/
├── backend/                        # Node.js & Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   └── todoController.js   # Business logic (CRUD, filters, stats)
│   │   ├── middleware/
│   │   │   └── errorHandler.js     # 404 & centralized error handlers
│   │   ├── models/
│   │   │   └── Todo.js             # Mongoose Schema & validation
│   │   ├── routes/
│   │   │   └── todoRoutes.js       # RESTful API route definitions
│   │   ├── app.js                  # Express middleware setup & app config
│   │   └── server.js               # Server entry point & port listener
│   ├── .env                        # Local environment variables
│   ├── .env.example                # Template for environment variables
│   ├── .gitignore
│   └── package.json                # Backend dependencies & scripts
│
├── frontend/                       # React 18 SPA (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── todoApi.js          # Fetch client communicating with backend
│   │   ├── components/
│   │   │   ├── Header.jsx          # App branding & date display
│   │   │   ├── StatsBar.jsx        # Completion progress & metrics
│   │   │   ├── TodoForm.jsx        # Task creation (title, desc, priority, date)
│   │   │   ├── FilterTabs.jsx      # Filter by status, priority, sort & search
│   │   │   ├── TodoList.jsx        # Task list wrapper & empty states
│   │   │   └── TodoItem.jsx        # Task card with inline editing & actions
│   │   ├── App.jsx                 # Top-level state management & handlers
│   │   ├── App.css                 # Application-specific styles
│   │   ├── index.css               # Global theme & typography
│   │   └── main.jsx                # React DOM root entry
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite config with API proxy
│   ├── .gitignore
│   └── package.json                # Frontend dependencies & scripts
│
├── .gitignore
├── package.json                    # Root package.json (concurrent runner)
└── README.md                       # Documentation & instructions
```

---

## ⚡ Tech Stack

- **Frontend**: React 18, Vite, Modern CSS3 with CSS Variables & Glassmorphism
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Tooling**: `concurrently` (run client & server together), `nodemon` (auto-reload)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster URI.

---

### 2. Quick Installation (One-Command)

Open a terminal in the `mern-todolist` root directory:

```bash
# Install root, backend, and frontend dependencies at once:
npm run install:all
```

*Or install them manually:*
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

---

### 3. Configure Environment Variables

The backend includes a pre-configured `.env` file. You can adjust the settings in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_todolist
NODE_ENV=development
```

> **Note**: If using MongoDB Atlas, replace `MONGO_URI` with your connection string:
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern_todolist?retryWrites=true&w=majority`

---

### 4. Running the Application

#### Option A: Run Both Together (Recommended)
From the project root:
```bash
npm run dev
```
This concurrently starts:
- Express backend at **http://localhost:5000**
- Vite React frontend at **http://localhost:3000**

#### Option B: Run in Separate Terminals

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```

Open your browser and navigate to **http://localhost:3000**.

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api/todos`

| Method | Endpoint | Description | Query / Body Params |
|---|---|---|---|
| `GET` | `/api/todos` | Fetch all todos | Query: `status` (`all`\|`active`\|`completed`), `priority` (`low`\|`medium`\|`high`), `search` (text), `sortBy` (`newest`\|`oldest`\|`dueDate`) |
| `GET` | `/api/todos/:id` | Fetch single todo by ID | — |
| `POST` | `/api/todos` | Create a new todo | Body: `{ title, description?, priority?, dueDate? }` |
| `PUT` | `/api/todos/:id` | Update todo fields | Body: `{ title?, description?, completed?, priority?, dueDate? }` |
| `DELETE` | `/api/todos/:id` | Delete todo by ID | — |
| `DELETE` | `/api/todos/completed` | Clear all completed todos | — |
| `GET` | `/api/health` | Backend health check | — |

---

## ✨ Features

- **Full CRUD Support**: Create, read, edit in place, toggle completed, and delete tasks.
- **Priority Levels**: Tag tasks as `Low`, `Medium`, or `High` with visual indicators.
- **Due Dates & Overdue Alerts**: Set due dates with visual badges for upcoming, today, or overdue deadlines.
- **Real-Time Progress Metrics**: Live completion rate bar and counter cards for active, completed, and urgent tasks.
- **Filtering & Search**: Instant client & server-ready filtering by status and priority, text search, and sorting.
- **Optimistic UI**: Instant responsiveness on toggling and deleting.
- **Robust Error Handling**: Centralized Express middleware, Mongoose validation, and client notifications.
