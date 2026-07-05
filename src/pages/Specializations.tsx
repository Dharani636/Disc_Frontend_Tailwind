import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function Specializations() {
  const [specializationName, setSpecializationName] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadData = async () => {
    const response = await api.get("/specialization");
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const save = async () => {
    if (!specializationName) return;
    await api.post("/specialization", { specializationName });
    setSpecializationName("");
    loadData();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditingName(item.specializationName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id: number) => {
    if (!editingName) return;
    await api.put(`/specialization/${id}`, { specializationName: editingName });
    cancelEdit();
    loadData();
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this specialization?")) return;
    await api.delete(`/specialization/${id}`);
    loadData();
  };

  return (
    <Layout>
      <h1 className="text-[22px] font-bold tracking-tight text-slate-900 mb-6">
        Specialization Master
      </h1>

      <div className="card flex items-center gap-3 p-4 mb-5">
        <input
          placeholder="Specialization"
          value={specializationName}
          onChange={(e) => setSpecializationName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="field flex-1"
        />
        <button className="btn-primary" onClick={save}>
          Save
        </button>
      </div>

      <div className="table-shell">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="th-cell">ID</th>
              <th className="th-cell">Name</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="td-cell">{item.id}</td>
                <td className="td-cell">
                  {editingId === item.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item.id)}
                      autoFocus
                      className="field h-8 py-0"
                    />
                  ) : (
                    item.specializationName
                  )}
                </td>
                <td className="td-cell">
                  <div className="flex gap-2">
                    {editingId === item.id ? (
                      <>
                        <button
                          className="btn-soft bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          onClick={() => saveEdit(item.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-soft bg-blue-50 text-blue-700 hover:bg-blue-100"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-soft bg-blue-50 text-blue-700 hover:bg-blue-100"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-soft bg-red-50 text-red-700 hover:bg-red-100"
                          onClick={() => remove(item.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={3} className="td-cell text-center text-slate-400 py-8">
                  No specializations added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
