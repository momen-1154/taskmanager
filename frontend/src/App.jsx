import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import { getTasks, addTask, updateTask, toggleTask, deleteTask } from "./api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (title, dueDate) => {
    try {
      const newTask = await addTask(title, dueDate);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, fields) => {
    try {
      const updated = await updateTask(id, fields);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur sm:p-8">
          <header className="mb-6">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Your tasks
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading your tasks…"
                : `${total} task${total !== 1 ? "s" : ""} · ${completedCount} done`}
            </p>

            {!loading && total > 0 && (
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </header>

          <TaskForm onAdd={handleAdd} />

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          TaskFlow Manager · MERN Stack
        </p>
      </main>
    </div>
  );
}
