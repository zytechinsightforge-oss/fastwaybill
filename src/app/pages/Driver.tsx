import { useState } from "react";
import { DRIVER_JOBS } from "../data/constants";
import MapView from "../components/MapView";
import { LAGOS_CENTER } from "../data/constants";

export default function Driver() {
  const [online, setOnline] = useState(false);
  const [activeJob, setActiveJob] = useState<null | typeof DRIVER_JOBS[0]>(null);
  const [jobStep, setJobStep] = useState<"pickup" | "delivery">("pickup");
  const [tab, setTab] = useState<"jobs" | "earnings" | "profile">("jobs");
  const [earnings] = useState({ today: 8400, week: 52000, month: 184500 });

  const acceptJob = (job: typeof DRIVER_JOBS[0]) => {
    setActiveJob(job);
    setJobStep("pickup");
  };

  const completePickup = () => setJobStep("delivery");
  const completeDelivery = () => { setActiveJob(null); setJobStep("pickup"); };

  return (
    <div className="pt-16 h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8" style={{ background: "#0D1F47" }}>
        <div>
          <h2 className="font-outfit font-900 text-white text-lg" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Driver Console</h2>
          <p className="text-[#BAD8F7]/50 text-xs">Emeka O. · KJA 472 BT · ⭐ 4.97</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold ${online ? "text-green-400" : "text-[#BAD8F7]/50"}`}>
            {online ? "● Online" : "● Offline"}
          </span>
          <button onClick={() => setOnline(!online)}
            className={`w-14 h-7 rounded-full transition-all relative ${online ? "bg-green-500" : "bg-white/20"}`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${online ? "left-8" : "left-1"}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-full md:w-96 flex flex-col border-r border-white/8 overflow-hidden" style={{ background: "#0D1F47" }}>
          {/* Tabs */}
          <div className="flex border-b border-white/8">
            {[{ id: "jobs" as const, label: "Jobs" }, { id: "earnings" as const, label: "Earnings" }, { id: "profile" as const, label: "Profile" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-sm font-semibold transition-all ${tab === t.id ? "text-[#F5820D] border-b-2 border-[#F5820D]" : "text-[#BAD8F7]/50 hover:text-white"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {tab === "jobs" && (
              <div className="space-y-3">
                {activeJob ? (
                  <div className="space-y-4">
                    <div className={`rounded-2xl p-4 border-2 ${jobStep === "pickup" ? "border-[#F5820D] bg-[#F5820D]/10" : "border-blue-400 bg-blue-400/10"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{jobStep === "pickup" ? "📍" : "🏁"}</span>
                        <p className="text-white font-semibold">{jobStep === "pickup" ? "Go to Pickup" : "Deliver Parcel"}</p>
                      </div>
                      <p className="text-[#BAD8F7]/70 text-sm mb-1">📍 {activeJob.from}</p>
                      <p className="text-[#BAD8F7]/70 text-sm mb-3">🏁 {activeJob.to}</p>
                      <div className="flex justify-between text-sm mb-4">
                        <span className="text-[#BAD8F7]/50">{activeJob.dist}</span>
                        <span className="text-[#F5820D] font-bold">₦{activeJob.pay.toLocaleString()}</span>
                      </div>
                      {jobStep === "pickup" ? (
                        <button onClick={completePickup} className="btn-primary w-full py-3 rounded-xl">
                          📸 Photo & Confirm Pickup
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <input placeholder="Enter recipient OTP"
                            className="w-full glass-card rounded-xl px-4 py-3 text-white text-center text-xl font-bold outline-none border border-white/10 focus:border-[#F5820D] placeholder-[#BAD8F7]/30"
                            style={{ fontFamily: "JetBrains Mono, monospace" }} />
                          <button onClick={completeDelivery} className="btn-primary w-full py-3 rounded-xl">
                            ✅ Confirm Delivery
                          </button>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setActiveJob(null)} className="btn-outline w-full py-2.5 rounded-xl text-sm">
                      Cancel Job (Penalty applies)
                    </button>
                  </div>
                ) : (
                  <>
                    {!online && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">😴</div>
                        <p className="text-[#BAD8F7]/60 text-sm">You're offline. Toggle Online to see jobs.</p>
                      </div>
                    )}
                    {online && DRIVER_JOBS.map(job => (
                      <div key={job.id} className="glass-card rounded-2xl p-4 border border-white/10 hover:border-[#F5820D]/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{job.type === "ride" ? "🚖" : "📦"}</span>
                          <span className={`feature-chip text-[10px] ${job.type === "ride" ? "bg-[#1B3A7A]/60 text-[#BAD8F7] border border-[#3B6CB7]/50" : "bg-[#F5820D]/15 text-[#F5820D] border border-[#F5820D]/40"}`}>
                            {job.type.toUpperCase()}
                          </span>
                          <span className="text-[#BAD8F7]/40 text-xs ml-auto" style={{ fontFamily: "JetBrains Mono, monospace" }}>{job.eta}</span>
                        </div>
                        <p className="text-[#BAD8F7]/70 text-xs mb-0.5">From: {job.from}</p>
                        <p className="text-[#BAD8F7]/70 text-xs mb-3">To: {job.to}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-outfit font-900 text-lg" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>₦{job.pay.toLocaleString()}</p>
                            <p className="text-[#BAD8F7]/40 text-xs">{job.dist}</p>
                          </div>
                          <button onClick={() => acceptJob(job)} className="btn-primary px-5 py-2 rounded-xl text-sm">
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {tab === "earnings" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Today", val: earnings.today },
                    { label: "This Week", val: earnings.week },
                    { label: "This Month", val: earnings.month },
                  ].map(e => (
                    <div key={e.label} className="glass-card rounded-2xl p-3 text-center">
                      <p className="font-outfit font-900 text-[#F5820D] text-base" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>₦{e.val.toLocaleString()}</p>
                      <p className="text-[#BAD8F7]/50 text-xs mt-1">{e.label}</p>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl p-4">
                  <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>Diamond Rider Progress</p>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">Monthly target</span>
                    <span className="text-[#F5820D] font-semibold">₦184,500 / ₦200,000</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F5820D] rounded-full" style={{ width: "92%" }} />
                  </div>
                  <p className="text-[#BAD8F7]/50 text-xs mt-2">₦15,500 more to unlock ₦25,000 Diamond bonus 🏆</p>
                </div>

                <div className="glass-card rounded-2xl p-4">
                  <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>Performance</p>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: "Completion Rate", val: "98.4%", good: true },
                      { label: "Acceptance Rate", val: "94.1%", good: true },
                      { label: "Cancellations", val: "2 (this month)", good: false },
                      { label: "Avg. Rating", val: "4.97 ★", good: true },
                    ].map(s => (
                      <div key={s.label} className="flex justify-between">
                        <span className="text-[#BAD8F7]/60">{s.label}</span>
                        <span className={s.good ? "text-green-400" : "text-red-400"}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "profile" && (
              <div className="space-y-4">
                <div className="glass-card rounded-2xl p-5 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1B3A7A] flex items-center justify-center text-4xl mx-auto mb-3">👨🏿‍✈️</div>
                  <h3 className="font-outfit font-900 text-white text-xl mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Emeka Okafor</h3>
                  <p className="text-[#BAD8F7]/50 text-sm">KJA 472 BT · TVS Apache 200</p>
                  <p className="text-[#F5820D] mt-2">⭐ 4.97 · 1,243 trips</p>
                </div>

                <div className="glass-card rounded-2xl p-5">
                  <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>Verification Status</p>
                  <div className="space-y-2">
                    {["NIN Verified ✓", "Vehicle Docs ✓", "Background Check ✓", "Guarantor ✓", "Dashcam: Not enrolled"].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm ${item.includes("Not") ? "text-yellow-400" : "text-green-400"}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5">
                  <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>Driver Perks</p>
                  {["✅ Weekly Payout Enabled", "✅ Fuel Card (OandO Stations)", "✅ HMO — Hygeia Bronze", "✅ ₦200 Free Data Weekly", "🏆 Diamond Rider: 92% progress"].map((p, i) => (
                    <p key={i} className="text-[#BAD8F7]/70 text-sm py-1 border-b border-white/5 last:border-0">{p}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative hidden md:block" style={{ minHeight: "400px" }}>
          <MapView center={LAGOS_CENTER} zoom={13} driverPos={[3.3792, 6.5244]} height="100%" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-card rounded-full px-4 py-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${online ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
            <span className="text-white text-xs font-semibold">{online ? "Looking for nearby jobs..." : "Go online to receive jobs"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
