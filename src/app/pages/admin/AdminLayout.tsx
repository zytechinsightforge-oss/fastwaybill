import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Overview", icon: "⬛", exact: true },
  { to: "/admin/map", label: "Live Map", icon: "🗺️" },
  { to: "/admin/analytics", label: "Analytics", icon: "📈" },
  { to: "/admin/accounting", label: "Accounting", icon: "💰" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
  { to: "/admin/drivers", label: "Drivers", icon: "🚖" },
  { to: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#070F24", fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0D1F47", borderRight: "1px solid rgba(186,216,247,0.08)" }}>

        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(186,216,247,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: "#F5820D" }}>FW</div>
            <div>
              <p className="text-white font-bold text-sm">FastWaybill</p>
              <p className="text-xs" style={{ color: "#BAD8F7", opacity: 0.5 }}>Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "text-white"
                  : "hover:bg-white/5"
                }`
              }
              style={({ isActive }) => isActive ? { background: "#F5820D22", color: "#F5820D" } : { color: "#BAD8F799" }}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(186,216,247,0.08)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1B3A7A" }}>
              {(user?.email ?? "A")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.email ?? "Admin"}</p>
              <p className="text-xs" style={{ color: "#BAD8F7", opacity: 0.4 }}>Super Admin</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full text-xs py-2 rounded-lg text-center transition-all hover:bg-white/5" style={{ color: "#BAD8F799" }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4" style={{ background: "rgba(7,15,36,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(186,216,247,0.06)" }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: "#BAD8F7", opacity: 0.5, fontFamily: "JetBrains Mono, monospace" }}>LIVE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#F5820D22", color: "#F5820D" }}>Test Mode</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
