import { useState } from "react";
import MapView from "../components/MapView";
import { LAGOS_CENTER } from "../data/constants";

const MOCK_PARCEL = {
  id: "FW-A8B2C1",
  status: "in_transit",
  from: "Lekki Phase 1, Lagos",
  to: "Victoria Island, Lagos",
  rider: "Chidi Anosike",
  plate: "EKY 301 AG",
  phone: "+234 802 999 8877",
  eta: "~18 min",
  weight: "2.4 kg",
  sent: "2026-08-27 10:30",
  events: [
    { time: "10:30 AM", label: "Waybill created", icon: "📋", done: true },
    { time: "10:45 AM", label: "Rider assigned — Chidi A.", icon: "🏍️", done: true },
    { time: "11:02 AM", label: "Parcel photographed at pickup", icon: "📸", done: true },
    { time: "11:05 AM", label: "In transit to destination", icon: "🚀", done: true },
    { time: "ETA 11:23 AM", label: "Delivery (awaiting OTP)", icon: "🔐", done: false },
  ],
};

export default function Track() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-outfit text-4xl font-900 text-white mb-2" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
            Track Your <span className="gradient-text-orange">Shipment</span>
          </h1>
          <p className="text-[#BAD8F7]/60">Enter your waybill ID or phone number — no login required</p>
        </div>

        <form onSubmit={search} className="max-w-xl mx-auto mb-10">
          <div className="flex gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. FW-A8B2C1 or +234 812..."
              className="flex-1 glass-card rounded-2xl px-5 py-4 text-white bg-transparent outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/30"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            />
            <button type="submit" className="btn-primary px-8 py-4 rounded-2xl text-base">
              Track
            </button>
          </div>
          <button type="button" onClick={() => { setQuery("FW-A8B2C1"); setSearched(true); }}
            className="text-[#F5820D] text-sm mt-3 block mx-auto hover:underline">
            Try demo: FW-A8B2C1
          </button>
        </form>

        {searched && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tracking details */}
            <div className="space-y-5">
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[#F5820D] font-mono text-sm font-semibold">{MOCK_PARCEL.id}</span>
                    <h3 className="font-outfit text-xl font-900 text-white mt-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>In Transit</h3>
                  </div>
                  <span className="bg-blue-500/15 text-blue-400 border border-blue-400/30 feature-chip">🔵 Live</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div><p className="text-[#BAD8F7]/50 text-xs mb-0.5">From</p><p className="text-white">{MOCK_PARCEL.from}</p></div>
                  <div><p className="text-[#BAD8F7]/50 text-xs mb-0.5">To</p><p className="text-white">{MOCK_PARCEL.to}</p></div>
                  <div><p className="text-[#BAD8F7]/50 text-xs mb-0.5">ETA</p><p className="text-[#F5820D] font-semibold">{MOCK_PARCEL.eta}</p></div>
                  <div><p className="text-[#BAD8F7]/50 text-xs mb-0.5">Weight</p><p className="text-white">{MOCK_PARCEL.weight}</p></div>
                </div>

                <div className="border-t border-white/8 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1B3A7A] flex items-center justify-center text-lg">🧑🏿‍✈️</div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{MOCK_PARCEL.rider}</p>
                    <p className="text-[#BAD8F7]/50 text-xs">{MOCK_PARCEL.plate}</p>
                  </div>
                  <a href={`tel:${MOCK_PARCEL.phone}`} className="btn-primary px-4 py-2 rounded-xl text-sm">📞 Call</a>
                </div>
              </div>

              {/* Timeline */}
              <div className="glass-card rounded-2xl p-5">
                <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-5" style={{ fontFamily: "JetBrains Mono, monospace" }}>Delivery Timeline</p>
                <div className="space-y-1">
                  {MOCK_PARCEL.events.map((ev, i) => (
                    <div key={i} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 ${ev.done ? "bg-[#F5820D]" : "bg-white/10"}`}>{ev.icon}</div>
                        {i < MOCK_PARCEL.events.length - 1 && (
                          <div className={`w-0.5 h-8 ${ev.done ? "bg-[#F5820D]/50" : "bg-white/10"}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-semibold ${ev.done ? "text-white" : "text-[#BAD8F7]/40"}`}>{ev.label}</p>
                        <p className="text-[#BAD8F7]/40 text-xs mt-0.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden" style={{ height: "500px" }}>
              <MapView center={LAGOS_CENTER} zoom={12} markerA={[3.3792, 6.5244]} markerB={[3.41, 6.51]}
                driverPos={[3.39, 6.52]} height="100%" />
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📡</div>
            <p className="text-[#BAD8F7]/40 text-sm">Enter a waybill ID above to see live tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}
