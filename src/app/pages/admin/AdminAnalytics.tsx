import { useState } from "react";

const PERIODS = ["7D", "30D", "90D", "1Y"];

const REVENUE_DATA = [
  { day: "Mon", rides: 142000, dispatch: 98000 },
  { day: "Tue", rides: 168000, dispatch: 112000 },
  { day: "Wed", rides: 155000, dispatch: 134000 },
  { day: "Thu", rides: 189000, dispatch: 121000 },
  { day: "Fri", rides: 224000, dispatch: 167000 },
  { day: "Sat", rides: 261000, dispatch: 198000 },
  { day: "Sun", rides: 198000, dispatch: 143000 },
];

const ZONE_DATA = [
  { zone: "Lekki → VI", trips: 892, revenue: 713600, pct: 88 },
  { zone: "Island → Mainland", trips: 741, revenue: 1036200, pct: 73 },
  { zone: "Ikeja → Surulere", trips: 634, revenue: 602300, pct: 62 },
  { zone: "Ajah → CMS", trips: 521, revenue: 729400, pct: 51 },
  { zone: "Festac → Oshodi", trips: 418, revenue: 313500, pct: 41 },
  { zone: "Yaba → Ikorodu", trips: 312, revenue: 343200, pct: 31 },
];

const USER_GROWTH = [
  { month: "Mar", users: 340 },
  { month: "Apr", users: 520 },
  { month: "May", users: 710 },
  { month: "Jun", users: 890 },
  { month: "Jul", users: 1040 },
  { month: "Aug", users: 1284 },
];

const DRIVER_STATS = [
  { name: "Emeka O.", trips: 124, rating: 4.9, earnings: "₦186,000", status: "online" },
  { name: "Chidi A.", trips: 108, rating: 4.8, earnings: "₦162,000", status: "online" },
  { name: "Tunde B.", trips: 97, rating: 4.7, earnings: "₦145,500", status: "offline" },
  { name: "Bola K.", trips: 91, rating: 4.9, earnings: "₦136,500", status: "online" },
  { name: "Adaeze M.", trips: 84, rating: 4.6, earnings: "₦126,000", status: "busy" },
];

function BarChart({ data }: { data: typeof REVENUE_DATA }) {
  const maxVal = Math.max(...data.map(d => d.rides + d.dispatch));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map(d => {
        const total = d.rides + d.dispatch;
        const ridePct = (d.rides / maxVal) * 100;
        const dispPct = (d.dispatch / maxVal) * 100;
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "120px" }}>
              <div className="w-full rounded-t-sm transition-all" style={{ height: `${ridePct}%`, background: "#F5820D", opacity: 0.9 }} />
              <div className="w-full rounded-b-sm" style={{ height: `${dispPct * 0.6}%`, background: "#3B6CB7", opacity: 0.7 }} />
            </div>
            <span className="text-xs" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data }: { data: typeof USER_GROWTH }) {
  const max = Math.max(...data.map(d => d.users));
  const min = Math.min(...data.map(d => d.users));
  const w = 100 / (data.length - 1);
  const points = data.map((d, i) => {
    const x = i * w;
    const y = 100 - ((d.users - min) / (max - min)) * 85;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative h-32">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5820D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F5820D" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 100,100`} fill="url(#lineGrad)" />
        <polyline points={points} fill="none" stroke="#F5820D" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
          const x = i * w;
          const y = 100 - ((d.users - min) / (max - min)) * 85;
          return <circle key={i} cx={x} cy={y} r="1.5" fill="#F5820D" vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map(d => (
          <span key={d.month} className="text-xs" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("7D");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>Performance insights across all services</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#0D1F47" }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={period === p ? { background: "#F5820D", color: "#fff" } : { color: "#BAD8F799" }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue chart */}
      <div className="rounded-2xl p-6" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>Revenue Breakdown</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>₦1,337,000</p>
            <p className="text-xs mt-1" style={{ color: "#22c55e" }}>+18.4% vs last {period}</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ background: "#F5820D" }} /><span style={{ color: "#BAD8F799" }}>Rides</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ background: "#3B6CB7" }} /><span style={{ color: "#BAD8F799" }}>Dispatch</span></div>
          </div>
        </div>
        <BarChart data={REVENUE_DATA} />
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* User growth */}
        <div className="rounded-2xl p-6" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>User Growth</p>
          <p className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>1,284 users</p>
          <LineChart data={USER_GROWTH} />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "New This Month", val: "244" },
              { label: "Retention Rate", val: "78%" },
              { label: "Avg Sessions/Week", val: "4.2" },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="font-bold text-white text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>{s.val}</p>
                <p className="text-xs mt-0.5" style={{ color: "#BAD8F7", opacity: 0.4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top zones */}
        <div className="rounded-2xl p-6" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>Top Routes by Revenue</p>
          <div className="space-y-3">
            {ZONE_DATA.map(z => (
              <div key={z.zone}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "#BAD8F7", opacity: 0.8 }}>{z.zone}</span>
                  <span className="font-semibold text-white">₦{z.revenue.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${z.pct}%`, background: "linear-gradient(90deg, #F5820D, #3B6CB7)" }} />
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#BAD8F7", opacity: 0.35 }}>{z.trips} trips</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top drivers */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(186,216,247,0.06)" }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>Top Performing Drivers</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(186,216,247,0.05)" }}>
              {["Driver", "Trips", "Rating", "Earnings", "Status"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DRIVER_STATS.map((d, i) => (
              <tr key={d.name} style={{ borderBottom: i < DRIVER_STATS.length - 1 ? "1px solid rgba(186,216,247,0.04)" : "none" }} className="hover:bg-white/2">
                <td className="px-6 py-3 text-white font-medium">{d.name}</td>
                <td className="px-6 py-3" style={{ color: "#BAD8F7", opacity: 0.7 }}>{d.trips}</td>
                <td className="px-6 py-3 text-yellow-400">{"★".repeat(Math.floor(d.rating))} {d.rating}</td>
                <td className="px-6 py-3 font-semibold text-white">{d.earnings}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${d.status === "online" ? "bg-green-500/15 text-green-400" : d.status === "busy" ? "bg-yellow-500/15 text-yellow-400" : "bg-white/10 text-white/40"}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
