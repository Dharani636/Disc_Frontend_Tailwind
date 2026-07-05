import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import type { Student } from "../types/Student";

export default function Students() {
  const emptyStudent: Student = {
    registerNumber: "",
    studentName: "",
    batchName: "",
    semesterName: "",
    specializationName: "",
    jobPreferredName: "",
    dScore: 0,
    iScore: 0,
    sScore: 0,
    cScore: 0,
    assignment: "",
    status: "",
  };

  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student>(emptyStudent);
  const [editing, setEditing] = useState(false);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filterBatch, setFilterBatch] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [batches, setBatches] = useState<any[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  const loadStudents = async () => {
    try {
      const response = await api.get("/student");
      const sorted = response.data.sort((a: any, b: any) => {
        if (a.batchName !== b.batchName) {
          return a.batchName.localeCompare(b.batchName);
        }
        if (Number(a.semesterName) !== Number(b.semesterName)) {
          return Number(a.semesterName) - Number(b.semesterName);
        }
        return Number(a.registerNumber) - Number(b.registerNumber);
      });

      setStudents(sorted);

      const batchRes = await api.get("/batch");
      setBatches(batchRes.data);

      const semesterRes = await api.get("/semester");
      setSemesters(semesterRes.data);

      const specializationRes = await api.get("/specialization");
      setSpecializations(specializationRes.data);

      const jobRes = await api.get("/job-preferred");
      setJobs(jobRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAssignments = async (d: number, i: number, s: number, c: number) => {
    const min = Math.min(d, i, s, c);
    let endpoint = "/d";
    if (min === d) endpoint = "/d";
    else if (min === i) endpoint = "/i";
    else if (min === s) endpoint = "/s";
    else endpoint = "/c";

    try {
      const response = await api.get(endpoint);
      setAssignments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadAssignments(student.dScore, student.iScore, student.sScore, student.cScore);
  }, [student.dScore, student.iScore, student.sScore, student.cScore]);

  const saveStudent = async () => {
    if (
      !student.registerNumber ||
      !student.studentName ||
      !student.batchName ||
      !student.semesterName ||
      !student.specializationName ||
      !student.jobPreferredName ||
      !student.assignment ||
      !student.status
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!editing && !student.assignment) {
      alert("Select Assignment");
      return;
    }

    if (!student.dScore && student.dScore !== 0) { alert("Enter D Score"); return; }
    if (!student.iScore && student.iScore !== 0) { alert("Enter I Score"); return; }
    if (!student.sScore && student.sScore !== 0) { alert("Enter S Score"); return; }
    if (!student.cScore && student.cScore !== 0) { alert("Enter C Score"); return; }

    try {
      if (editing) {
        await api.put(`/student/${student.registerNumber}`, student);
        alert("Student Updated");
      } else {
        await api.post("/student", student);
        alert("Student Added");
      }
      setStudent(emptyStudent);
      setEditing(false);
      loadStudents();
    } catch (error) {
      console.log(error);
      alert("Error Saving Student");
    }
  };

  const editStudent = async (selected: Student) => {
    setStudent({
      ...selected,
      assignment: selected.assignment ?? "",
    });

    await loadAssignments(
      Number(selected.dScore),
      Number(selected.iScore),
      Number(selected.sScore),
      Number(selected.cScore)
    );

    setEditing(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const promoteStudent = async (student: Student) => {
    const nextSemester = Number(student.semesterName) + 1;

    if (nextSemester > 4) {
      alert("Student already completed all semesters.");
      return;
    }

    try {
      await api.post("/student/promote", {
        registerNumber: student.registerNumber,
        semesterName: nextSemester.toString(),
      });

      alert("Student promoted successfully.");
      loadStudents();
    } catch (err: any) {
      alert(err.response?.data?.message ?? "Create the next semester first.");
    }
  };

  const deleteStudent = async (registerNumber: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Delete Student?")) return;
    try {
      await api.delete(`/student/${registerNumber}`);
      loadStudents();
    } catch (error) {
      alert("Delete Failed");
    }
  };

  const filteredStudents = students.filter((s) => {
    const batchMatch = filterBatch === "" || s.batchName === filterBatch;
    const semesterMatch = filterSemester === "" || s.semesterName === filterSemester;
    return batchMatch && semesterMatch;
  });

  return (
    <Layout>
      <h1 className="text-[22px] font-bold tracking-tight text-slate-900 mb-6">
        Student Management
      </h1>

      <div ref={formRef} className="card p-6 mb-6">
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-400 mb-4">
          {editing ? "Update Student" : "Add Student"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <input
            placeholder="Register Number"
            value={student.registerNumber}
            disabled={editing}
            onChange={(e) => setStudent({ ...student, registerNumber: e.target.value })}
            className="field disabled:bg-slate-100 disabled:text-slate-400"
          />

          <input
            placeholder="Student Name"
            value={student.studentName}
            onChange={(e) => setStudent({ ...student, studentName: e.target.value })}
            className="field"
          />

          <select
            value={student.batchName}
            onChange={(e) => setStudent({ ...student, batchName: e.target.value })}
            className="field"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.batchName}>
                {b.batchName}
              </option>
            ))}
          </select>

          <select
            value={student.semesterName}
            onChange={(e) => setStudent({ ...student, semesterName: e.target.value })}
            className="field"
          >
            <option value="">Select Semester</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.semesterName}>
                {s.semesterName}
              </option>
            ))}
          </select>

          <select
            value={student.specializationName}
            onChange={(e) => setStudent({ ...student, specializationName: e.target.value })}
            className="field"
          >
            <option value="">Select Specialization</option>
            {specializations.map((s) => (
              <option key={s.id} value={s.specializationName}>
                {s.specializationName}
              </option>
            ))}
          </select>

          <select
            value={student.jobPreferredName}
            onChange={(e) => setStudent({ ...student, jobPreferredName: e.target.value })}
            className="field"
          >
            <option value="">Select Job</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.jobName}>
                {j.jobName}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Enter D Score"
            value={student.dScore || ""}
            onChange={(e) => setStudent({ ...student, dScore: Number(e.target.value) })}
            className="field"
          />

          <input
            type="number"
            placeholder="Enter I Score"
            value={student.iScore || ""}
            onChange={(e) => setStudent({ ...student, iScore: Number(e.target.value) })}
            className="field"
          />

          <input
            type="number"
            placeholder="Enter S Score"
            value={student.sScore || ""}
            onChange={(e) => setStudent({ ...student, sScore: Number(e.target.value) })}
            className="field"
          />

          <input
            type="number"
            placeholder="Enter C Score"
            value={student.cScore || ""}
            onChange={(e) => setStudent({ ...student, cScore: Number(e.target.value) })}
            className="field"
          />

          <select
            value={student.assignment}
            onChange={(e) => setStudent({ ...student, assignment: e.target.value })}
            className="field"
          >
            <option value="">Select Assignment</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.activityName}>
                {a.activityName}
              </option>
            ))}
          </select>

          <input
            placeholder="Or Type New Assignment"
            value={student.assignment}
            onChange={(e) => setStudent({ ...student, assignment: e.target.value })}
            className="field"
          />

          <select
            value={student.status}
            onChange={(e) => setStudent({ ...student, status: e.target.value })}
            className="field"
          >
            <option value="">Select Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Not Submitted">Not Submitted</option>
          </select>
        </div>

        <div className="mt-5">
          <button className="btn-primary" onClick={saveStudent}>
            {editing ? "Update Student" : "Save Student"}
          </button>
          {editing && (
            <button
              className="btn-soft ml-3 h-10 px-4 bg-slate-100 text-slate-600 hover:bg-slate-200"
              onClick={() => {
                setStudent(emptyStudent);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 p-4 mb-5">
        <label className="text-sm font-semibold text-slate-600">Batch</label>
        <select
          value={filterBatch}
          onChange={(e) => setFilterBatch(e.target.value)}
          className="field w-[180px]"
        >
          <option value="">All Batch</option>
          {batches.map((b) => (
            <option key={b.id} value={b.batchName}>
              {b.batchName}
            </option>
          ))}
        </select>

        <label className="text-sm font-semibold text-slate-600">Semester</label>
        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="field w-[180px]"
        >
          <option value="">All Semesters</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.semesterName}>
              {s.semesterName}
            </option>
          ))}
        </select>

        {filterSemester && (
          <button
            onClick={() => {
              setFilterSemester("");
              setFilterBatch("");
            }}
            className="h-10 px-3.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[13px] font-semibold hover:bg-slate-50"
          >
            Clear
          </button>
        )}

        {(filterSemester || filterBatch) && (
          <span className="text-[13px] text-slate-400">
            Showing {filteredStudents.length} student
            {filteredStudents.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="table-shell">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="th-cell">Reg No</th>
                <th className="th-cell">Name</th>
                <th className="th-cell">Batch</th>
                <th className="th-cell">Semester</th>
                <th className="th-cell">Specialization</th>
                <th className="th-cell">Job</th>
                <th className="th-cell">Assignment</th>
                <th className="th-cell">Status</th>
                <th className="th-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.registerNumber} className="hover:bg-slate-50/70">
                  <td className="td-cell font-mono text-xs text-slate-500">{s.registerNumber}</td>
                  <td className="td-cell font-medium">{s.studentName}</td>
                  <td className="td-cell text-slate-500">{s.batchName}</td>
                  <td className="td-cell text-slate-500">{s.semesterName}</td>
                  <td className="td-cell">{s.specializationName}</td>
                  <td className="td-cell text-slate-500">{s.jobPreferredName}</td>
                  <td className="td-cell">{s.assignment}</td>
                  <td className="td-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold
                        ${
                          s.status?.toLowerCase() === "submitted"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="td-cell">
                    <div className="flex gap-2">
                      <button
                        className="btn-soft bg-orange-50 text-orange-700 hover:bg-orange-100"
                        onClick={() => editStudent(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-soft bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        onClick={() => promoteStudent(s)}
                      >
                        Promote
                      </button>
                      <button
                        className="btn-soft bg-red-50 text-red-700 hover:bg-red-100"
                        onClick={(e) => deleteStudent(s.registerNumber, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={9} className="td-cell text-center text-slate-400 py-8">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
