import { Link, useLocation } from "react-router";
import logoImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.32_AM__1_.jpeg";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/ride", label: "🚖 Ride" },
  { to: "/dispatch", label: "📦 Dispatch" },
  { to: "/track", label: "📡 Track" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/wallet", label: "Wallet" },
];

export default function Nav() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="nav-blur fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
            <img src={logoImg} alt="FastWaybill" className="w-full h-full object-cover" />
          </div>
          <span className="font-outfit font-900 text-white text-lg" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
            Fast<span className="text-[#F5820D]">Waybill</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith(l.to)
                  ? "bg-[#F5820D] text-white"
                  : "text-[#BAD8F7]/70 hover:text-white hover:bg-white/8"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/wallet" className="hidden sm:flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-xl text-sm">
                <span className="text-[#BAD8F7]/60 text-xs">₦</span>
                <span className="text-white font-semibold">24,750</span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F5820D]/20 border border-[#F5820D]/40 flex items-center justify-center text-sm font-bold text-[#F5820D]">
                  {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                </div>
                <button onClick={signOut} className="text-[#BAD8F7]/50 text-xs hover:text-red-400 transition-colors hidden sm:block">Sign out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline hidden sm:block px-4 py-2 rounded-xl text-sm">Sign In</Link>
              <Link to="/login?redirect=/ride" className="btn-primary px-4 py-2 rounded-xl text-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 nav-blur border-t border-white/8 flex">
        {[
          { to: "/", label: "Home", icon: "🏠" },
          { to: "/ride", label: "Ride", icon: "🚖" },
          { to: "/dispatch", label: "Send", icon: "📦" },
          { to: "/dashboard", label: "Me", icon: "👤" },
          { to: "/wallet", label: "Wallet", icon: "💳" },
        ].map(l => (
          <Link key={l.to} to={l.to} className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs ${
            pathname === l.to ? "text-[#F5820D]" : "text-[#BAD8F7]/50"
          }`}>
            <span className="text-lg">{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
