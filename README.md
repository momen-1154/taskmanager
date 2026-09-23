# TaskFlow Manager

A full-stack MERN application for managing daily tasks. Add, edit, complete, and delete tasks — each with an optional due date — all persisted to MongoDB.

**Stack:** React + Tailwind CSS · Node.js + Express · MongoDB + Mongoose

```
taskflow-manager/
├── backend/
│   ├── models/Task.js
│   ├── routes/tasks.js
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/ Navbar, TaskForm, TaskList, TaskItem
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.example
├── postman/TaskFlow.postman_collection.json
└── README.md
```

---

## 1. Prerequisites

- Node.js 18+
- MongoDB — a local install, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env        # then edit .env with your MongoDB URI
npm run dev                 # http://localhost:5000
```

`.env` values:

| Variable      | Example                                             |
| ------------- | --------------------------------------------------- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/taskflow` (local) or your Atlas string |
| `PORT`        | `5000`                                              |

---

## 3. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL points at the backend
npm run dev                 # http://localhost:5173
```

Open **http://localhost:5173**. Responsive on desktop and mobile.

---

## 4. API reference

Consistent JSON shape: `{ id, title, status, dueDate, createdAt }` where `status` is `"pending"` or `"completed"`.

| Method   | Endpoint      | Body                                    | Description                                |
| -------- | ------------- | --------------------------------------- | ----------------------------------------- |
| `GET`    | `/tasks`      | —                                       | Retrieve all tasks (newest first)          |
| `POST`   | `/tasks`      | `{ title, dueDate? }`                   | Create a task                              |
| `PUT`    | `/tasks/:id`  | `{ title?, dueDate?, status? }` or `{}` | Edit fields; empty body toggles completion |
| `DELETE` | `/tasks/:id`  | —                                       | Delete a task                              |

**Error handling** — `400` (empty title, malformed ID, invalid date), `404` (task not found), `500` (server error).

### Testing with Postman / Insomnia

Import `postman/TaskFlow.postman_collection.json`, set `baseUrl` if needed, then run the requests top to bottom (Create saves the new id for Edit/Delete). Includes the error cases: empty title → 400, bad id → 400.

---

## 5. Deployment

**MongoDB Atlas** (database) + **Render** (backend) + **Vercel / Netlify** (frontend).

Deploy configs are included: `render.yaml` (backend blueprint — add `MONGODB_URI` in the dashboard), and `frontend/netlify.toml` / `frontend/vercel.json` (build + SPA redirect so refreshes don't 404).

- **Atlas:** free cluster, a DB user, Network Access `0.0.0.0/0`, copy the connection string.
- **Backend (Render):** Web Service, root `backend`, build `npm install`, start `npm start`, env var `MONGODB_URI`.
- **Frontend (Vercel/Netlify):** root `frontend`, build `npm run build`, output `dist`, env var `VITE_API_URL` = your backend URL, then redeploy.

---

## 6. Features

- Add, **edit** (title + due date), complete, and delete tasks with instant UI updates.
- Smart due-date badges: Overdue / Due today / Due tomorrow / date.
- Welcoming header, progress bar, gradient-mesh background, entrance/exit animations, responsive, reduced-motion aware.

## 7. Submission checklist

- [x] React components (`TaskForm`, `TaskList`, `TaskItem`) + `useState` + props
- [x] Responsive Tailwind UI, instant add/edit/delete, strikethrough on complete
- [x] Express API with `express.json()`, validation, success/error responses
- [x] Mongoose schema, MongoDB persistence, full CRUD
- [ ] Push to GitHub and add your repository link here
- [ ] Deploy and add your public app link here
