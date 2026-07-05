import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

const TAB_STYLES: Record<string, { active: string; text: string }> = {
  D: { active: "bg-disc-d", text: "text-disc-d" },
  I: { active: "bg-disc-i", text: "text-disc-i" },
  S: { active: "bg-disc-s", text: "text-disc-s" },
  C: { active: "bg-disc-c", text: "text-disc-c" },
};

const TAB_LABELS: Record<string, string> = {
  D: "D — Dominance",
  I: "I — Influence",
  S: "S — Steadiness",
  C: "C — Conscientiousness",
};

export default function DISCActivities() {
  const [activeTab, setActiveTab] = useState("D");
  const [activityName, setActivityName] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadData = async (type: string) => {
    const response = await api.get(`/${type.toLowerCase()}`);
    setData(response.data);
  };

  useEffect(() => {
    loadData(activeTab);
    setEditingId(null);
  }, [activeTab]);

  const save = async () => {
    if (!activityName) return;
    await api.post(`/${activeTab.toLowerCase()}`, { activityName });
    setActivityName("");
    loadData(activeTab);
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditingName(item.activityName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id: number) => {
    if (!editingName) return;
    await api.put(`/${activeTab.toLowerCase()}/${id}`, { activityName: editingName });
    cancelEdit();
    loadData(activeTab);
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this activity?")) return;
    await api.delete(`/${activeTab.toLowerCase()}/${id}`);
    loadData(activeTab);
  };

  return (
    <Layout>
      <h1 className="text-[22px] font-bold tracking-tight text-slate-900 mb-6">
        DISC Activities
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {["D", "I", "S", "C"].map((tab) => {
          const style = TAB_STYLES[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-[13px] transition
                ${
                  isActive
                    ? `${style.active} text-white font-bold shadow-sm`
                    : `border border-slate-200 font-medium ${style.text} hover:bg-slate-50`
                }`}
            >
              {tab}
            </button>
          );
        })}
        <span className="ml-2 self-center text-[13px] text-slate-400">
          {TAB_LABELS[activeTab]}
        </span>
      </div>

      <div className="card flex items-center gap-3 p-4 mb-5">
        <input
          placeholder="Activity Name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
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
              <th className="th-cell">Activity</th>
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
                    item.activityName
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
                  No activities added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
