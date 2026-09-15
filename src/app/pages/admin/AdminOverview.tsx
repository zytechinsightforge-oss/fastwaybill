import { MOCK_TRIPS, MOCK_TRANSACTIONS } from "../../data/constants";

const KPI = [
  { label: "Total Revenue", value: "₦2,847,500", change: "+18.4%", up: true, icon: "💰", sub: "This month" },
  { label: "Active Users", value: "1,284", change: "+12.1%", up: true, icon: "👥", sub: "Registered" },
  { label: "Rides Completed", value: "3,921", change: "+9.3%", up: true, icon: "🚖", sub: "All time" },
  { label: "Dispatches", value: "1,640", change: "+22.7%", up: true, icon: "📦", sub: "Delivered" },
  { label: "Active Drivers", value: "87", change: "-3.2%", up: false, icon: "🧑‍✈️", sub: "Online now: 24" },
  { label: "Wallet Balances", value: "₦14.2M", change: "+5.6%", up: true, icon: "💳", sub: "Across all users" },
  { label: "Avg Trip Value", value: "₦1,043", change: "+2.8%", up: true, icon: "📊", sub: "Per completed trip" },
  { label: "Cancellations", value: "4.2%", change: "-1.1%", up: true, icon: "❌", sub: "Cancel rate" },
];

const RECENT_ORDERS = [
  { id: "ORD-9921", user: "Zakariya S.", type: "Ride", route: "Lekki → VI", amount: 800, status: "completed", time: "2m ago" },
  { id: "ORD-9920", user: "Amina T.", type: "Dispatch", route: "Ikeja → Apapa", amount: 1600, status: "in-transit", time: "5m ago" },
  { id: "ORD-9919", user: "Chukwuemeka O.", type: "Ride", route: "Yaba → Surulere", amount: 750, status: "completed", time: "8m ago" },
  { id: "ORD-9918", user: "Fatima L.", type: "Dispatch", route: "Ajah → CMS", amount: 1400, status: "completed", time: "14m ago" },
  { id: "ORD-9917", user: "Bola A.", type: "Ride", route: "Festac → Oshodi", amount: 750, status: "cancelled", time: "21m ago" },
  { id: "ORD-9916", user: "Taiwo F.", type: "Ride", route: "Island → Mainland", amount: 1200, status: "completed", time: "30m ago" },
];

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-green-500/15 text-green-400",
  "in-transit": "bg-blue-500/15 text-blue-400",
  cancelled: "bg-red-500/15 text-red-400",
  pending: "bg-yellow-500/15 text-yellow-400",
};

const ALERTS = [
  { level: "warn", msg: "Driver Emeka O. has 3 consecutive cancellations today" },
  { level: "info", msg: "Paystack balance low — ₦48,000 remaining for transfers" },
  { level: "warn", msg: "Surge detected: Lekki → VI zone (3.2× demand)" },
  { level: "ok", msg: "All edge functions healthy — avg response 142ms" },
];

export default function AdminOverview() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-sm mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>
          FastWaybill live operations — {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map(k => (
          <div key={k.label} className="rounded-2xl p-5" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{k.icon}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.up ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                {k.change}
              </span>
            </div>
            <p className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{k.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: "#BAD8F7", opacity: 0.6 }}>{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#BAD8F7", opacity: 0.35 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="rounded-2xl p-5" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>System Alerts</p>
        <div className="space-y-2">
          {ALERTS.map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-sm shrink-0">
                {a.level === "warn" ? "⚠️" : a.level === "ok" ? "✅" : "ℹ️"}
              </span>
              <p className="text-sm" style={{ color: "#BAD8F7", opacity: 0.8 }}>{a.msg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(186,216,247,0.06)" }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>Live Orders</p>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(245,130,13,0.15)", color: "#F5820D" }}>Auto-refreshing</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(186,216,247,0.05)" }}>
                {["Order ID", "Customer", "Type", "Route", "Amount", "Status", "Time"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: i < RECENT_ORDERS.length - 1 ? "1px solid rgba(186,216,247,0.04)" : "none" }}
                  className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "#F5820D" }}>{o.id}</td>
                  <td className="px-4 py-3 text-white">{o.user}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: o.type === "Ride" ? "rgba(59,108,183,0.2)" : "rgba(245,130,13,0.15)", color: o.type === "Ride" ? "#BAD8F7" : "#F5820D" }}>
                      {o.type}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#BAD8F7", opacity: 0.7 }}>{o.route}</td>
                  <td className="px-4 py-3 font-semibold text-white">₦{o.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
