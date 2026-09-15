import { useState } from "react";

const USERS = [
  { id: "USR-001", name: "Zakariya Samaila", email: "zytechinsightforge@gmail.com", phone: "+2348012345678", joined: "2026-08-01", rides: 12, spent: 14800, wallet: 24750, status: "active" },
  { id: "USR-002", name: "Amina Tukur", email: "amina.t@gmail.com", phone: "+2348023456789", joined: "2026-08-05", rides: 8, spent: 9600, wallet: 5200, status: "active" },
  { id: "USR-003", name: "Chukwuemeka Okafor", email: "chukwu@yahoo.com", phone: "+2348034567890", joined: "2026-08-10", rides: 21, spent: 28400, wallet: 1800, status: "active" },
  { id: "USR-004", name: "Fatima Lawal", email: "fatima.l@gmail.com", phone: "+2348045678901", joined: "2026-08-12", rides: 5, spent: 6200, wallet: 12000, status: "active" },
  { id: "USR-005", name: "Bola Adeyemi", email: "bola.a@gmail.com", phone: "+2348056789012", joined: "2026-08-15", rides: 3, spent: 2800, wallet: 0, status: "suspended" },
  { id: "USR-006", name: "Taiwo Fadahunsi", email: "taiwo.f@hotmail.com", phone: "+2348067890123", joined: "2026-08-18", rides: 14, spent: 17600, wallet: 8400, status: "active" },
  { id: "USR-007", name: "Ngozi Eze", email: "ngozi.e@gmail.com", phone: "+2348078901234", joined: "2026-08-20", rides: 7, spent: 8100, wallet: 3200, status: "active" },
  { id: "USR-008", name: "Musa Ibrahim", email: "musa.i@gmail.com", phone: "+2348089012345", joined: "2026-08-22", rides: 2, spent: 1750, wallet: 500, status: "inactive" },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>{USERS.length} registered users</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#F5820D" }}>
          Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", val: USERS.filter(u => u.status === "active").length, color: "#22c55e" },
          { label: "Suspended", val: USERS.filter(u => u.status === "suspended").length, color: "#ef4444" },
          { label: "Inactive", val: USERS.filter(u => u.status === "inactive").length, color: "#6b7280" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
            <p className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: s.color }}>{s.val}</p>
            <p className="text-xs mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & filter */}
      <div className="flex gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none"
          style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.1)", color: "white" }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.1)", color: "#BAD8F7" }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(186,216,247,0.06)" }}>
                {["User", "Contact", "Joined", "Rides", "Spent", "Wallet", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(186,216,247,0.04)" : "none" }} className="hover:bg-white/2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1B3A7A" }}>
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{u.name}</p>
                        <p className="text-xs" style={{ color: "#F5820D", fontFamily: "JetBrains Mono, monospace" }}>{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs" style={{ color: "#BAD8F7", opacity: 0.7 }}>{u.email}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{u.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#BAD8F7", opacity: 0.5 }}>{u.joined}</td>
                  <td className="px-4 py-3 text-white font-medium">{u.rides}</td>
                  <td className="px-4 py-3 text-white font-semibold">₦{u.spent.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "#F5820D" }}>₦{u.wallet.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.status === "active" ? "bg-green-500/15 text-green-400" : u.status === "suspended" ? "bg-red-500/15 text-red-400" : "bg-white/10 text-white/40"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-all" style={{ color: "#BAD8F799" }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
