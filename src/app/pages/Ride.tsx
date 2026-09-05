import { useState } from "react";
import { useNavigate } from "react-router";
import MapView from "../components/MapView";
import { ZONE_RATES, LAGOS_CENTER } from "../data/constants";
import { useRequireAuth } from "../hooks/useRequireAuth";

type BookingStep = "form" | "matching" | "tracking" | "arrived" | "complete";

const VEHICLE_TYPES = [
  { id: "bike", icon: "🏍️", label: "Okada", desc: "Fastest route", multiplier: 1 },
  { id: "tricycle", icon: "🛺", label: "Keke", desc: "Comfortable", multiplier: 1.2 },
  { id: "car", icon: "🚗", label: "Car", desc: "AC & 4 seats", multiplier: 1.8 },
];

const MOCK_DRIVER = {
  name: "Emeka Okafor",
  plate: "KJA 472 BT",
  rating: 4.97,
  trips: 1243,
  vehicle: "TVS Apache 200",
  eta: 3,
  phone: "+234 801 234 5678",
  pos: [3.41, 6.53] as [number, number],
};

export default function Ride() {
  const nav = useNavigate();
  const [step, setStep] = useState<BookingStep>("form");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedZone, setSelectedZone] = useState(ZONE_RATES[0]);
  const [vehicle, setVehicle] = useState(VEHICLE_TYPES[0]);
  const [sosActive, setSosActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(MOCK_DRIVER.eta);
  const { guardAction } = useRequireAuth();

  const fare = Math.round(selectedZone.flat * vehicle.multiplier);

  const bookRide = () => guardAction(() => {
    setStep("matching");
    setTimeout(() => {
      setStep("tracking");
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(interval); setStep("arrived"); return 100; }
          setEta(e => Math.max(0, e - 0.05));
          return p + 2;
        });
      }, 200);
    }, 2500);
  });

  const triggerSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 5000);
  };

  return (
    <div className="pt-16 h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left panel */}
      <div className="w-full md:w-96 flex flex-col border-r border-white/8 overflow-y-auto" style={{ background: "#0D1F47" }}>

        {step === "form" && (
          <div className="p-5 flex flex-col gap-4 flex-1">
            <div>
              <h2 className="font-outfit text-2xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Book a Ride</h2>
              <p className="text-[#BAD8F7]/50 text-sm">Flat zone rates — no surge, ever.</p>
            </div>

            {/* Pickup / Dropoff */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 shrink-0" />
                <input value={pickup} onChange={e => setPickup(e.target.value)}
                  placeholder="Pickup location..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#BAD8F7]/40" />
              </div>
              <div className="ml-1.5 w-px h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#F5820D] shrink-0" />
                <input value={dropoff} onChange={e => setDropoff(e.target.value)}
                  placeholder="Drop-off location..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#BAD8F7]/40" />
              </div>
            </div>

            {/* Zone select */}
            <div>
              <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>Select Zone</p>
              <div className="space-y-2">
                {ZONE_RATES.map(z => (
                  <button key={z.id} onClick={() => setSelectedZone(z)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                      selectedZone.id === z.id ? "bg-[#F5820D]/15 border border-[#F5820D]/40 text-white" : "glass-card text-[#BAD8F7]/70 hover:text-white"
                    }`}>
                    <span>{z.zone}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">₦{z.flat.toLocaleString()}</span>
                      <span className="text-[#BAD8F7]/40 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>{z.eta}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle type */}
            <div>
              <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>Vehicle Type</p>
              <div className="grid grid-cols-3 gap-2">
                {VEHICLE_TYPES.map(v => (
                  <button key={v.id} onClick={() => setVehicle(v)}
                    className={`p-3 rounded-xl text-center transition-all border ${
                      vehicle.id === v.id ? "border-[#F5820D] bg-[#F5820D]/10" : "border-white/10 glass-card"
                    }`}>
                    <div className="text-2xl mb-1">{v.icon}</div>
                    <p className="text-white text-xs font-semibold">{v.label}</p>
                    <p className="text-[#BAD8F7]/50 text-[10px]">{v.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Fare summary */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#BAD8F7]/60 text-sm">Base fare ({selectedZone.zone})</span>
                <span className="text-white">₦{selectedZone.flat.toLocaleString()}</span>
              </div>
              {vehicle.multiplier > 1 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#BAD8F7]/60 text-sm">Vehicle upgrade</span>
                  <span className="text-white">×{vehicle.multiplier}</span>
                </div>
              )}
              <div className="border-t border-white/8 pt-2 flex justify-between items-center">
                <span className="text-white font-semibold">Total (flat rate)</span>
                <span className="font-outfit text-xl font-900 text-[#F5820D]" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>₦{fare.toLocaleString()}</span>
              </div>
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">✅ No surge · Wallet deduction on pickup</p>
            </div>

            <button onClick={bookRide} className="btn-primary py-4 rounded-2xl text-base font-outfit font-700 mt-auto" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
              Book {vehicle.label} — ₦{fare.toLocaleString()} →
            </button>
          </div>
        )}

        {step === "matching" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#F5820D]/15 flex items-center justify-center text-4xl animate-pulse">🚖</div>
            <div>
              <h3 className="font-outfit text-xl font-900 text-white mb-2" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Finding your driver</h3>
              <p className="text-[#BAD8F7]/60 text-sm">Matching with the nearest verified {vehicle.label}...</p>
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#F5820D] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <div className="glass-card rounded-2xl p-4 w-full text-left">
              <p className="text-[#BAD8F7]/60 text-xs mb-2">Checking nearby drivers:</p>
              <div className="space-y-2">
                {["NIN verified ✓", "Background check ✓", "Vehicle docs ✓", "Rating > 4.0 ✓"].map(c => (
                  <div key={c} className="flex items-center gap-2 text-green-400 text-sm">{c}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "tracking" && (
          <div className="flex-1 flex flex-col p-5 gap-4">
            <div className="flex items-center gap-3 glass-card rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-[#1B3A7A] flex items-center justify-center text-2xl">👨🏿‍✈️</div>
              <div className="flex-1">
                <p className="text-white font-semibold">{MOCK_DRIVER.name}</p>
                <p className="text-[#BAD8F7]/60 text-sm">{MOCK_DRIVER.vehicle} · {MOCK_DRIVER.plate}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {"★★★★★".split("").map((s, i) => <span key={i} className="text-[#F5820D] text-xs">{s}</span>)}
                  <span className="text-[#BAD8F7]/50 text-xs ml-1">{MOCK_DRIVER.rating} · {MOCK_DRIVER.trips.toLocaleString()} trips</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-outfit font-700" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>{Math.ceil(eta)} min</p>
                <p className="text-[#BAD8F7]/40 text-xs">away</p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-[#BAD8F7]/60 mb-2">
                <span>Driver en route</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#F5820D] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Trip info */}
            <div className="glass-card rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Pickup</span><span className="text-white">{selectedZone.zone.split("→")[0].trim()}</span></div>
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Drop-off</span><span className="text-white">{selectedZone.zone.split("→")[1].trim()}</span></div>
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Fare (locked)</span><span className="text-[#F5820D] font-semibold">₦{fare.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">ETA</span><span className="text-white">{selectedZone.eta}</span></div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <a href={`tel:${MOCK_DRIVER.phone}`} className="glass-card rounded-xl py-3 flex flex-col items-center gap-1 hover:bg-white/10 transition-all">
                <span className="text-xl">📞</span>
                <span className="text-white text-xs">Call</span>
              </a>
              <button className="glass-card rounded-xl py-3 flex flex-col items-center gap-1 hover:bg-white/10 transition-all">
                <span className="text-xl">💬</span>
                <span className="text-white text-xs">Message</span>
              </button>
              <button onClick={triggerSOS} className={`rounded-xl py-3 flex flex-col items-center gap-1 transition-all ${sosActive ? "bg-red-500 animate-pulse" : "bg-red-500/20 hover:bg-red-500/30"}`}>
                <span className="text-xl">🆘</span>
                <span className="text-white text-xs font-bold">SOS</span>
              </button>
            </div>

            {sosActive && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-center">
                <p className="text-red-400 text-sm font-semibold">⚠️ SOS Alert Sent</p>
                <p className="text-[#BAD8F7]/60 text-xs">Notifying emergency contacts + Safety Desk...</p>
              </div>
            )}
          </div>
        )}

        {step === "arrived" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
            <div className="text-6xl">✅</div>
            <div>
              <h3 className="font-outfit text-2xl font-900 text-white mb-2" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Driver Arrived!</h3>
              <p className="text-[#BAD8F7]/60">{MOCK_DRIVER.name} is waiting at your pickup point.</p>
            </div>
            <div className="glass-card rounded-2xl p-4 w-full">
              <p className="text-[#BAD8F7]/60 text-xs mb-2 uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Share your trip</p>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                <span className="text-[#BAD8F7]/60 text-xs flex-1 truncate" style={{ fontFamily: "JetBrains Mono, monospace" }}>fastwb.ng/track/TRP-2891</span>
                <button className="bg-[#F5820D] text-white text-xs px-3 py-1 rounded-lg">Copy</button>
              </div>
            </div>
            <button onClick={() => setStep("complete")} className="btn-primary w-full py-4 rounded-2xl text-base">
              I'm in the vehicle →
            </button>
          </div>
        )}

        {step === "complete" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-5">
            <div className="text-6xl">🎉</div>
            <div>
              <h3 className="font-outfit text-2xl font-900 text-white mb-2" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Trip Complete!</h3>
              <p className="text-[#BAD8F7]/60 text-sm">₦{fare.toLocaleString()} deducted from your FastWallet</p>
            </div>
            <div className="glass-card rounded-2xl p-4 w-full">
              <p className="text-[#BAD8F7]/60 text-xs mb-3 uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Rate {MOCK_DRIVER.name}</p>
              <div className="flex justify-center gap-2 mb-3">
                {[1,2,3,4,5].map(s => (
                  <button key={s} className="text-3xl text-[#F5820D] hover:scale-125 transition-transform">★</button>
                ))}
              </div>
            </div>
            <button onClick={() => { setStep("form"); setProgress(0); setEta(MOCK_DRIVER.eta); }} className="btn-primary w-full py-4 rounded-2xl">
              Book Another Ride
            </button>
            <button onClick={() => nav("/dashboard")} className="btn-outline w-full py-3 rounded-2xl text-sm">
              Go to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: "400px" }}>
        <MapView
          center={LAGOS_CENTER}
          zoom={13}
          markerA={[3.3792, 6.5244]}
          markerB={[3.41, 6.51]}
          driverPos={step === "tracking" || step === "arrived" ? MOCK_DRIVER.pos : undefined}
          height="100%"
        />
        {/* Live indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-card rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-xs font-semibold">Live GPS Map — Lagos, Nigeria</span>
        </div>
      </div>
    </div>
  );
}
