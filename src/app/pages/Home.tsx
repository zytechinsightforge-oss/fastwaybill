import { useState } from "react";
import { Link } from "react-router";
import riderImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.30_AM.jpeg";
import brandSuiteImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.31_AM__1_.jpeg";
import heroBannerImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.31_AM.jpeg";
import logoImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.32_AM__1_.jpeg";

type Mode = "ride" | "dispatch";

const ZONE_RATES = [
  { zone: "Island → Mainland", flat: "₦1,200", eta: "22 min" },
  { zone: "Lekki → VI", flat: "₦800", eta: "14 min" },
  { zone: "Ikeja → Surulere", flat: "₦950", eta: "18 min" },
  { zone: "Ajah → CMS", flat: "₦1,400", eta: "35 min" },
];

const DISPATCH_RATES = [
  { weight: "0 – 2 kg", price: "₦600", tag: "Envelope / Docs" },
  { weight: "2 – 5 kg", price: "₦950", tag: "Small Parcel" },
  { weight: "5 – 15 kg", price: "₦1,600", tag: "Medium Box" },
  { weight: "15 – 30 kg", price: "₦2,800", tag: "Large Cargo" },
];

const STATS = [
  { value: "50K+", label: "Active Riders" },
  { value: "2.3M", label: "Trips Completed" },
  { value: "4.87", label: "Avg. Driver Rating" },
  { value: "99.2%", label: "On-Time Delivery" },
  { value: "₦0", label: "Surge Fees Charged" },
];

const HOW_RIDE = [
  { step: "01", title: "Set Pickup & Drop-off", body: "Enter your origin and destination. Our zone engine calculates a flat rate instantly — no hidden surges." },
  { step: "02", title: "Get Matched in 90s", body: "We match you to the nearest NIN-verified driver. See their photo, plate, and live rating before they arrive." },
  { step: "03", title: "Track & Ride Safely", body: "Live GPS tracking, in-app SOS button, and automated trip sharing to your emergency contacts." },
  { step: "04", title: "Pay via Wallet or Card", body: "Settle from your unified FastWaybill Wallet. Get an e-receipt with trip proof within 24 hours." },
];

const HOW_DISPATCH = [
  { step: "01", title: "Create a Waybill", body: "Enter parcel weight, dimensions, pickup address, and recipient details. Get upfront pricing immediately." },
  { step: "02", title: "Rider Arrives & Photos", body: "The assigned rider photographs the parcel at pickup, logs the timestamp, and initiates the chain-of-custody seal." },
  { step: "03", title: "Track in Real Time", body: "End-to-end live tracking with geofence alerts. Share a public tracking link with the recipient — no app required." },
  { step: "04", title: "OTP Delivery Confirmation", body: "Recipient enters a 6-digit OTP to release the parcel. Proof of Delivery is auto-sent to your email." },
];

const UNIQUE_FEATURES = [
  { icon: "🛡️", title: "Zero Surge Pricing — Ever", body: "Flat zone-based rates during peak hours, rain, or traffic. We absorb demand volatility.", badge: "RIDE" },
  { icon: "📸", title: "Mandatory Pickup Photo Seal", body: "Every dispatch job requires a timestamped photo at pickup and delivery. Disputes resolved with visual evidence.", badge: "DISPATCH" },
  { icon: "🔐", title: "Recipient OTP Release", body: "Parcels are only released when the intended recipient enters their 6-digit OTP.", badge: "DISPATCH" },
  { icon: "🆘", title: "One-Tap SOS Broadcast", body: "A panic button that simultaneously notifies 3 emergency contacts, local police, and our 24/7 Safety Desk.", badge: "RIDE" },
  { icon: "💳", title: "Unified FastWallet", body: "One wallet for rides and dispatches. Fund via Paystack, USSD, POS agents, or Crypto.", badge: "BOTH" },
  { icon: "⭐", title: "Anti-Cancellation Penalty Engine", body: "Drivers who cancel after acceptance face automatic ₦500 deductions and 3-strike bans.", badge: "RIDE" },
  { icon: "🗺️", title: "Offline-First Tracking", body: "GPS positions cached locally and synced in bursts. Deliveries don't break on 2G.", badge: "BOTH" },
  { icon: "💬", title: "24/7 WhatsApp Support", body: "Live agents reachable via WhatsApp Business API within 90 seconds — no IVR trees.", badge: "BOTH" },
];

function BadgeChip({ label }: { label: string }) {
  const cl: Record<string, string> = {
    RIDE: "bg-[#1B3A7A]/60 text-[#BAD8F7] border border-[#3B6CB7]/50",
    DISPATCH: "bg-[#F5820D]/15 text-[#F5820D] border border-[#F5820D]/40",
    BOTH: "bg-[#3B6CB7]/20 text-[#BAD8F7] border border-[#3B6CB7]/40",
  };
  return <span className={`feature-chip ${cl[label]}`}>{label}</span>;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("ride");
  const [showSOS, setShowSOS] = useState(false);
  const steps = mode === "ride" ? HOW_RIDE : HOW_DISPATCH;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0D1F47 0%, #1B3A7A 50%, #0D1F47 100%)" }} />
          <div className="absolute right-0 top-0 h-full w-[45%]" style={{
            background: "linear-gradient(200deg, #F5820D 0%, #D96A00 60%, transparent 100%)",
            clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)"
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          <div>
            <span className="feature-chip bg-[#F5820D]/15 text-[#F5820D] border border-[#F5820D]/30 mb-6 inline-flex">🇳🇬 Nigeria's #1 Dual-Mode Platform</span>
            <h1 className="font-outfit text-5xl sm:text-6xl xl:text-7xl font-900 leading-[1.04] mb-6 text-white"
              style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              Anything.<br /><span className="gradient-text-orange">Anywhere.</span><br />On Time.
            </h1>
            <p className="text-[#BAD8F7]/80 text-lg leading-relaxed mb-8 max-w-lg">
              The first logistics platform in Nigeria that separates ride-hailing and parcel delivery into two purpose-built modes — flat rates, zero surge, military-grade safety, one unified wallet.
            </p>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 w-fit mb-8">
              {(["ride", "dispatch"] as Mode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-6 py-2.5 rounded-full font-outfit text-sm transition-all duration-300 ${mode === m ? "bg-[#F5820D] text-white shadow-lg" : "text-[#BAD8F7] hover:text-white"}`}
                  style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                  {m === "ride" ? "🚖 RIDE MODE" : "📦 DISPATCH MODE"}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center mb-6">
              <Link to={mode === "ride" ? "/ride" : "/dispatch"} className="btn-primary px-8 py-4 rounded-2xl text-base">
                {mode === "ride" ? "Book a Ride Now" : "Send a Parcel"} →
              </Link>
              <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{mode === "ride" ? "✅" : "📍"}</span>
                <div>
                  <p className="text-white text-xs font-semibold">{mode === "ride" ? "No surge pricing" : "Upfront pricing"}</p>
                  <p className="text-[#BAD8F7]/60 text-[10px]">{mode === "ride" ? "Flat zone rates — always" : "Weight + distance calculated"}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {["App Store", "Google Play"].map(store => (
                <div key={store} className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-white/12 transition-all">
                  <span className="text-xl">{store === "App Store" ? "🍎" : "🤖"}</span>
                  <div>
                    <p className="text-[#BAD8F7]/50 text-[9px] uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Download on</p>
                    <p className="text-white text-sm font-semibold">{store}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:flex justify-end items-center">
            <div className="relative w-[480px] h-[480px]">
              <img src={riderImg} alt="FastWaybill rider" className="absolute inset-0 w-full h-full object-cover rounded-3xl" style={{ objectPosition: "center 20%" }} />
              <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(to top, rgba(13,31,71,0.8) 0%, transparent 50%)" }} />

              <div className="wallet-card absolute -left-16 top-12 rounded-2xl p-4 w-52 shadow-2xl">
                <p className="text-[#BAD8F7]/60 text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>FastWallet Balance</p>
                <p className="text-white text-2xl font-outfit font-900" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>₦24,750</p>
                <div className="flex items-center gap-2 mt-3">
                  <Link to="/wallet" className="flex-1 bg-[#F5820D] text-white text-xs rounded-lg py-1.5 font-semibold text-center">Top Up</Link>
                  <Link to="/wallet" className="flex-1 btn-outline text-xs rounded-lg py-1.5 text-center">Withdraw</Link>
                </div>
              </div>

              <div className="absolute -right-8 bottom-24 glass-card rounded-2xl p-3 w-44 cursor-pointer" onClick={() => setShowSOS(true)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative sos-pulse w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">SOS</div>
                  <div>
                    <p className="text-white text-xs font-semibold">Safety Alert</p>
                    <p className="text-green-400 text-[10px]">● System Active</p>
                  </div>
                </div>
                <p className="text-[#BAD8F7]/60 text-[10px]">Tap SOS → notifies 3 contacts + Safety Desk</p>
              </div>

              <div className="absolute bottom-5 left-5 right-5 glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3B6CB7] flex items-center justify-center text-xl">👨🏿‍✈️</div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">Emeka O. • KJA 472 BT</p>
                  <div className="flex items-center gap-1">
                    {"★★★★★".split("").map((s, i) => <span key={i} className="text-[#F5820D] text-xs">{s}</span>)}
                    <span className="text-[#BAD8F7]/60 text-xs ml-1">4.97</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-xs font-semibold">2 min</p>
                  <p className="text-[#BAD8F7]/50 text-[10px]">away</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-white/8" style={{ background: "rgba(27,58,122,0.3)" }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-outfit text-3xl font-900 text-[#F5820D]" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>{s.value}</p>
                <p className="text-[#BAD8F7]/60 text-xs mt-1 uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL MODE SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="font-outfit text-4xl sm:text-5xl font-900 text-white mb-4" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
            Two Modes. One <span className="gradient-text-orange">Mission.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RIDE MODE */}
          <div className="mode-card-ride rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: "#BAD8F7", filter: "blur(60px)", transform: "translate(30%, -30%)" }} />
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="feature-chip bg-[#BAD8F7]/10 text-[#BAD8F7] border border-[#BAD8F7]/20 mb-3 inline-flex">🚖 RIDE MODE</span>
                <h3 className="font-outfit text-3xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Passenger<br />Transport</h3>
              </div>
              <div className="text-5xl">🚖</div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/8 mb-6">
              <div className="bg-white/5 px-4 py-2"><span className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Zone Flat Rates — No Surge Ever</span></div>
              {ZONE_RATES.map((z, i) => (
                <div key={i} className={`px-4 py-3 flex items-center justify-between ${i < ZONE_RATES.length - 1 ? "border-b border-white/5" : ""}`}>
                  <span className="text-[#BAD8F7]/80 text-sm">{z.zone}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold">{z.flat}</span>
                    <span className="text-[#BAD8F7]/40 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>{z.eta}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/ride" className="btn-outline w-full py-3 rounded-2xl text-sm text-center block">Book a Ride →</Link>
          </div>

          {/* DISPATCH MODE */}
          <div className="mode-card-dispatch rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20" style={{ background: "#0D1F47", filter: "blur(60px)", transform: "translate(30%, -30%)" }} />
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="feature-chip bg-white/15 text-white border border-white/30 mb-3 inline-flex">📦 DISPATCH MODE</span>
                <h3 className="font-outfit text-3xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Parcel<br />Delivery</h3>
              </div>
              <div className="text-5xl">📦</div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/20 mb-6">
              <div className="bg-white/10 px-4 py-2"><span className="text-white/70 text-xs uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Dispatch Pricing — Upfront Quote</span></div>
              {DISPATCH_RATES.map((r, i) => (
                <div key={i} className={`px-4 py-3 flex items-center justify-between ${i < DISPATCH_RATES.length - 1 ? "border-b border-white/10" : ""}`}>
                  <div>
                    <p className="text-white text-sm font-medium">{r.weight}</p>
                    <p className="text-white/50 text-xs">{r.tag}</p>
                  </div>
                  <span className="text-white font-outfit font-900 text-lg" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>{r.price}</span>
                </div>
              ))}
            </div>
            <Link to="/dispatch" className="block w-full py-3 rounded-2xl text-sm bg-white text-[#F5820D] font-outfit font-700 hover:bg-white/90 transition-all text-center" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
              Send a Parcel →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24" style={{ background: "rgba(27,58,122,0.15)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
            <h2 className="font-outfit text-4xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>From tap to <span className="gradient-text-orange">delivery</span></h2>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 w-fit">
              {(["ride", "dispatch"] as Mode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${mode === m ? "bg-[#F5820D] text-white" : "text-[#BAD8F7] hover:text-white"}`}
                  style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                  {m === "ride" ? "🚖 Ride" : "📦 Dispatch"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {steps.map((s, i) => (
              <div key={i} className="relative flex gap-5 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-mono shrink-0 z-10"
                    style={{ background: mode === "ride" ? "#3B6CB7" : "#F5820D", fontFamily: "JetBrains Mono, monospace" }}>
                    {s.step}
                  </div>
                  {i % 2 === 0 && i < steps.length - 2 && (
                    <div className="w-0.5 h-12 mt-2" style={{ background: mode === "ride" ? "rgba(59,108,183,0.3)" : "rgba(245,130,13,0.3)" }} />
                  )}
                </div>
                <div className="pb-4">
                  <h4 className="font-outfit font-700 text-white text-base mb-1.5" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>{s.title}</h4>
                  <p className="text-[#BAD8F7]/70 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UNIQUE FEATURES GRID */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="font-outfit text-4xl sm:text-5xl font-900 text-white mb-4" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
            Built for the <span className="gradient-text-orange">Nigerian reality</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {UNIQUE_FEATURES.map((f, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 hover:border-[#BAD8F7]/30 transition-all group cursor-default">
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="mb-3"><BadgeChip label={f.badge} /></div>
              <h4 className="font-outfit font-700 text-white text-sm mb-2 leading-snug group-hover:text-[#F5820D] transition-colors" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>{f.title}</h4>
              <p className="text-[#BAD8F7]/60 text-xs leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAFETY SECTION */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1F47, #1B3A7A)" }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="feature-chip bg-red-500/15 text-red-400 border border-red-500/30 mb-6 inline-flex">🛡️ Safety First</span>
              <h2 className="font-outfit text-4xl sm:text-5xl font-900 text-white mb-6" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
                The safest ride in <span className="gradient-text-orange">West Africa</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: "🔍", title: "17-Point Driver Verification", body: "NIN, BVN, vehicle doc, criminal background, guarantor sign-off, and face-match AI before any driver goes live." },
                  { icon: "📡", title: "Live GPS + Geofence Alerts", body: "If a trip deviates more than 300m from the optimal route, you get an immediate SMS and in-app notification." },
                  { icon: "🆘", title: "3-Layer SOS System", body: "Emergency contacts → Safety Desk → Nearest police station. All notified simultaneously with live coordinates." },
                  { icon: "🎥", title: "Optional Dashcam Integration", body: "Tamper-proof dashcam program. Footage encrypted and retained 30 days for dispute resolution." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 glass-card rounded-xl p-4">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-[#BAD8F7]/60 text-xs leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img src={heroBannerImg} alt="Fast Waybill Logistics" className="w-full max-w-md rounded-3xl object-cover" />
                <div className="absolute -bottom-4 -right-4 glass-card rounded-2xl p-4 w-56">
                  <p className="text-[#BAD8F7]/60 text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>Active Safety Systems</p>
                  {["GPS Tracking", "Driver Verified", "SOS Ready", "Geofence ON"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                      <span className="text-white text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRIVER CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={brandSuiteImg} alt="FastWaybill brand" className="w-full rounded-3xl object-cover" />
            <div className="absolute top-5 left-5 glass-card rounded-2xl px-4 py-3">
              <p className="text-[#BAD8F7]/60 text-[10px] uppercase tracking-wide mb-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>This week's top earner</p>
              <p className="text-white font-outfit font-900 text-xl" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>₦87,450</p>
              <p className="text-[#BAD8F7]/60 text-xs">Chukwuemeka A. • Lagos Island</p>
            </div>
          </div>
          <div>
            <span className="feature-chip bg-[#F5820D]/15 text-[#F5820D] border border-[#F5820D]/30 mb-6 inline-flex">🚀 Drive with FastWaybill</span>
            <h2 className="font-outfit text-4xl sm:text-5xl font-900 text-white mb-4" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              Earn more. <span className="gradient-text-orange">Worry less.</span>
            </h2>
            <p className="text-[#BAD8F7]/70 mb-8 leading-relaxed">Nigeria's most driver-friendly logistics platform. No arbitrary deductions, transparent earnings, and perks that actually matter on the road.</p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/driver" className="btn-primary px-8 py-4 rounded-2xl text-base">Register as a Driver</Link>
              <Link to="/login" className="btn-outline px-6 py-4 rounded-2xl text-base">Dispatch Rider →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #F5820D 0%, #D96A00 40%, #1B3A7A 100%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="font-outfit text-5xl sm:text-6xl font-900 text-white mb-6" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
            Ready to move at<br />FastWaybill speed?
          </h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            First ride is <strong>₦200 off</strong>. First dispatch waybill is <strong>free</strong>.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/ride" className="bg-white text-[#F5820D] font-outfit font-900 px-10 py-4 rounded-2xl text-lg hover:bg-white/90 transition-all shadow-xl" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
              🍎 Book a Ride
            </Link>
            <Link to="/dispatch" className="bg-[#1B3A7A] text-white font-outfit font-700 px-10 py-4 rounded-2xl text-lg border border-white/20 hover:bg-[#0D1F47] transition-all" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
              📦 Send a Parcel
            </Link>
          </div>
          <p className="text-white/50 text-sm mt-6">Also available via WhatsApp: <span className="text-white font-semibold">wa.me/+2348100000000</span></p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-16" style={{ background: "#080F26" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#BAD8F7]">
                  <img src={logoImg} alt="FastWaybill" className="w-full h-full object-cover" />
                </div>
                <span className="font-outfit font-900 text-white text-xl" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Fast<span className="text-[#F5820D]">Waybill</span></span>
              </div>
              <p className="text-[#BAD8F7]/50 text-sm leading-relaxed mb-4 max-w-xs">Nigeria's most trusted dual-mode logistics and mobility platform. Anything. Anywhere. On Time.</p>
            </div>
            {[
              { title: "Platform", links: [{ l: "Book a Ride", to: "/ride" }, { l: "Send a Parcel", to: "/dispatch" }, { l: "Track Order", to: "/track" }, { l: "FastWallet", to: "/wallet" }] },
              { title: "Drivers", links: [{ l: "Driver Console", to: "/driver" }, { l: "Sign In", to: "/login" }] },
              { title: "Account", links: [{ l: "Dashboard", to: "/dashboard" }, { l: "Wallet", to: "/wallet" }, { l: "Sign In", to: "/login" }] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-white font-outfit font-700 text-sm mb-4 uppercase tracking-wide" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l.l}><Link to={l.to} className="text-[#BAD8F7]/50 text-sm hover:text-[#F5820D] transition-colors">{l.l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#BAD8F7]/30 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>© 2026 FastWaybill Logistics Ltd. RC: 1897364. Lagos, Nigeria.</p>
          </div>
        </div>
      </footer>

      {showSOS && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setShowSOS(false)}>
          <div className="bg-[#1B3A7A] border border-red-500/50 rounded-3xl p-8 max-w-sm w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="sos-pulse w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-outfit font-900" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>SOS</div>
            </div>
            <h3 className="font-outfit text-2xl font-900 text-white mb-3" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Emergency Alert</h3>
            <p className="text-[#BAD8F7]/70 text-sm mb-6">Tapping SEND ALERT will simultaneously notify your 3 emergency contacts, the FastWaybill Safety Desk, and the nearest police station with your live GPS location.</p>
            <button className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-outfit font-700 rounded-2xl text-lg mb-3 transition-all" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
              🆘 SEND ALERT NOW
            </button>
            <button className="w-full py-3 btn-outline rounded-2xl text-sm" onClick={() => setShowSOS(false)}>Cancel — I am safe</button>
          </div>
        </div>
      )}
    </div>
  );
}
