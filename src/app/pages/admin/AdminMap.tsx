import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const LAGOS_CENTER: [number, number] = [3.3792, 6.5244];

type Category = "drivers" | "users" | "rides" | "dispatches";

const MARKERS = {
  drivers: [
    { id: "DRV-001", lng: 3.3962, lat: 6.4550, label: "Emeka O.", sub: "Online · Lekki", status: "online" },
    { id: "DRV-002", lng: 3.3478, lat: 6.6010, label: "Chidi A.", sub: "Online · Ikeja", status: "online" },
    { id: "DRV-003", lng: 3.3816, lat: 6.4698, label: "Tunde B.", sub: "Offline · VI", status: "offline" },
    { id: "DRV-004", lng: 3.3590, lat: 6.5150, label: "Bola K.", sub: "Online · Yaba", status: "online" },
    { id: "DRV-005", lng: 3.4210, lat: 6.4352, label: "Adaeze M.", sub: "Busy · Ajah", status: "busy" },
    { id: "DRV-006", lng: 3.3240, lat: 6.5840, label: "Kayode A.", sub: "Offline · Surulere", status: "offline" },
  ],
  users: [
    { id: "USR-001", lng: 3.4001, lat: 6.4480, label: "Zakariya S.", sub: "Last seen · Lekki", status: "active" },
    { id: "USR-002", lng: 3.3510, lat: 6.5980, label: "Amina T.", sub: "Last seen · Ikeja", status: "active" },
    { id: "USR-003", lng: 3.3820, lat: 6.5050, label: "Chukwuemeka O.", sub: "Last seen · Yaba", status: "active" },
    { id: "USR-004", lng: 3.4150, lat: 6.4300, label: "Fatima L.", sub: "Last seen · Ajah", status: "active" },
    { id: "USR-005", lng: 3.2850, lat: 6.4640, label: "Bola A.", sub: "Last seen · Festac", status: "inactive" },
    { id: "USR-006", lng: 3.3900, lat: 6.4600, label: "Taiwo F.", sub: "Last seen · VI", status: "active" },
    { id: "USR-007", lng: 3.3600, lat: 6.5200, label: "Ngozi E.", sub: "Last seen · Surulere", status: "active" },
  ],
  rides: [
    { id: "ORD-9921", lng: 3.3980, lat: 6.4520, label: "Ride · ORD-9921", sub: "Lekki → VI · ₦800", status: "completed" },
    { id: "ORD-9919", lng: 3.3710, lat: 6.5100, label: "Ride · ORD-9919", sub: "Yaba → Surulere · ₦750", status: "completed" },
    { id: "ORD-9916", lng: 3.3850, lat: 6.4650, label: "Ride · ORD-9916", sub: "Island → Mainland · ₦1,200", status: "in-transit" },
    { id: "ORD-9914", lng: 3.5350, lat: 6.6120, label: "Ride · ORD-9914", sub: "Ikorodu → Yaba · ₦1,100", status: "pending" },
  ],
  dispatches: [
    { id: "ORD-9920", lng: 3.3490, lat: 6.5960, label: "Dispatch · ORD-9920", sub: "Ikeja → Apapa · ₦1,600", status: "in-transit" },
    { id: "ORD-9918", lng: 3.4180, lat: 6.4310, label: "Dispatch · ORD-9918", sub: "Ajah → CMS · ₦1,400", status: "completed" },
    { id: "ORD-9915", lng: 3.3880, lat: 6.4580, label: "Dispatch · ORD-9915", sub: "VI → Lekki · ₦600", status: "completed" },
  ],
};

const CAT_CONFIG: Record<Category, { label: string; color: string; icon: string }> = {
  drivers: { label: "Drivers", color: "#F5820D", icon: "🚖" },
  users: { label: "Users", color: "#3B6CB7", icon: "👥" },
  rides: { label: "Active Rides", color: "#22c55e", icon: "🛣️" },
  dispatches: { label: "Dispatches", color: "#a855f7", icon: "📦" },
};

const STATUS_COLOR: Record<string, string> = {
  online: "#22c55e",
  busy: "#eab308",
  offline: "#6b7280",
  active: "#3B6CB7",
  inactive: "#6b7280",
  "in-transit": "#F5820D",
  completed: "#22c55e",
  pending: "#eab308",
};

function makeMarkerEl(color: string, icon: string) {
  const el = document.createElement("div");
  el.style.cssText = `
    width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
    background: ${color}; transform: rotate(-45deg);
    border: 3px solid rgba(255,255,255,0.3);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px ${color}66;
  `;
  const inner = document.createElement("div");
  inner.style.cssText = "transform: rotate(45deg); font-size: 14px; line-height: 1;";
  inner.textContent = icon;
  el.appendChild(inner);
  return el;
}

export default function AdminMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [selected, setSelected] = useState<Set<Category>>(new Set(["drivers", "rides"]));
  const [counts, setCounts] = useState({ online: 4, busy: 1, offline: 2 });

  const toggleCategory = (cat: Category) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256 },
        },
        layers: [{ id: "osm", type: "raster", source: "osm", paint: { "raster-opacity": 0.15 } }],
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      },
      center: LAGOS_CENTER,
      zoom: 11,
      attributionControl: false,
    });
    mapInstance.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
    return () => { mapInstance.current?.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    selected.forEach(cat => {
      const items = MARKERS[cat];
      const cfg = CAT_CONFIG[cat];
      items.forEach(item => {
        const color = STATUS_COLOR[item.status] ?? cfg.color;
        const el = makeMarkerEl(color, cfg.icon);
        const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="background:#0D1F47;border:1px solid rgba(186,216,247,0.15);border-radius:12px;padding:12px;min-width:160px;font-family:Inter,sans-serif;">
              <p style="color:#fff;font-weight:600;font-size:13px;margin:0 0 4px">${item.label}</p>
              <p style="color:#BAD8F7;opacity:0.6;font-size:11px;margin:0 0 6px">${item.sub}</p>
              <span style="background:${color}22;color:${color};font-size:10px;padding:2px 8px;border-radius:20px;">${item.status}</span>
            </div>
          `);
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([item.lng, item.lat])
          .setPopup(popup)
          .addTo(mapInstance.current!);
        markersRef.current.push(marker);
      });
    });
  }, [selected]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Live Map</h1>
        <p className="text-sm mt-1" style={{ color: "#BAD8F7", opacity: 0.5 }}>Real-time view of drivers, users, rides and dispatches across Lagos</p>
      </div>

      {/* Category toggles */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(CAT_CONFIG) as [Category, typeof CAT_CONFIG[Category]][]).map(([cat, cfg]) => (
          <button key={cat} onClick={() => toggleCategory(cat)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: selected.has(cat) ? `${cfg.color}22` : "rgba(255,255,255,0.04)",
              border: `1px solid ${selected.has(cat) ? cfg.color : "rgba(186,216,247,0.08)"}`,
              color: selected.has(cat) ? cfg.color : "#BAD8F799",
            }}>
            <span>{cfg.icon}</span>
            {cfg.label}
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: selected.has(cat) ? `${cfg.color}33` : "rgba(255,255,255,0.06)" }}>
              {MARKERS[cat].length}
            </span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Online Drivers", val: 4, color: "#22c55e" },
          { label: "Busy Drivers", val: 1, color: "#eab308" },
          { label: "Active Rides", val: 2, color: "#F5820D" },
          { label: "In-Transit Dispatches", val: 1, color: "#a855f7" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.08)" }}>
            <p className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: s.color }}>{s.val}</p>
            <p className="text-xs mt-1" style={{ color: "#BAD8F7", opacity: 0.4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden relative" style={{ height: "520px", border: "1px solid rgba(186,216,247,0.08)", background: "#070F24" }}>
        <div ref={mapRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 rounded-xl p-3 space-y-2" style={{ background: "rgba(7,15,36,0.92)", backdropFilter: "blur(8px)", border: "1px solid rgba(186,216,247,0.1)" }}>
          {[
            { color: "#22c55e", label: "Online / Completed" },
            { color: "#F5820D", label: "In Transit" },
            { color: "#eab308", label: "Busy / Pending" },
            { color: "#6b7280", label: "Offline / Inactive" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="text-xs" style={{ color: "#BAD8F7", opacity: 0.6 }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Live badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(7,15,36,0.9)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-green-400">LIVE</span>
        </div>
      </div>
    </div>
  );
}
