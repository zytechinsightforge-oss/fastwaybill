import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import logoImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.32_AM__1_.jpeg";
import riderImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.30_AM.jpeg";

type Mode = "login" | "signup";
type Method = "options" | "email" | "phone" | "otp";

export default function Login() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect") || "/dashboard";
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithPhone, verifyPhoneOtp } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [method, setMethod] = useState<Method>("options");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Phone fields
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) nav(redirectTo, { replace: true });
  }, [user, nav, redirectTo]);

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    await signInWithGoogle();
    // Page will redirect via OAuth — no need to setLoading(false)
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let err: string | null;
    if (mode === "signup") {
      err = await signUpWithEmail(email, password, name);
      if (!err) {
        setSuccess("Account created! Check your email to verify, then log in.");
        setMode("login");
        setMethod("options");
      }
    } else {
      err = await signInWithEmail(email, password);
      if (!err) nav(redirectTo, { replace: true });
    }
    if (err) setError(err);
    setLoading(false);
  };

  const handlePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const err = await signInWithPhone(phone);
    if (err) { setError(err); setLoading(false); return; }
    setMethod("otp");
    setLoading(false);
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const err = await verifyPhoneOtp(phone, otp.join(""));
    if (err) { setError(err); setLoading(false); return; }
    nav(redirectTo, { replace: true });
  };

  const handleOtpInput = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.replace(/\D/g, "").slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
    if (!val && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const reset = () => { setMethod("options"); setError(""); setSuccess(""); };

  return (
    <div className="min-h-screen flex" style={{ background: "#0D1F47" }}>

      {/* Left — brand panel */}
      <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden">
        <img src={riderImg} alt="FastWaybill rider" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,31,71,0.92) 0%, rgba(27,58,122,0.75) 100%)" }} />
        <div className="relative z-10 flex flex-col h-full p-14 justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src={logoImg} alt="FastWaybill" className="w-full h-full object-cover" />
            </div>
            <span className="font-outfit text-white text-2xl font-900" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              Fast<span className="text-[#F5820D]">Waybill</span>
            </span>
          </Link>

          <div>
            <h2 className="font-outfit text-5xl font-900 text-white mb-4 leading-tight" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              Anything.<br />Anywhere.<br /><span className="text-[#F5820D]">On Time.</span>
            </h2>
            <p className="text-[#BAD8F7]/70 text-lg mb-8">Nigeria's #1 dual-mode logistics platform. Flat rates. Zero surge. Real GPS.</p>
            <div className="grid grid-cols-2 gap-3">
              {["🚫 No surge pricing", "📸 Photo pickup seal", "🔐 OTP delivery", "🆘 One-tap SOS"].map(f => (
                <div key={f} className="glass-card rounded-xl px-3 py-2.5 text-[#BAD8F7]/80 text-sm">{f}</div>
              ))}
            </div>
          </div>

          <p className="text-[#BAD8F7]/30 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            © 2026 FastWaybill Logistics Ltd · RC: 1897364
          </p>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm py-8">

          {/* Logo (mobile only) */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-9 h-9 rounded-xl overflow-hidden">
              <img src={logoImg} alt="FastWaybill" className="w-full h-full object-cover" />
            </div>
            <span className="font-outfit text-white text-xl font-900" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              Fast<span className="text-[#F5820D]">Waybill</span>
            </span>
          </Link>

          {/* Mode toggle */}
          <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
            {(["login", "signup"] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); reset(); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${mode === m ? "bg-[#F5820D] text-white" : "text-[#BAD8F7]/60 hover:text-white"}`}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Redirect context banner */}
          {redirectTo !== "/dashboard" && (
            <div className="glass-card rounded-xl p-3 mb-6 flex items-center gap-2 border border-[#F5820D]/30">
              <span className="text-[#F5820D]">🔒</span>
              <p className="text-[#BAD8F7]/80 text-xs">Sign in to complete your action on FastWaybill</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/15 border border-green-500/30 rounded-xl p-3 mb-5">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 mb-5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* ── OPTIONS SCREEN ── */}
          {method === "options" && (
            <div className="space-y-3">
              <h3 className="font-outfit text-2xl font-900 text-white mb-6" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
                {mode === "login" ? "Welcome back 👋" : "Join FastWaybill 🚀"}
              </h3>

              {/* Google */}
              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 group">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-white font-semibold flex-1 text-left">Continue with Google</span>
                <span className="text-[#BAD8F7]/40 text-xs">→</span>
              </button>

              {/* Phone */}
              <button onClick={() => setMethod("phone")}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all group">
                <span className="text-xl">📱</span>
                <span className="text-white font-semibold flex-1 text-left">Continue with Phone (OTP)</span>
                <span className="text-[#BAD8F7]/40 text-xs">→</span>
              </button>

              {/* Email */}
              <button onClick={() => setMethod("email")}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all group">
                <span className="text-xl">✉️</span>
                <span className="text-white font-semibold flex-1 text-left">Continue with Email</span>
                <span className="text-[#BAD8F7]/40 text-xs">→</span>
              </button>

              <div className="pt-4 text-center">
                <p className="text-[#BAD8F7]/40 text-xs leading-relaxed">
                  By continuing, you agree to FastWaybill's{" "}
                  <span className="text-[#F5820D] cursor-pointer hover:underline">Terms of Service</span>
                  {" & "}
                  <span className="text-[#F5820D] cursor-pointer hover:underline">Privacy Policy</span>
                </p>
              </div>
            </div>
          )}

          {/* ── EMAIL FORM ── */}
          {method === "email" && (
            <form onSubmit={handleEmail} className="space-y-4">
              <button type="button" onClick={reset} className="flex items-center gap-2 text-[#BAD8F7]/60 hover:text-white text-sm mb-2 transition-colors">
                ← Back
              </button>
              <h3 className="font-outfit text-2xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
                {mode === "login" ? "Sign in with email" : "Create your account"}
              </h3>

              {mode === "signup" && (
                <div>
                  <label className="text-[#BAD8F7]/50 text-xs uppercase tracking-wide block mb-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder="Chukwuemeka Okafor"
                    className="w-full glass-card rounded-xl px-4 py-3 text-white bg-transparent outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/30" />
                </div>
              )}

              <div>
                <label className="text-[#BAD8F7]/50 text-xs uppercase tracking-wide block mb-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full glass-card rounded-xl px-4 py-3 text-white bg-transparent outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/30" />
              </div>

              <div>
                <label className="text-[#BAD8F7]/50 text-xs uppercase tracking-wide block mb-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                    placeholder="Min. 8 characters"
                    className="w-full glass-card rounded-xl px-4 py-3 pr-12 text-white bg-transparent outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/30" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BAD8F7]/40 hover:text-white text-xs">
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <div className="text-right">
                  <button type="button" className="text-[#F5820D] text-xs hover:underline">Forgot password?</button>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
              </button>

              <p className="text-center text-[#BAD8F7]/40 text-sm">
                {mode === "login" ? "No account?" : "Already have one?"}{" "}
                <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                  className="text-[#F5820D] hover:underline font-semibold">
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </form>
          )}

          {/* ── PHONE FORM ── */}
          {method === "phone" && (
            <form onSubmit={handlePhone} className="space-y-4">
              <button type="button" onClick={reset} className="flex items-center gap-2 text-[#BAD8F7]/60 hover:text-white text-sm mb-2 transition-colors">
                ← Back
              </button>
              <h3 className="font-outfit text-2xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
                Enter your phone
              </h3>
              <p className="text-[#BAD8F7]/50 text-sm mb-4">We'll send a 6-digit OTP via SMS</p>

              <div className="flex gap-2">
                <div className="glass-card rounded-xl px-3 py-3 flex items-center gap-1.5 text-white text-sm shrink-0 border border-white/10">
                  🇳🇬 <span className="text-[#BAD8F7]/60">+234</span>
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                  placeholder="0812 345 6789"
                  className="flex-1 glass-card rounded-xl px-4 py-3 text-white bg-transparent outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/30"
                  style={{ fontFamily: "JetBrains Mono, monospace" }} />
              </div>

              <button type="submit" disabled={loading || phone.length < 10}
                className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </form>
          )}

          {/* ── OTP VERIFICATION ── */}
          {method === "otp" && (
            <form onSubmit={handleOtp} className="space-y-6">
              <div>
                <h3 className="font-outfit text-2xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
                  Enter OTP
                </h3>
                <p className="text-[#BAD8F7]/50 text-sm">
                  Sent to +234 {phone.replace(/^0/, "")}
                </p>
              </div>

              <div className="flex gap-2 justify-between">
                {otp.map((d, i) => (
                  <input key={i} id={`otp-${i}`}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleOtpInput(e.target.value, i)}
                    onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }}
                    className="w-12 h-14 text-center text-white text-xl font-bold glass-card rounded-xl outline-none border border-white/10 focus:border-[#F5820D] bg-transparent transition-all"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button type="submit" disabled={loading || otp.join("").length < 6}
                className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                {loading ? "Verifying..." : "Verify & Enter →"}
              </button>

              <div className="text-center">
                <button type="button" onClick={() => handlePhone({ preventDefault: () => {} } as React.FormEvent)}
                  className="text-[#BAD8F7]/40 text-sm hover:text-[#F5820D] transition-colors">
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
