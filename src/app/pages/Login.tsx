import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import logoImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.32_AM__1_.jpeg";
import riderImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.30_AM.jpeg";

type Mode = "login" | "signup";
type Method = "options" | "email" | "phone" | "otp" | "kyc";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // KYC state
  const [nin, setNin] = useState("");
  const [dob, setDob] = useState("");
  const [kycLoading, setKycLoading] = useState(false);
  const [kycStep, setKycStep] = useState<"form" | "pending">("form");

  useEffect(() => {
    if (user) nav(redirectTo, { replace: true });
  }, [user, nav, redirectTo]);

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    await signInWithGoogle();
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (mode === "signup") {
      const err = await signUpWithEmail(email, password, name);
      if (!err) {
        setMethod("kyc");
      } else {
        setError(err);
      }
    } else {
      const err = await signInWithEmail(email, password);
      if (!err) nav(redirectTo, { replace: true });
      else setError(err);
    }
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

  const handleKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nin.length < 11) { setError("Enter your 11-digit NIN"); return; }
    setKycLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 1800));
    setKycLoading(false);
    setKycStep("pending");
  };

  const skipKyc = () => nav(redirectTo, { replace: true });

  const reset = () => { setMethod("options"); setError(""); setSuccess(""); };

  const isWalletRedirect = redirectTo.includes("wallet");

  return (
    <div className="min-h-screen flex" style={{ background: "#0D1F47" }}>

      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden">
        <img src={riderImg} alt="FastWaybill rider" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,31,71,0.92) 0%, rgba(27,58,122,0.75) 100%)" }} />
        <div className="relative z-10 flex flex-col h-full p-14 justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src={logoImg} alt="FastWaybill" className="w-full h-full object-cover" />
            </div>
            <span className="font-outfit text-white text-2xl font-900" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              Fast<span style={{ color: "#F5820D" }}>Waybill</span>
            </span>
          </Link>
          <div>
            <h2 className="font-outfit text-5xl font-900 text-white mb-4 leading-tight" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              Anything.<br />Anywhere.<br /><span style={{ color: "#F5820D" }}>On Time.</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: "rgba(186,216,247,0.7)" }}>Nigeria's #1 dual-mode logistics platform.</p>
            <div className="grid grid-cols-2 gap-3">
              {["🚫 No surge pricing", "📸 Photo pickup seal", "🔐 OTP delivery", "🆘 One-tap SOS"].map(f => (
                <div key={f} className="glass-card rounded-xl px-3 py-2.5 text-sm" style={{ color: "rgba(186,216,247,0.8)" }}>{f}</div>
              ))}
            </div>
          </div>
          <p className="text-xs" style={{ color: "rgba(186,216,247,0.3)", fontFamily: "JetBrains Mono, monospace" }}>© 2026 FastWaybill Logistics Ltd · RC: 1897364</p>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm py-8">

          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-9 h-9 rounded-xl overflow-hidden">
              <img src={logoImg} alt="FastWaybill" className="w-full h-full object-cover" />
            </div>
            <span className="font-outfit text-white text-xl font-900" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              Fast<span style={{ color: "#F5820D" }}>Waybill</span>
            </span>
          </Link>

          {/* Wallet redirect banner */}
          {isWalletRedirect && method !== "kyc" && (
            <div className="rounded-xl p-3 mb-6 flex items-center gap-3" style={{ background: "rgba(245,130,13,0.12)", border: "1px solid rgba(245,130,13,0.3)" }}>
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-white text-sm font-semibold">FastWallet requires sign in</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(186,216,247,0.6)" }}>Sign in or create an account to access your wallet</p>
              </div>
            </div>
          )}

          {/* Mode toggle */}
          {method !== "kyc" && (
            <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
              {(["login", "signup"] as Mode[]).map(m => (
                <button key={m} onClick={() => { setMode(m); reset(); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize"
                  style={{ background: mode === m ? "#F5820D" : "transparent", color: mode === m ? "#fff" : "rgba(186,216,247,0.6)" }}>
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-xl p-3 mb-5" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* OPTIONS */}
          {method === "options" && (
            <div className="space-y-3">
              <h3 className="font-outfit text-2xl font-900 text-white mb-6" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
                {mode === "login" ? "Welcome back 👋" : "Join FastWaybill 🚀"}
              </h3>

              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all disabled:opacity-50"
                style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-white font-semibold flex-1 text-left">Continue with Google</span>
                <span className="text-xs" style={{ color: "rgba(186,216,247,0.4)" }}>→</span>
              </button>

              <button onClick={() => setMethod("phone")}
                className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}>
                <span className="text-xl">📱</span>
                <span className="text-white font-semibold flex-1 text-left">Continue with Phone (OTP)</span>
                <span className="text-xs" style={{ color: "rgba(186,216,247,0.4)" }}>→</span>
              </button>

              <button onClick={() => setMethod("email")}
                className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}>
                <span className="text-xl">✉️</span>
                <span className="text-white font-semibold flex-1 text-left">Continue with Email</span>
                <span className="text-xs" style={{ color: "rgba(186,216,247,0.4)" }}>→</span>
              </button>

              <p className="text-center text-xs pt-4" style={{ color: "rgba(186,216,247,0.4)" }}>
                By continuing, you agree to our{" "}
                <span style={{ color: "#F5820D" }} className="cursor-pointer hover:underline">Terms</span>
                {" & "}
                <span style={{ color: "#F5820D" }} className="cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>
          )}

          {/* EMAIL FORM */}
          {method === "email" && (
            <form onSubmit={handleEmail} className="space-y-4" autoComplete="on">
              <button type="button" onClick={reset} className="flex items-center gap-2 text-sm mb-2 transition-colors" style={{ color: "rgba(186,216,247,0.6)" }}>
                ← Back
              </button>
              <h3 className="font-outfit text-2xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
                {mode === "login" ? "Sign in" : "Create account"}
              </h3>

              {mode === "signup" && (
                <div>
                  <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: "rgba(186,216,247,0.5)", fontFamily: "JetBrains Mono, monospace" }}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    autoComplete="name" placeholder="Chukwuemeka Okafor"
                    className="w-full glass-card rounded-xl px-4 py-3 text-white bg-transparent outline-none transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
              )}

              <div>
                <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: "rgba(186,216,247,0.5)", fontFamily: "JetBrains Mono, monospace" }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  autoComplete={mode === "login" ? "email" : "email"}
                  placeholder="you@example.com"
                  className="w-full glass-card rounded-xl px-4 py-3 text-white bg-transparent outline-none transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: "rgba(186,216,247,0.5)", fontFamily: "JetBrains Mono, monospace" }}>Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    placeholder="Min. 8 characters"
                    className="w-full glass-card rounded-xl px-4 py-3 pr-12 text-white bg-transparent outline-none transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "rgba(186,216,247,0.4)" }}>
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <div className="text-right">
                  <button type="button" className="text-xs hover:underline" style={{ color: "#F5820D" }}>Forgot password?</button>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
              </button>

              <p className="text-center text-sm" style={{ color: "rgba(186,216,247,0.4)" }}>
                {mode === "login" ? "No account?" : "Already have one?"}{" "}
                <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                  className="font-semibold hover:underline" style={{ color: "#F5820D" }}>
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </form>
          )}

          {/* PHONE FORM */}
          {method === "phone" && (
            <form onSubmit={handlePhone} className="space-y-4" autoComplete="on">
              <button type="button" onClick={reset} className="flex items-center gap-2 text-sm mb-2" style={{ color: "rgba(186,216,247,0.6)" }}>
                ← Back
              </button>
              <h3 className="font-outfit text-2xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Enter your phone</h3>
              <p className="text-sm mb-4" style={{ color: "rgba(186,216,247,0.5)" }}>We'll send a 6-digit OTP via SMS</p>

              <div className="flex gap-2">
                <div className="glass-card rounded-xl px-3 py-3 flex items-center gap-1.5 text-white text-sm shrink-0" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  🇳🇬 <span style={{ color: "rgba(186,216,247,0.6)" }}>+234</span>
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                  autoComplete="tel" placeholder="0812 345 6789"
                  className="flex-1 glass-card rounded-xl px-4 py-3 text-white bg-transparent outline-none transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: "JetBrains Mono, monospace" }} />
              </div>

              <button type="submit" disabled={loading || phone.length < 10} className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </form>
          )}

          {/* OTP */}
          {method === "otp" && (
            <form onSubmit={handleOtp} className="space-y-6">
              <div>
                <h3 className="font-outfit text-2xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Enter OTP</h3>
                <p className="text-sm" style={{ color: "rgba(186,216,247,0.5)" }}>Sent to +234 {phone.replace(/^0/, "")}</p>
              </div>

              <div className="flex gap-2 justify-between">
                {otp.map((d, i) => (
                  <input key={i} id={`otp-${i}`}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleOtpInput(e.target.value, i)}
                    onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }}
                    className="w-12 h-14 text-center text-white text-xl font-bold glass-card rounded-xl outline-none bg-transparent transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: "JetBrains Mono, monospace" }}
                    autoFocus={i === 0} />
                ))}
              </div>

              <button type="submit" disabled={loading || otp.join("").length < 6} className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                {loading ? "Verifying..." : "Verify & Enter →"}
              </button>

              <div className="text-center">
                <button type="button" onClick={() => handlePhone({ preventDefault: () => {} } as React.FormEvent)}
                  className="text-sm hover:underline transition-colors" style={{ color: "rgba(186,216,247,0.4)" }}>
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* KYC STEP */}
          {method === "kyc" && (
            <div className="space-y-5">
              {kycStep === "form" ? (
                <>
                  <div className="text-center mb-2">
                    <div className="text-5xl mb-3">🛡️</div>
                    <h3 className="font-outfit text-2xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Verify Your Identity</h3>
                    <p className="text-sm mt-2" style={{ color: "rgba(186,216,247,0.5)" }}>
                      Required to activate your FastWallet and enable transfers above ₦50,000
                    </p>
                  </div>

                  <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(245,130,13,0.08)", border: "1px solid rgba(245,130,13,0.2)" }}>
                    <p className="text-sm font-semibold" style={{ color: "#F5820D" }}>Why we need this</p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(186,216,247,0.6)" }}>
                      Nigeria's CBN regulations require identity verification for financial services. Your data is encrypted and never shared with third parties.
                    </p>
                  </div>

                  <form onSubmit={handleKyc} className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: "rgba(186,216,247,0.5)", fontFamily: "JetBrains Mono, monospace" }}>NIN (National ID Number)</label>
                      <input type="text" inputMode="numeric" maxLength={11} value={nin}
                        onChange={e => setNin(e.target.value.replace(/\D/g, ""))}
                        placeholder="12345678901"
                        className="w-full glass-card rounded-xl px-4 py-3 text-white bg-transparent outline-none transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em" }} />
                      <p className="text-xs mt-1" style={{ color: "rgba(186,216,247,0.35)" }}>11-digit NIN from your ID card or NIMC slip</p>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wide block mb-1.5" style={{ color: "rgba(186,216,247,0.5)", fontFamily: "JetBrains Mono, monospace" }}>Date of Birth</label>
                      <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                        className="w-full glass-card rounded-xl px-4 py-3 text-white bg-transparent outline-none transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                    </div>

                    <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(186,216,247,0.06)" }}>
                      <p className="text-xs font-semibold text-white">Security features activated after verification:</p>
                      {["✅ Face ID / Fingerprint for wallet", "✅ Transfers up to ₦5,000,000/day", "✅ Virtual account number (your own bank account)", "✅ Full transaction history"].map(f => (
                        <p key={f} className="text-xs" style={{ color: "rgba(186,216,247,0.6)" }}>{f}</p>
                      ))}
                    </div>

                    <button type="submit" disabled={kycLoading || nin.length < 11 || !dob}
                      className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                      {kycLoading ? "Verifying with NIMC..." : "Verify Identity →"}
                    </button>

                    <button type="button" onClick={skipKyc}
                      className="w-full py-3 text-sm text-center transition-colors"
                      style={{ color: "rgba(186,216,247,0.4)" }}>
                      Skip for now (wallet limited to ₦50,000)
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-5 py-4">
                  <div className="text-6xl">⏳</div>
                  <h3 className="font-outfit text-2xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Verification Submitted</h3>
                  <p className="text-sm" style={{ color: "rgba(186,216,247,0.6)" }}>
                    We've submitted your NIN to NIMC for verification. This usually takes <strong className="text-white">2–5 minutes</strong>.
                  </p>
                  <div className="rounded-xl p-4 text-left space-y-2" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <p className="text-green-400 text-sm font-semibold">What happens next:</p>
                    <p className="text-xs" style={{ color: "rgba(186,216,247,0.6)" }}>1. NIMC confirms your NIN match</p>
                    <p className="text-xs" style={{ color: "rgba(186,216,247,0.6)" }}>2. You'll be notified by SMS/email</p>
                    <p className="text-xs" style={{ color: "rgba(186,216,247,0.6)" }}>3. Full wallet access is unlocked</p>
                  </div>
                  <button onClick={skipKyc} className="btn-primary w-full py-4 rounded-2xl text-base">
                    Continue to App →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
