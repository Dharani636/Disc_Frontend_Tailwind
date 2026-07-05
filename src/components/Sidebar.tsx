import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { to: "/students", label: "Students", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 12.5c0 2.3-.86 4.4-2.28 6M12 14l-9-5m9 5v7m-9-12v6a4 4 0 004 4h1" },
  { to: "/batch", label: "Batch", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { to: "/semesters", label: "Semesters", icon: "M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" },
  { to: "/specializations", label: "Specializations", icon: "M9.663 17h4.673M12 3v1m0 16v1m8.485-15.485l-.707.707M4.222 4.222l.707.707M21 12h-1M4 12H3m15.485 4.485l-.707-.707M4.222 19.778l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" },
  { to: "/jobs", label: "Job Preferred", icon: "M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM8 5h8v2H8V5z" },
  { to: "/disc", label: "DISC Activities", icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" },
  { to: "/analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-ink-900 overflow-y-auto">
      <div className="px-5 pt-6 pb-4 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <h2 className="text-white font-semibold text-[15px] tracking-tight">
            Seminar Admin
          </h2>
        </div>
      </div>

      <nav className="flex-1 px-2.5 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors
                ${
                  isActive
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
            >
              <svg
                className="w-[18px] h-[18px] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10 text-[11px] text-slate-500">
        Seminar Maintenance System
      </div>
    </aside>
  );
}
