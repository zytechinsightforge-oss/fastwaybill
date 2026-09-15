import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getAutoLogoutMins, setAutoLogoutMins } from "../hooks/useInactivityLogout";

const TIMEOUT_OPTIONS = [
  { label: "Off", value: 0 },
  { label: "1 minute", value: 1 },
  { label: "5 minutes", value: 5 },
  { label: "10 minutes", value: 10 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
];

const PIN_KEY = "fw_wallet_pin";
const BIO_KEY = "fw_wallet_bio";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [logoutMins, setLogoutMinsState] = useState(getAutoLogoutMins());
  const [saved, setSaved] = useState(false);
  const [pinCleared, setPinCleared] = useState(false);
  const [bioCleared, setBioCleared] = useState(false);

  const handleTimeoutChange = (val: number) => {
    setLogoutMinsState(val);
    setAutoLogoutMins(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearPin = () => {
    localStorage.removeItem(PIN_KEY);
    localStorage.removeItem(BIO_KEY);
    setPinCleared(true);
    setTimeout(() => setPinCleared(false), 2500);
  };

  const clearBio = () => {
    localStorage.removeItem(BIO_KEY);
    setBioCleared(true);
    setTimeout(() => setBioCleared(false), 2500);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const email = user?.email || user?.phone || "—";

  return (
    <div className="pt-20 pb-24 md:pb-10 min-h-screen px-4 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-outfit text-3xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(186,216,247,0.45)" }}>Manage your account and security preferences</p>
      </div>

      {/* Profile card */}
      <div className="glass-card rounded-3xl p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
          style={{ background: "rgba(245,130,13,0.15)", border: "1px solid rgba(245,130,13,0.3)", color: "#F5820D" }}>
          {displayName[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold truncate">{displayName}</p>
          <p className="text-sm truncate" style={{ color: "rgba(186,216,247,0.45)", fontFamily: "JetBrains Mono, monospace" }}>{email}</p>
        </div>
      </div>

      {/* ── Auto-logout ── */}
      <section className="glass-card rounded-3xl p-5 mb-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold flex items-center gap-2">
              <span>⏱️</span> Auto Logout
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(186,216,247,0.45)" }}>
              Sign you out automatically after inactivity
            </p>
          </div>
          {saved && (
            <span className="text-xs text-green-400 font-semibold animate-pulse">✓ Saved</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TIMEOUT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => handleTimeoutChange(opt.value)}
              className="py-3 px-4 rounded-2xl text-sm font-semibold transition-all text-center"
              style={{
                background: logoutMins === opt.value ? "rgba(245,130,13,0.18)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${logoutMins === opt.value ? "#F5820D" : "rgba(186,216,247,0.08)"}`,
                color: logoutMins === opt.value ? "#F5820D" : "rgba(186,216,247,0.6)",
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl px-4 py-3 flex items-start gap-2" style={{ background: "rgba(245,130,13,0.07)", border: "1px solid rgba(245,130,13,0.15)" }}>
          <span className="text-sm shrink-0">💡</span>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(186,216,247,0.5)" }}>
            {logoutMins === 0
              ? "Auto logout is disabled. You will stay signed in until you manually sign out."
              : `You will be warned 30 seconds before logout. Any activity (tap, scroll, type) resets the timer. Current: ${logoutMins} minute${logoutMins !== 1 ? "s" : ""}.`}
          </p>
        </div>
      </section>

      {/* ── Wallet Security ── */}
      <section className="glass-card rounded-3xl p-5 mb-5 space-y-3">
        <p className="text-white font-semibold flex items-center gap-2"><span>💳</span> Wallet Security</p>

        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div>
            <p className="text-white text-sm font-medium">Wallet PIN</p>
            <p className="text-xs" style={{ color: "rgba(186,216,247,0.4)" }}>4-digit PIN required to access wallet</p>
          </div>
          <button onClick={clearPin}
            className="text-xs px-3 py-1.5 rounded-xl transition-all"
            style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            {pinCleared ? "✓ Cleared" : "Reset PIN"}
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-white text-sm font-medium">Face ID / Fingerprint</p>
            <p className="text-xs" style={{ color: "rgba(186,216,247,0.4)" }}>Biometric shortcut to unlock wallet</p>
          </div>
          <button onClick={clearBio}
            className="text-xs px-3 py-1.5 rounded-xl transition-all"
            style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            {bioCleared ? "✓ Cleared" : "Remove"}
          </button>
        </div>
      </section>

      {/* ── Account ── */}
      <section className="glass-card rounded-3xl p-5 mb-5 space-y-3">
        <p className="text-white font-semibold flex items-center gap-2"><span>👤</span> Account</p>

        {[
          { label: "Account ID", val: user?.id?.slice(0, 16) + "…" ?? "—" },
          { label: "Auth method", val: user?.app_metadata?.provider ?? "email" },
          { label: "Member since", val: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "long" }) : "—" },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <p className="text-sm" style={{ color: "rgba(186,216,247,0.5)" }}>{row.label}</p>
            <p className="text-sm text-white font-medium" style={{ fontFamily: "JetBrains Mono, monospace" }}>{row.val}</p>
          </div>
        ))}
      </section>

      {/* ── App info ── */}
      <section className="glass-card rounded-3xl p-5 mb-6 space-y-2">
        <p className="text-white font-semibold flex items-center gap-2"><span>ℹ️</span> App</p>
        {[
          { label: "Version", val: "1.0.0" },
          { label: "Region", val: "Nigeria 🇳🇬" },
          { label: "Support", val: "support@fastwaybill.ng" },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <p className="text-sm" style={{ color: "rgba(186,216,247,0.5)" }}>{row.label}</p>
            <p className="text-sm text-white font-medium">{row.val}</p>
          </div>
        ))}
      </section>

      {/* Sign out */}
      <button onClick={handleSignOut}
        className="w-full py-4 rounded-2xl text-base font-semibold transition-all"
        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
        Sign Out
      </button>
    </div>
  );
}
