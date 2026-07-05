import { useState, useEffect } from "react";
import publicApi from "../api/Publicapi";

export default function StudentView() {
  const [semester, setSemester] = useState("1");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("2026");
  const [batches, setBatches] = useState<any[]>([]);

  const loadBatches = async () => {
    try {
      const res = await publicApi.get("/batch");
      setBatches(res.data);
      if (res.data.length > 0) {
        setBatch(res.data[0].batchName);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStudents = async (batchName: string, sem: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await publicApi.get(`/student/batch/${batchName}/semester/${sem}`);
      setStudents(response.data);
    } catch (err: any) {
      setStudents([]);
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (batch) {
      fetchStudents(batch, semester);
    }
    setSearch("");
  }, [batch, semester]);

  const filteredStudents = search.trim()
    ? students.filter((s) => s.registerNumber?.toLowerCase().includes(search.trim().toLowerCase()))
    : students;

  const submitted = filteredStudents.filter((s) => s.status?.toLowerCase() === "submitted").length;
  const pending = filteredStudents.length - submitted;

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  const ScoreCell = ({ value }: { value: number | null | undefined }) =>
    value != null ? (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-medium text-slate-800">
        {value}
      </span>
    ) : (
      <span className="text-slate-300 text-[13px]">—</span>
    );

  const StatusBadge = ({ status }: { status: string }) => {
    const isSubmitted = status?.toLowerCase() === "submitted";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium
          ${isSubmitted ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
      >
        <span className="text-[9px]">{isSubmitted ? "●" : "○"}</span>
        {status}
      </span>
    );
  };

  const discColors: Record<string, string> = {
    D: "#5B21B6",
    I: "#0F766E",
    S: "#1D4ED8",
    C: "#B45309",
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="mb-7 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-[34px] h-[34px] rounded-lg bg-brand-50 flex items-center justify-center text-lg">
              🎓
            </div>
            <h1 className="text-[18px] font-semibold text-slate-900">Student DISC Portal</h1>
          </div>
          <p className="text-[13px] text-slate-500">Assessment results by semester</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-slate-600">Batch</span>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="field w-auto h-[38px]"
            >
              {batches.map((b: any) => (
                <option key={b.id} value={b.batchName}>
                  {b.batchName}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Toggle */}
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] font-medium text-slate-500">Semester</span>
            <div className="flex gap-1.5">
              {["1", "2"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSemester(s)}
                  className={`px-4 py-1.5 rounded-full text-[13px] transition
                    ${
                      semester === s
                        ? "bg-brand-50 text-brand-700 font-semibold"
                        : "border border-slate-200 text-slate-500 font-normal hover:bg-white"
                    }`}
                >
                  Semester {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stats chips */}
          {!loading && filteredStudents.length > 0 && (
            <div className="flex gap-2">
              {[
                { label: "students", value: filteredStudents.length, color: "text-slate-600" },
                { label: "submitted", value: submitted, color: "text-emerald-700" },
                { label: "pending", value: pending, color: "text-amber-700" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-xs text-slate-500 flex items-center gap-1.5"
                >
                  <strong className={`font-semibold ${color}`}>{value}</strong> {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-5 relative max-w-[320px]">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by roll number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field pl-8 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              title="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-slate-200 text-slate-500 text-[11px] flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {search.trim() && (
          <p className="text-xs text-slate-400 mb-3">
            {filteredStudents.length > 0
              ? `Showing ${filteredStudents.length} result${filteredStudents.length > 1 ? "s" : ""} for "${search}"`
              : `No match found for "${search}"`}
          </p>
        )}

        {error && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-50 text-red-700 text-[13px] mb-4 flex items-center gap-2">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading students…</div>
        ) : (
          <div className="border border-slate-200 rounded-xl2 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="th-cell">Reg no</th>
                    <th className="th-cell">Name</th>
                    <th className="th-cell">Batch</th>
                    <th className="th-cell">Semester</th>
                    <th className="th-cell">Specialization</th>
                    <th className="th-cell">Job pref</th>
                    {["D", "I", "S", "C"].map((letter) => (
                      <th key={letter} className="th-cell text-center" style={{ color: discColors[letter] }}>
                        {letter}
                      </th>
                    ))}
                    <th className="th-cell">Assignment</th>
                    <th className="th-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="td-cell font-mono text-xs text-slate-500">
                        {search.trim() ? <HighlightText text={s.registerNumber ?? ""} query={search.trim()} /> : s.registerNumber}
                      </td>
                      <td className="td-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-[26px] h-[26px] rounded-full bg-brand-50 text-brand-700 text-[10px] font-semibold flex items-center justify-center shrink-0">
                            {getInitials(s.studentName)}
                          </div>
                          {s.studentName}
                        </div>
                      </td>
                      <td className="td-cell text-slate-500">{s.batchName}</td>
                      <td className="td-cell text-slate-500">{s.semesterName}</td>
                      <td className="td-cell">{s.specializationName}</td>
                      <td className="td-cell text-slate-500">{s.jobPreferredName}</td>

                      {[s.dScore, s.iScore, s.sScore, s.cScore].map((score, i) => (
                        <td key={i} className="td-cell text-center">
                          <ScoreCell value={score} />
                        </td>
                      ))}

                      <td className="td-cell text-slate-500 text-xs">{s.assignment}</td>
                      <td className="td-cell">
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && !loading && (
              <div className="text-center py-12 text-slate-400">
                <div className="text-[28px] mb-2">{search.trim() ? "🔍" : "📭"}</div>
                <p className="text-sm">
                  {search.trim() ? `No student found with roll number "${search}"` : `No students found for Semester ${semester}`}
                </p>
                {search.trim() && (
                  <button
                    onClick={() => setSearch("")}
                    className="mt-2.5 text-[13px] text-brand-600 underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Highlights matching part of reg number
function HighlightText({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-slate-800 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
