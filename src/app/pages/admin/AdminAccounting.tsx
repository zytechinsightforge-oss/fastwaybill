import { useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const PNL = [
  { month: "Mar", revenue: 1240000, payout: 890000, fees: 62000, net: 288000 },
  { month: "Apr", revenue: 1580000, payout: 1134000, fees: 79000, net: 367000 },
  { month: "May", revenue: 1920000, payout: 1382000, fees: 96000, net: 442000 },
  { month: "Jun", revenue: 2140000, payout: 1540000, fees: 107000, net: 493000 },
  { month: "Jul", revenue: 2480000, payout: 1786000, fees: 124000, net: 570000 },
  { month: "Aug", revenue: 2847500, payout: 2050000, fees: 142375, net: 655125 },
];

const TXNS = [
  { id: "TXN-9901", type: "credit", desc: "Paystack Top-up — Zakariya S.", amount: 5000, fee: 0, net: 5000, date: "2026-08-27 10:42", status: "success" },
  { id: "TXN-9900", type: "debit", desc: "Driver Payout — Emeka O.", amount: 12400, fee: 53, net: 12347, date: "2026-08-27 10:15", status: "success" },
  { id: "TXN-9899", type: "credit", desc: "Ride Revenue — ORD-9921", amount: 800, fee: 0, net: 800, date: "2026-08-27 09:58", status: "success" },
  { id: "TXN-9898", type: "debit", desc: "Paystack Transfer — Amina T.", amount: 15000, fee: 53, net: 14947, date: "2026-08-27 09:30", status: "success" },
  { id: "TXN-9897", type: "credit", desc: "Dispatch Revenue — ORD-9920", amount: 1600, fee: 0, net: 1600, date: "2026-08-27 09:05", status: "success" },
  { id: "TXN-9896", type: "debit", desc: "Driver Payout — Chidi A.", amount: 9800, fee: 53, net: 9747, date: "2026-08-27 08:44", status: "success" },
  { id: "TXN-9895", type: "credit", desc: "Paystack Top-up — Taiwo F.", amount: 20000, fee: 0, net: 20000, date: "2026-08-27 08:12", status: "success" },
  { id: "TXN-9894", type: "debit", desc: "Paystack Transfer — Bola A.", amount: 8000, fee: 53, net: 7947, date: "2026-08-26 22:30", status: "pending" },
];

const SUMMARY = [
  { label: "Gross Revenue", value: "₦2,847,500", sub: "Aug 2026", color: "#F5820D" },
  { label: "Driver Payouts", value: "₦2,050,000", sub: "72% of gross", color: "#3B6CB7" },
  { label: "Platform Fees", value: "₦142,375", sub: "Paystack charges", color: "#ef4444" },
  { label: "Net Profit", value: "₦655,125", sub: "23% margin", color: "#22c55e" },
];

const PAYSTACK_BALANCE = { available: 48200, ledger: 655125, pending: 14947 };

function PnLBar({ data }: { data: typeof PNL }) {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="space-y-3">
      {data.slice(-5).map(d => (
        <div key={d.month}>
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: "#BAD8F7", opacity: 0.6, fontFamily: "JetBrains Mono, monospace" }}>{d.month}</span>
            <div className="flex gap-4">
              <span style={{ color: "#F5820D" }}>₦{(d.revenue / 1000).toFixed(0)}k</span>
              <span style={{ color: "#22c55e" }}>+₦{(d.net / 1000).toFixed(0)}k</span>
            </div>
          </div>
          <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="absolute h-full rounded-full" style={{ width: `${(d.revenue / max) * 100}%`, background: "#F5820D", opacity: 0.4 }} />
            <div className="absolute h-full rounded-full" style={{ width: `${(d.net / max) * 100}%`, background: "#22c55e" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAccounting() {
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const filtered = filter === "all" ? TXNS : TXNS.filter(t => t.type === filter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Accounting</h1>
        <p className="text-sm mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>Financial overview, P&L, and transaction ledger</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY.map(s => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
            <div className="w-2 h-2 rounded-full mb-3" style={{ background: s.color }} />
            <p className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: s.color }}>{s.value}</p>
            <p className="text-xs font-medium text-white mt-1">{s.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#BAD8F7", opacity: 0.4 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Two col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* P&L trend */}
        <div className="rounded-2xl p-6" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>Monthly P&L Trend</p>
          <PnLBar data={PNL} />
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-1.5 rounded-full opacity-40" style={{ background: "#F5820D" }} /><span style={{ color: "#BAD8F799" }}>Gross Revenue</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-1.5 rounded-full" style={{ background: "#22c55e" }} /><span style={{ color: "#BAD8F799" }}>Net Profit</span></div>
          </div>
        </div>

        {/* Paystack balance */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>Paystack Balance</p>
          <div className="space-y-3">
            {[
              { label: "Available Balance", val: `₦${PAYSTACK_BALANCE.available.toLocaleString()}`, color: "#22c55e", note: "Ready for transfers" },
              { label: "Ledger Balance", val: `₦${PAYSTACK_BALANCE.ledger.toLocaleString()}`, color: "#F5820D", note: "Total platform earnings" },
              { label: "Pending Settlements", val: `₦${PAYSTACK_BALANCE.pending.toLocaleString()}`, color: "#eab308", note: "Processing" },
            ].map(b => (
              <div key={b.label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div>
                  <p className="text-sm font-medium text-white">{b.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#BAD8F7", opacity: 0.4 }}>{b.note}</p>
                </div>
                <p className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif", color: b.color }}>{b.val}</p>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(245,130,13,0.08)", color: "#F5820D", border: "1px solid rgba(245,130,13,0.2)" }}>
            ⚠️ Available balance is low. Top up Paystack to enable withdrawals.
          </div>
        </div>
      </div>

      {/* Transaction ledger */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(186,216,247,0.06)" }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>Transaction Ledger</p>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
            {(["all", "credit", "debit"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all"
                style={filter === f ? { background: "#F5820D", color: "#fff" } : { color: "#BAD8F799" }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(186,216,247,0.05)" }}>
                {["ID", "Description", "Amount", "Fee", "Net", "Date", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(186,216,247,0.04)" : "none" }} className="hover:bg-white/2">
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "#F5820D" }}>{t.id}</td>
                  <td className="px-4 py-3" style={{ color: "#BAD8F7", opacity: 0.8 }}>{t.desc}</td>
                  <td className={`px-4 py-3 font-semibold ${t.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                    {t.type === "credit" ? "+" : "-"}₦{t.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#BAD8F7", opacity: 0.4 }}>
                    {t.fee > 0 ? `₦${t.fee}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">₦{t.net.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#BAD8F7", opacity: 0.4, fontFamily: "JetBrains Mono, monospace" }}>{t.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.status === "success" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                      {t.status}
                    </span>
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
