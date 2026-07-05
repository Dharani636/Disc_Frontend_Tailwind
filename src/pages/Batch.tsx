import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

export default function Batch() {
  const [batchName, setBatchName] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadData = async () => {
    const response = await api.get("/batch");
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const save = async () => {
    if (!batchName) return;
    await api.post("/batch", { batchName });
    setBatchName("");
    loadData();
  };

  const edit = (item: any) => {
    setEditingId(item.id);
    setEditingName(item.batchName);
  };

  const update = async (id: number) => {
    await api.put(`/batch/${id}`, { batchName: editingName });
    setEditingId(null);
    setEditingName("");
    loadData();
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete Batch?")) return;
    await api.delete(`/batch/${id}`);
    loadData();
  };

  return (
    <Layout>
      <h1 className="text-[22px] font-bold tracking-tight text-slate-900 mb-6">
        Batch Master
      </h1>

      <div className="card flex items-center gap-3 p-4 mb-5">
        <input
          placeholder="Batch"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
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
              <th className="th-cell">Batch</th>
              <th className="th-cell">Action</th>
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
                      autoFocus
                      className="field h-8 py-0"
                    />
                  ) : (
                    item.batchName
                  )}
                </td>
                <td className="td-cell">
                  <div className="flex gap-2">
                    {editingId === item.id ? (
                      <>
                        <button
                          className="btn-soft bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          onClick={() => update(item.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-soft bg-blue-50 text-blue-700 hover:bg-blue-100"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-soft bg-orange-50 text-orange-700 hover:bg-orange-100"
                          onClick={() => edit(item)}
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
                  No batches added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
