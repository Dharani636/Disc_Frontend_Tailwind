import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function Dashboard() {
  const [studentCount, setStudentCount] = useState<number>(0);
  const [batchCount, setBatchCount] = useState<number>(0);
  const [semesterCount, setSemesterCount] = useState<number>(0);
  const [specializationCount, setSpecializationCount] = useState<number>(0);
  const [jobCount, setJobCount] = useState<number>(0);

  const loadData = async () => {
    try {
      const students = await api.get("/student");
      const batch = await api.get("/batch");
      setBatchCount(batch.data.length);

      const semesters = await api.get("/semester");
      const specializations = await api.get("/specialization");
      const jobs = await api.get("/job-preferred");

      setStudentCount(students.data.length);
      setSemesterCount(semesters.data.length);
      setSpecializationCount(specializations.data.length);
      setJobCount(jobs.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cards = [
    { label: "Total Students", value: studentCount, icon: "👥" },
    { label: "Total Batch", value: batchCount, icon: "🗂️" },
    { label: "Total Semesters", value: semesterCount, icon: "📚" },
    { label: "Total Specializations", value: specializationCount, icon: "🎯" },
    { label: "Total Jobs", value: jobCount, icon: "💼" },
  ];

  return (
    <Layout>
      <h1 className="text-[22px] font-bold tracking-tight text-slate-900 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card p-5 transition hover:shadow-card-hover">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-400">
                {c.label}
              </h3>
              <span className="text-lg opacity-70">{c.icon}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-600">
              {c.value}
            </h1>
          </div>
        ))}
      </div>

      <div className="card p-7">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">
          Welcome to Seminar Maintenance System
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Manage Students, Semesters, Specializations, Job Preferences, DISC
          Activities, and Analytics.
        </p>
      </div>
    </Layout>
  );
}
