const DRIVERS = [
  { id: "DRV-001", name: "Emeka Okonkwo", phone: "+2348011223344", plate: "LND-421-KJ", type: "both", trips: 124, rating: 4.9, earnings: 186000, status: "online", joined: "2026-07-10" },
  { id: "DRV-002", name: "Chidi Amadi", phone: "+2348022334455", plate: "LSD-082-AA", type: "ride", trips: 108, rating: 4.8, earnings: 162000, status: "online", joined: "2026-07-15" },
  { id: "DRV-003", name: "Tunde Bakare", phone: "+2348033445566", plate: "LND-550-BC", type: "dispatch", trips: 97, rating: 4.7, earnings: 145500, status: "offline", joined: "2026-07-20" },
  { id: "DRV-004", name: "Bola Kolawole", phone: "+2348044556677", plate: "LSD-210-CD", type: "both", trips: 91, rating: 4.9, earnings: 136500, status: "online", joined: "2026-07-22" },
  { id: "DRV-005", name: "Adaeze Madu", phone: "+2348055667788", plate: "LND-774-EF", type: "ride", trips: 84, rating: 4.6, earnings: 126000, status: "busy", joined: "2026-07-28" },
  { id: "DRV-006", name: "Kayode Abiola", phone: "+2348066778899", plate: "LSD-391-GH", type: "dispatch", trips: 72, rating: 4.5, earnings: 108000, status: "offline", joined: "2026-08-01" },
];

const STATUS_COLOR: Record<string, string> = {
  online: "bg-green-500/15 text-green-400",
  offline: "bg-white/10 text-white/40",
  busy: "bg-yellow-500/15 text-yellow-400",
  suspended: "bg-red-500/15 text-red-400",
};

export default function AdminDrivers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Drivers</h1>
          <p className="text-sm mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>{DRIVERS.length} registered drivers</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#F5820D" }}>
          + Onboard Driver
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Online Now", val: DRIVERS.filter(d => d.status === "online").length, color: "text-green-400" },
          { label: "Busy", val: DRIVERS.filter(d => d.status === "busy").length, color: "text-yellow-400" },
          { label: "Offline", val: DRIVERS.filter(d => d.status === "offline").length, color: "text-white/40" },
          { label: "Avg Rating", val: (DRIVERS.reduce((a, d) => a + d.rating, 0) / DRIVERS.length).toFixed(1) + " ★", color: "text-yellow-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
            <p className={`text-xl font-bold ${s.color}`} style={{ fontFamily: "Outfit, sans-serif" }}>{s.val}</p>
            <p className="text-xs mt-1" style={{ color: "#BAD8F7", opacity: 0.4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Driver cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DRIVERS.map(d => (
          <div key={d.id} className="rounded-2xl p-5" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: "#1B3A7A" }}>
                  {d.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold">{d.name}</p>
                  <p className="text-xs" style={{ color: "#F5820D", fontFamily: "JetBrains Mono, monospace" }}>{d.plate}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[d.status]}`}>{d.status}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Trips", val: d.trips },
                { label: "Rating", val: d.rating + " ★" },
                { label: "Earnings", val: "₦" + (d.earnings / 1000).toFixed(0) + "k" },
              ].map(s => (
                <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="font-bold text-white text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{s.val}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#BAD8F7", opacity: 0.4 }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs" style={{ color: "#BAD8F7", opacity: 0.5 }}>
              <span>{d.phone}</span>
              <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(59,108,183,0.2)", color: "#BAD8F7" }}>
                {d.type === "both" ? "Ride + Dispatch" : d.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
