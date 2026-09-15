import { useState } from "react";

const ORDERS = [
  { id: "ORD-9921", user: "Zakariya S.", driver: "Emeka O.", type: "Ride", from: "Lekki Phase 1", to: "Victoria Island", amount: 800, status: "completed", date: "2026-08-27 10:58" },
  { id: "ORD-9920", user: "Amina T.", driver: "Chidi A.", type: "Dispatch", from: "Ikeja", to: "Apapa", amount: 1600, status: "in-transit", date: "2026-08-27 10:05" },
  { id: "ORD-9919", user: "Chukwuemeka O.", driver: "Tunde B.", type: "Ride", from: "Yaba", to: "Surulere", amount: 750, status: "completed", date: "2026-08-27 09:52" },
  { id: "ORD-9918", user: "Fatima L.", driver: "Bola K.", type: "Dispatch", from: "Ajah", to: "CMS", amount: 1400, status: "completed", date: "2026-08-27 09:14" },
  { id: "ORD-9917", user: "Bola A.", driver: "—", type: "Ride", from: "Festac", to: "Oshodi", amount: 750, status: "cancelled", date: "2026-08-27 08:43" },
  { id: "ORD-9916", user: "Taiwo F.", driver: "Emeka O.", type: "Ride", from: "Island", to: "Mainland", amount: 1200, status: "completed", date: "2026-08-27 08:00" },
  { id: "ORD-9915", user: "Ngozi E.", driver: "Adaeze M.", type: "Dispatch", from: "VI", to: "Lekki", amount: 600, status: "completed", date: "2026-08-26 22:15" },
  { id: "ORD-9914", user: "Musa I.", driver: "—", type: "Ride", from: "Ikorodu", to: "Yaba", amount: 1100, status: "pending", date: "2026-08-26 21:50" },
];

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-green-500/15 text-green-400",
  "in-transit": "bg-blue-500/15 text-blue-400",
  cancelled: "bg-red-500/15 text-red-400",
  pending: "bg-yellow-500/15 text-yellow-400",
};

export default function AdminOrders() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter(o => {
    const matchType = typeFilter === "all" || o.type.toLowerCase() === typeFilter;
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const total = ORDERS.reduce((a, o) => a + (o.status !== "cancelled" ? o.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-sm mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>All rides and dispatches</p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "#BAD8F7", opacity: 0.4 }}>Total Revenue (shown)</p>
          <p className="text-lg font-bold" style={{ color: "#F5820D", fontFamily: "Outfit, sans-serif" }}>₦{total.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", val: ORDERS.length, color: "text-white" },
          { label: "Completed", val: ORDERS.filter(o => o.status === "completed").length, color: "text-green-400" },
          { label: "In Transit", val: ORDERS.filter(o => o.status === "in-transit").length, color: "text-blue-400" },
          { label: "Cancelled", val: ORDERS.filter(o => o.status === "cancelled").length, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
            <p className={`text-xl font-bold ${s.color}`} style={{ fontFamily: "Outfit, sans-serif" }}>{s.val}</p>
            <p className="text-xs mt-1" style={{ color: "#BAD8F7", opacity: 0.4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search order ID or customer..."
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl text-sm outline-none text-white"
          style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.1)" }} />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.1)", color: "#BAD8F7" }}>
          <option value="all">All Types</option>
          <option value="ride">Ride</option>
          <option value="dispatch">Dispatch</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.1)", color: "#BAD8F7" }}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-transit">In Transit</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(186,216,247,0.06)" }}>
                {["Order ID", "Customer", "Driver", "Type", "Route", "Amount", "Status", "Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(186,216,247,0.04)" : "none" }} className="hover:bg-white/2">
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "#F5820D" }}>{o.id}</td>
                  <td className="px-4 py-3 text-white">{o.user}</td>
                  <td className="px-4 py-3" style={{ color: "#BAD8F7", opacity: 0.6 }}>{o.driver}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: o.type === "Ride" ? "rgba(59,108,183,0.2)" : "rgba(245,130,13,0.15)", color: o.type === "Ride" ? "#BAD8F7" : "#F5820D" }}>
                      {o.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#BAD8F7", opacity: 0.6 }}>{o.from} → {o.to}</td>
                  <td className="px-4 py-3 font-semibold text-white">₦{o.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
