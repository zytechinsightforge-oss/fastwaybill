import { useEffect, useRef, useState } from "react";
import { Map, NavigationControl, Marker, type StyleSpecification } from "maplibre-gl";

type MapStyle = "street" | "satellite" | "3d";

interface Props {
  center?: [number, number];
  zoom?: number;
  markerA?: [number, number];
  markerB?: [number, number];
  driverPos?: [number, number];
  height?: string;
  autoLocate?: boolean;
  onMapClick?: (lngLat: [number, number]) => void;
  onUserLocation?: (pos: [number, number]) => void;
}

const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    esri: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Esri World Imagery",
      maxzoom: 19,
    },
    labels: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    { id: "esri-sat", type: "raster", source: "esri" },
    { id: "esri-labels", type: "raster", source: "labels" },
  ],
};

const DARK_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm-dark",
      type: "raster",
      source: "osm",
      paint: { "raster-saturation": -0.7, "raster-brightness-max": 0.6 },
    },
  ],
};

function getStyle(s: MapStyle): StyleSpecification {
  if (s === "satellite") return SATELLITE_STYLE;
  if (s === "3d") return DARK_STYLE;
  return OSM_STYLE;
}

function pinEl(emoji: string, bg: string, size = 40) {
  const el = document.createElement("div");
  el.style.cssText = `
    width:${size}px;height:${size}px;border-radius:50%;background:${bg};
    border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.45);
    display:flex;align-items:center;justify-content:center;
    font-size:${size * 0.45}px;cursor:pointer;
    transition:transform 0.15s;user-select:none;
  `;
  el.textContent = emoji;
  el.onmouseenter = () => { el.style.transform = "scale(1.2)"; };
  el.onmouseleave = () => { el.style.transform = "scale(1)"; };
  return el;
}

// Pulsing blue dot — actual GPS position
function gpsEl() {
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:relative;width:20px;height:20px;";

  const ring = document.createElement("div");
  ring.style.cssText = `
    position:absolute;inset:-8px;border-radius:50%;
    background:rgba(59,130,246,0.25);
    animation:gps-ring 1.6s ease-out infinite;
  `;

  const dot = document.createElement("div");
  dot.style.cssText = `
    width:20px;height:20px;border-radius:50%;
    background:#3b82f6;border:3px solid white;
    box-shadow:0 2px 8px rgba(59,130,246,0.6);
    position:relative;z-index:1;
  `;

  if (!document.getElementById("gps-ring-style")) {
    const style = document.createElement("style");
    style.id = "gps-ring-style";
    style.textContent = `
      @keyframes gps-ring {
        0% { transform:scale(1); opacity:0.8; }
        100% { transform:scale(2.8); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }

  wrap.appendChild(ring);
  wrap.appendChild(dot);
  return wrap;
}

export default function MapView({
  center = [3.3792, 6.5244],
  zoom = 13,
  markerA,
  markerB,
  driverPos,
  height = "100%",
  autoLocate = true,
  onMapClick,
  onUserLocation,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  // Track whether the map style has fully loaded so we never call setStyle mid-load
  const styleReadyRef = useRef(false);
  const pendingStyleRef = useRef<MapStyle | null>(null);
  const [activeStyle, setActiveStyle] = useState<MapStyle>("street");
  const [locStatus, setLocStatus] = useState<"idle" | "locating" | "found" | "denied">("idle");
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  // ── Init map (once) ──────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center,
      zoom,
      attributionControl: false,
    });

    map.addControl(new NavigationControl({ showCompass: true }), "bottom-right");

    map.on("load", () => {
      map.resize();
      styleReadyRef.current = true;
      // Apply any style switch that was requested before load finished
      if (pendingStyleRef.current) {
        applyStyle(map, pendingStyleRef.current);
        pendingStyleRef.current = null;
      }
    });

    // Keep styleReady false while any style transition is in progress
    map.on("dataloading", () => { styleReadyRef.current = false; });
    map.on("idle", () => { styleReadyRef.current = true; });

    if (onMapClick) {
      map.on("click", (e) => onMapClick([e.lngLat.lng, e.lngLat.lat]));
    }

    mapRef.current = map;
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      map.remove();
      mapRef.current = null;
      styleReadyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-locate on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!autoLocate) return;
    startLocating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLocate]);

  function applyStyle(map: Map, s: MapStyle) {
    map.setStyle(getStyle(s));
    map.once("styledata", () => {
      styleReadyRef.current = true;
      if (s === "3d") map.easeTo({ pitch: 55, bearing: -12, duration: 900 });
      else map.easeTo({ pitch: 0, bearing: 0, duration: 500 });
    });
  }

  // ── Style switching — only when map is ready ─────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (styleReadyRef.current) {
      styleReadyRef.current = false;
      applyStyle(map, activeStyle);
    } else {
      // Queue it; the load/idle handler above will pick it up
      pendingStyleRef.current = activeStyle;
    }
  }, [activeStyle]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fly to explicit center prop changes ──────────────────────────
  useEffect(() => {
    mapRef.current?.flyTo({ center, zoom, duration: 900 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom]);

  // ── Place / refresh point-of-interest markers ────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const add = (pos: [number, number], emoji: string, bg: string) => {
      const m = new Marker({ element: pinEl(emoji, bg) }).setLngLat(pos).addTo(map);
      markersRef.current.push(m);
    };

    if (markerA) add(markerA, "📍", "#22c55e");
    if (markerB) add(markerB, "🏁", "#F5820D");
    if (driverPos) add(driverPos, "🚖", "#1B3A7A");
  }, [markerA, markerB, driverPos]);

  // ── Update GPS dot when coords change ───────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userCoords) return;
    userMarkerRef.current?.remove();
    const m = new Marker({ element: gpsEl(), anchor: "center" })
      .setLngLat(userCoords)
      .addTo(map);
    userMarkerRef.current = m;
  }, [userCoords]);

  function startLocating() {
    if (!navigator.geolocation) {
      setLocStatus("denied");
      return;
    }
    setLocStatus("locating");

    // One-shot first fix → fly immediately
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos: [number, number] = [coords.longitude, coords.latitude];
        setUserCoords(pos);
        setLocStatus("found");
        onUserLocation?.(pos);
        mapRef.current?.flyTo({ center: pos, zoom: 15, duration: 1400 });

        // Then watch for continuous updates
        watchIdRef.current = navigator.geolocation.watchPosition(
          ({ coords: c }) => {
            const next: [number, number] = [c.longitude, c.latitude];
            setUserCoords(next);
            onUserLocation?.(next);
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 5000 }
        );
      },
      () => setLocStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Style switcher */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", gap: 6 }}>
        {(["street", "satellite", "3d"] as MapStyle[]).map((s) => (
          <button
            key={s}
            onClick={() => setActiveStyle(s)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "JetBrains Mono, monospace",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              cursor: "pointer",
              transition: "all 0.15s",
              background: activeStyle === s ? "#F5820D" : "rgba(13,31,71,0.88)",
              color: activeStyle === s ? "#fff" : "#BAD8F7",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {s === "street" ? "🗺 Street" : s === "satellite" ? "🛰 Satellite" : "🏙 3D"}
          </button>
        ))}
      </div>

      {/* GPS locate button */}
      <button
        onClick={startLocating}
        title="Find my real location"
        style={{
          position: "absolute",
          top: 12,
          right: 52,
          zIndex: 10,
          width: 38,
          height: 38,
          borderRadius: 8,
          background: locStatus === "found" ? "#1B3A7A" : "rgba(13,31,71,0.88)",
          backdropFilter: "blur(12px)",
          border: locStatus === "found" ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.18)",
          color: "#BAD8F7",
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {locStatus === "locating" ? "⏳" : locStatus === "denied" ? "🚫" : "📡"}
      </button>

      {/* Status pill */}
      {locStatus === "locating" && (
        <div style={{
          position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
          background: "rgba(13,31,71,0.92)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(186,216,247,0.2)", borderRadius: 999,
          padding: "6px 16px", zIndex: 10, whiteSpace: "nowrap",
          color: "#BAD8F7", fontSize: 12, fontFamily: "JetBrains Mono, monospace",
        }}>
          ⏳ Getting your real GPS location...
        </div>
      )}
      {locStatus === "found" && userCoords && (
        <div style={{
          position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
          background: "rgba(13,31,71,0.92)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(59,130,246,0.4)", borderRadius: 999,
          padding: "6px 16px", zIndex: 10, whiteSpace: "nowrap",
          color: "#93c5fd", fontSize: 12, fontFamily: "JetBrains Mono, monospace",
        }}>
          📡 Live GPS · {userCoords[1].toFixed(5)}, {userCoords[0].toFixed(5)}
        </div>
      )}
      {locStatus === "denied" && (
        <div style={{
          position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
          background: "rgba(127,29,29,0.9)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(248,113,113,0.4)", borderRadius: 999,
          padding: "6px 16px", zIndex: 10, whiteSpace: "nowrap",
          color: "#fca5a5", fontSize: 12, fontFamily: "JetBrains Mono, monospace",
        }}>
          🚫 Location access denied — allow it in browser settings
        </div>
      )}
    </div>
  );
}
