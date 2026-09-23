import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Please enter a task before adding.");
      return;
    }
    setError("");
    await onAdd(trimmed, dueDate);
    setTitle("");
    setDueDate("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // Prevent picking dates in the past
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to get done?"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          type="date"
          value={dueDate}
          min={today}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          onClick={handleSubmit}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-600/30 active:scale-95"
        >
          Add task
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
