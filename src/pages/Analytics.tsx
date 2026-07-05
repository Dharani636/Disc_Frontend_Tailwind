import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import publicApi from "../api/Publicapi";

// ── types ────────────────────────────────────────────────────────────
interface StudentRecord {
  id: number;
  registerNumber: string;
  studentName: string;
  batchName: string;
  semesterName: string;
  specializationName: string;
  dScore: number | null;
  iScore: number | null;
  sScore: number | null;
  cScore: number | null;
}

interface StudentGroup {
  registerNumber: string;
  studentName: string;
  batchName: string;
  specializationName: string;
  semesters: Record<string, StudentRecord>;
}

// ── DISC colors (hex, used inside raw SVG so kept as constants) ──────
const DISC_COLORS = {
  D: "#5B21B6",
  I: "#0F766E",
  S: "#1D4ED8",
  C: "#B45309",
};

const SEM_BADGE: Record<string, string> = {
  "1": "bg-rose-600",
  "2": "bg-slate-800",
  "3": "bg-emerald-600",
  "4": "bg-violet-600",
};

const SEM_LABELS: Record<string, string> = {
  "1": "Semester I",
  "2": "Semester II",
  "3": "Semester III",
  "4": "Semester IV",
};

// ── Donut Chart (pure SVG) ────────────────────────────────────────────
function DonutChart({ d, i, s, c }: { d: number; i: number; s: number; c: number }) {
  const total = d + i + s + c;
  if (total === 0) {
    return (
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r="38" fill="none" stroke="#e5e7eb" strokeWidth="18" />
        <text x="55" y="59" textAnchor="middle" fontSize="10" fill="#9ca3af">
          No data
        </text>
      </svg>
    );
  }

  const cx = 55, cy = 55, r = 38, strokeWidth = 18;
  const circumference = 2 * Math.PI * r;

  const slices = [
    { key: "D", value: d, color: DISC_COLORS.D },
    { key: "I", value: i, color: DISC_COLORS.I },
    { key: "S", value: s, color: DISC_COLORS.S },
    { key: "C", value: c, color: DISC_COLORS.C },
  ];

  let offset = 0;
  const paths = slices.map((slice) => {
    const pct = slice.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const el = (
      <circle
        key={slice.key}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={slice.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        style={{ transform: "rotate(-90deg)", transformOrigin: "55px 55px" }}
      />
    );
    offset += dash;
    return el;
  });

  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
      {paths}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fill="#6b7280">
        Total
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">
        {total}
      </text>
    </svg>
  );
}

// ── Score label below chart ──────────────────────────────────────────
function ScoreLabel({ d, i, s, c }: { d: number; i: number; s: number; c: number }) {
  return (
    <div className="mt-1 text-center text-[10px] text-slate-500 tracking-wide">
      <span style={{ color: DISC_COLORS.D }} className="font-semibold">D:{d}</span>
      {" · "}
      <span style={{ color: DISC_COLORS.I }} className="font-semibold">I:{i}</span>
      {" · "}
      <span style={{ color: DISC_COLORS.S }} className="font-semibold">S:{s}</span>
      {" · "}
      <span style={{ color: DISC_COLORS.C }} className="font-semibold">C:{c}</span>
    </div>
  );
}

// ── Single semester column ───────────────────────────────────────────
function SemesterColumn({ semKey, record }: { semKey: string; record: StudentRecord | undefined }) {
  const d = record?.dScore ?? 0;
  const i = record?.iScore ?? 0;
  const s = record?.sScore ?? 0;
  const c = record?.cScore ?? 0;
  const hasData = record != null;

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[120px]">
      <span
        className={`px-3 py-0.5 rounded-full text-[11px] font-semibold text-white tracking-wide ${SEM_BADGE[semKey]}`}
      >
        {SEM_LABELS[semKey]}
      </span>

      {hasData ? (
        <>
          <DonutChart d={d} i={i} s={s} c={c} />
          <ScoreLabel d={d} i={i} s={s} c={c} />
        </>
      ) : (
        <div className="w-[110px] h-[110px] flex flex-col items-center justify-center gap-1">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="38" fill="none" stroke="#e5e7eb" strokeWidth="18" strokeDasharray="4 4" />
          </svg>
          <div className="-mt-24 text-center text-[10px] text-slate-300">No data</div>
        </div>
      )}
    </div>
  );
}

// ── Arrow between semesters ──────────────────────────────────────────
function Arrow() {
  return <div className="self-center pt-4 text-lg text-slate-300">→</div>;
}

// ── Student card ─────────────────────────────────────────────────────
function StudentCard({ group }: { group: StudentGroup }) {
  const initials = group.studentName
    .trim()
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const semKeys = ["1", "2", "3", "4"];

  return (
    <div className="card p-5">
      {/* Student header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 text-xs font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div>
          <div className="font-bold text-sm text-slate-900 tracking-wide">
            {group.studentName.toUpperCase()}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {group.registerNumber}
            <span className="ml-2 font-sans">Batch : {group.batchName}</span>
            {group.specializationName && (
              <span className="ml-1.5 font-sans">· {group.specializationName}</span>
            )}
          </div>
        </div>
      </div>

      {/* Semester charts row */}
      <div className="flex items-start gap-2 overflow-x-auto pb-1">
        {semKeys.map((key, idx) => (
          <div key={key} className="flex items-start gap-2">
            <SemesterColumn semKey={key} record={group.semesters[key]} />
            {idx < semKeys.length - 1 && <Arrow />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { key: "D", label: "D – Dominance", color: DISC_COLORS.D },
    { key: "I", label: "I – Influence", color: DISC_COLORS.I },
    { key: "S", label: "S – Steadiness", color: DISC_COLORS.S },
    { key: "C", label: "C – Conscientiousness", color: DISC_COLORS.C },
  ];
  return (
    <div className="flex gap-4 flex-wrap">
      {items.map(({ key, label, color }) => (
        <div key={key} className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
          {label}
        </div>
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────
export default function Analytics() {
  const [allStudents, setAllStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpec, setFilterSpec] = useState("All");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([
          publicApi.get("/student/semester/1"),
          publicApi.get("/student/semester/2"),
          publicApi.get("/student/semester/3"),
          publicApi.get("/student/semester/4"),
        ]);

        const combined: StudentRecord[] = [];
        results.forEach((result, idx) => {
          if (result.status === "fulfilled") {
            const rows: StudentRecord[] = result.value.data;
            rows.forEach((r) => {
              combined.push({ ...r, semesterName: String(idx + 1) });
            });
          }
        });

        setAllStudents(combined);
      } catch (err: any) {
        setError(`Failed to load: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Group by registerNumber
  const grouped: Record<string, StudentGroup> = {};
  allStudents.forEach((s) => {
    const key = s.registerNumber;
    if (!grouped[key]) {
      grouped[key] = {
        registerNumber: s.registerNumber,
        studentName: s.studentName,
        batchName: s.batchName,
        specializationName: s.specializationName,
        semesters: {},
      };
    }
    grouped[key].semesters[s.semesterName] = s;
  });

  const groups = Object.values(grouped);

  const specs = ["All", ...Array.from(new Set(groups.map((g) => g.specializationName).filter(Boolean)))];

  const filtered = groups.filter((g) => {
    const matchSpec = filterSpec === "All" || g.specializationName === filterSpec;
    const matchSearch =
      !searchQuery.trim() ||
      g.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">DISC Analysis</h1>
        <p className="text-[13px] text-slate-500 mt-1">All semester comparison per student</p>
      </div>

      {/* Legend */}
      <div className="card px-4 py-3 mb-5">
        <Legend />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px] max-w-[280px]">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            width="14"
            height="14"
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
            placeholder="Search name or reg no…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field pl-8"
          />
        </div>

        <select
          value={filterSpec}
          onChange={(e) => setFilterSpec(e.target.value)}
          className="field w-auto"
        >
          {specs.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Specializations" : s}
            </option>
          ))}
        </select>

        {!loading && (
          <div className="px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {error && (
        <div className="px-3.5 py-2.5 rounded-lg bg-red-50 text-red-700 text-[13px] mb-4">
          ⚠ {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading all semester data…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">No students found</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(580px, 1fr))" }}>
          {filtered.map((group) => (
            <StudentCard key={group.registerNumber} group={group} />
          ))}
        </div>
      )}
    </Layout>
  );
}
