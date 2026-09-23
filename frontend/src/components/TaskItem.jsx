import { useState } from "react";

function describeDue(dueDate, isDone) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);

  const label = due.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

  if (isDone) return { text: label, tone: "done" };
  if (diffDays < 0) return { text: `Overdue · ${label}`, tone: "overdue" };
  if (diffDays === 0) return { text: "Due today", tone: "today" };
  if (diffDays === 1) return { text: "Due tomorrow", tone: "soon" };
  return { text: label, tone: "upcoming" };
}

const toneStyles = {
  overdue: "bg-red-50 text-red-600 ring-red-200",
  today: "bg-amber-50 text-amber-700 ring-amber-200",
  soon: "bg-amber-50 text-amber-700 ring-amber-200",
  upcoming: "bg-slate-100 text-slate-500 ring-slate-200",
  done: "bg-slate-100 text-slate-400 ring-slate-200",
};

// dueDate (ISO) -> yyyy-mm-dd for the date input
const toInputDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const isDone = task.status === "completed";
  const [leaving, setLeaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDue, setDraftDue] = useState(toInputDate(task.dueDate));
  const due = describeDue(task.dueDate, isDone);

  const handleDelete = () => setLeaving(true);
  const handleTransitionEnd = () => {
    if (leaving) onDelete(task.id);
  };

  const startEdit = () => {
    setDraftTitle(task.title);
    setDraftDue(toInputDate(task.dueDate));
    setEditing(true);
  };

  const saveEdit = async () => {
    const trimmed = draftTitle.trim();
    if (!trimmed) return;
    await onUpdate(task.id, { title: trimmed, dueDate: draftDue || null });
    setEditing(false);
  };

  const today = new Date().toISOString().split("T")[0];

  // --- Edit mode ---
  if (editing) {
    return (
      <li className="rounded-xl border border-indigo-200 bg-white p-4 shadow-sm ring-2 ring-indigo-100">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            autoFocus
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <input
            type="date"
            value={draftDue}
            min={today}
            onChange={(e) => setDraftDue(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
          >
            Save
          </button>
        </div>
      </li>
    );
  }

  // --- Display mode ---
  return (
    <li
      onTransitionEnd={handleTransitionEnd}
      className={`group flex animate-fade-in-up items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${
        leaving ? "translate-x-3 scale-95 opacity-0" : ""
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={isDone ? "Mark as pending" : "Mark as completed"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-indigo-500"
        }`}
      >
        {isDone && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 animate-pop">
            <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={`break-words transition-colors ${isDone ? "text-slate-400 line-through" : "text-slate-800"}`}>
          {task.title}
        </span>
        {due && (
          <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${toneStyles[due.tone]}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm10 6H4v8h12V8z" clipRule="evenodd" />
            </svg>
            {due.text}
          </span>
        )}
      </div>

      {/* Edit */}
      <button
        onClick={startEdit}
        aria-label="Edit task"
        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 active:scale-90"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path d="M13.6 2.7a1.5 1.5 0 012.1 0l1.6 1.6a1.5 1.5 0 010 2.1l-9 9a1 1 0 01-.5.3l-3.5 1a.75.75 0 01-.9-.9l1-3.5a1 1 0 01.3-.5l9-9zM12.9 5l2.1 2.1" />
        </svg>
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        aria-label="Delete task"
        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 active:scale-90"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );
}
