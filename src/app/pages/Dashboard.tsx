import { Link } from "react-router";
import { MOCK_TRIPS, MOCK_TRANSACTIONS } from "../data/constants";

const QUICK_ACTIONS = [
  { icon: "🚖", label: "Book Ride", to: "/ride", color: "#1B3A7A" },
  { icon: "📦", label: "Send Parcel", to: "/dispatch", color: "#F5820D" },
  { icon: "📡", label: "Track", to: "/track", color: "#3B6CB7" },
  { icon: "💳", label: "Wallet", to: "/wallet", color: "#22c55e" },
];

export default function Dashboard() {
  const recentTrips = MOCK_TRIPS.slice(0, 4);
  const recentTx = MOCK_TRANSACTIONS.slice(0, 3);

  return (
    <div className="pt-20 pb-20 md:pb-8 min-h-screen px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#BAD8F7]/50 text-sm mb-1">Good morning 👋</p>
          <h1 className="font-outfit text-3xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
            Chukwuemeka O.
          </h1>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1B3A7A] flex items-center justify-center text-2xl border-2 border-[#F5820D]">👤</div>
      </div>

      {/* Wallet card */}
      <div className="wallet-card rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "#F5820D", filter: "blur(60px)", transform: "translate(30%, -30%)" }} />
        <p className="text-[#BAD8F7]/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>FastWallet Balance</p>
        <p className="font-outfit text-5xl font-900 text-white mb-4" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
          ₦24,<span className="text-[#F5820D]">750</span>
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/wallet" className="btn-primary px-6 py-2.5 rounded-xl text-sm">+ Top Up</Link>
          <Link to="/wallet" className="btn-outline px-6 py-2.5 rounded-xl text-sm">Withdraw</Link>
          <Link to="/wallet" className="btn-outline px-6 py-2.5 rounded-xl text-sm">History</Link>
        </div>
        <div className="absolute bottom-4 right-6 text-right">
          <p className="text-[#BAD8F7]/40 text-xs">Account</p>
          <p className="text-white text-sm font-mono">0812 345 6789</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {QUICK_ACTIONS.map(a => (
          <Link key={a.to} to={a.to} className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-[#BAD8F7]/30 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: a.color + "33" }}>
              {a.icon}
            </div>
            <span className="text-white text-xs font-semibold">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Trips", val: "47", icon: "🚖" },
          { label: "Dispatches", val: "12", icon: "📦" },
          { label: "Saved (No Surge)", val: "₦8,400", icon: "💰" },
          { label: "Avg Rating Given", val: "4.8 ★", icon: "⭐" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className="font-outfit text-2xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>{s.val}</p>
            <p className="text-[#BAD8F7]/50 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent trips */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Activity</h3>
            <Link to="/track" className="text-[#F5820D] text-sm hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentTrips.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${t.type === "ride" ? "bg-[#1B3A7A]" : "bg-[#F5820D]/20"}`}>
                  {t.type === "ride" ? "🚖" : "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{t.from} → {t.to}</p>
                  <p className="text-[#BAD8F7]/50 text-xs">{t.date} · {t.driver}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${t.status === "cancelled" ? "text-red-400" : "text-white"}`}>
                    {t.status === "cancelled" ? "Cancelled" : `₦${t.amount.toLocaleString()}`}
                  </p>
                  {t.rating > 0 && <p className="text-[#F5820D] text-xs">{"★".repeat(t.rating)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Wallet Activity</h3>
            <Link to="/wallet" className="text-[#F5820D] text-sm hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentTx.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${t.type === "credit" ? "bg-green-500/15" : "bg-red-500/15"}`}>
                  {t.type === "credit" ? "↓" : "↑"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{t.desc}</p>
                  <p className="text-[#BAD8F7]/50 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>{t.date}</p>
                </div>
                <p className={`text-sm font-semibold shrink-0 ${t.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                  {t.type === "credit" ? "+" : "-"}₦{t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promo banner */}
      <div className="mt-6 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #F5820D, #D96A00)" }}>
        <div className="text-4xl">🎁</div>
        <div className="flex-1">
          <p className="text-white font-outfit font-700 text-lg" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>Refer & Earn ₦200</p>
          <p className="text-white/80 text-sm">Share your referral link — get ₦200 per verified signup.</p>
        </div>
        <button className="bg-white text-[#F5820D] px-5 py-2 rounded-xl font-semibold text-sm shrink-0">Share Link</button>
      </div>
    </div>
  );
}
