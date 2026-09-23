export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            TaskFlow
          </span>
        </div>

        <span className="text-sm font-medium text-slate-600">
          Welcome, <span className="text-indigo-600">Momen</span> 👋
        </span>
      </div>
    </header>
  );
}
