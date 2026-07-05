import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const adminUser = localStorage.getItem("adminUser");
  const initials = (adminUser ?? "A").slice(0, 1).toUpperCase();

  return (
    <header className="h-15 sticky top-0 z-10 flex items-center justify-between bg-white border-b border-slate-200 px-7 h-[60px]">
      <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">
        Seminar Maintenance
      </h3>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
          <span className="text-[13px] font-medium text-slate-600">
            {adminUser}
          </span>
        </div>

        <button
          onClick={logout}
          className="h-8 px-3.5 rounded-lg bg-red-50 text-red-600 text-[13px] font-semibold transition hover:bg-red-100 active:scale-[0.97]"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
