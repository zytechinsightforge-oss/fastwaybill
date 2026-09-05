import { useState } from "react";
import { useNavigate } from "react-router";
import MapView from "../components/MapView";
import { DISPATCH_RATES, LAGOS_CENTER } from "../data/constants";
import { useRequireAuth } from "../hooks/useRequireAuth";

type DispatchStep = "form" | "payment" | "pickup" | "transit" | "delivered";

export default function Dispatch() {
  const nav = useNavigate();
  const [step, setStep] = useState<DispatchStep>("form");
  const [sender, setSender] = useState({ name: "", phone: "", address: "" });
  const [recipient, setRecipient] = useState({ name: "", phone: "", address: "" });
  const [weight, setWeight] = useState(0);
  const [fragile, setFragile] = useState(false);
  const [insured, setInsured] = useState(false);
  const [note, setNote] = useState("");
  const [otp] = useState("482913");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [waybillId] = useState("FW-" + Math.random().toString(36).substr(2,6).toUpperCase());

  const selectedRate = DISPATCH_RATES.find(r => {
    const [min, max] = r.weight.replace(" kg", "").split("–").map(s => parseFloat(s.trim()));
    return weight >= min && weight <= max;
  }) || DISPATCH_RATES[0];

  const baseFare = selectedRate.price;
  const fragileExtra = fragile ? 200 : 0;
  const insureExtra = insured ? Math.round(baseFare * 0.05) : 0;
  const total = baseFare + fragileExtra + insureExtra;

  const { guardAction } = useRequireAuth();

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    guardAction(() => setStep("payment"));
  };

  const confirmPayment = () => {
    setStep("pickup");
    setTimeout(() => setStep("transit"), 4000);
  };

  const confirmDelivery = () => {
    if (enteredOtp === otp) setStep("delivered");
  };

  return (
    <div className="pt-16 h-screen flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-[420px] flex flex-col border-r border-white/8 overflow-y-auto" style={{ background: "#0D1F47" }}>

        {step === "form" && (
          <form onSubmit={placeOrder} className="p-5 space-y-5 flex-1">
            <div>
              <h2 className="font-outfit text-2xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Send a Parcel</h2>
              <p className="text-[#BAD8F7]/50 text-sm">Upfront pricing. OTP delivery. Full chain-of-custody.</p>
            </div>

            {/* Sender */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide flex items-center gap-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                Sender Details
              </p>
              {[
                { key: "name", ph: "Your full name", type: "text" },
                { key: "phone", ph: "Your phone number", type: "tel" },
                { key: "address", ph: "Pickup address", type: "text" },
              ].map(f => (
                <input key={f.key} type={f.type} required placeholder={f.ph}
                  value={(sender as Record<string,string>)[f.key]}
                  onChange={e => setSender(s => ({ ...s, [f.key]: e.target.value }))}
                  className="w-full bg-transparent text-white text-sm outline-none border-b border-white/10 pb-2 placeholder-[#BAD8F7]/40 focus:border-[#F5820D] transition-all" />
              ))}
            </div>

            {/* Recipient */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide flex items-center gap-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                <span className="w-3 h-3 rounded-full bg-[#F5820D] inline-block" />
                Recipient Details
              </p>
              {[
                { key: "name", ph: "Recipient full name", type: "text" },
                { key: "phone", ph: "Recipient phone (for OTP)", type: "tel" },
                { key: "address", ph: "Delivery address", type: "text" },
              ].map(f => (
                <input key={f.key} type={f.type} required placeholder={f.ph}
                  value={(recipient as Record<string,string>)[f.key]}
                  onChange={e => setRecipient(r => ({ ...r, [f.key]: e.target.value }))}
                  className="w-full bg-transparent text-white text-sm outline-none border-b border-white/10 pb-2 placeholder-[#BAD8F7]/40 focus:border-[#F5820D] transition-all" />
              ))}
            </div>

            {/* Parcel details */}
            <div className="glass-card rounded-2xl p-4 space-y-4">
              <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Parcel Details</p>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#BAD8F7]/70 text-sm">Weight (kg)</span>
                  <span className="text-white font-semibold">{weight} kg</span>
                </div>
                <input type="range" min={0} max={30} step={0.5} value={weight} onChange={e => setWeight(+e.target.value)}
                  className="w-full accent-[#F5820D]" />
                <div className="flex justify-between text-[#BAD8F7]/30 text-xs mt-1"><span>0 kg</span><span>30 kg</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DISPATCH_RATES.map(r => (
                  <div key={r.weight} className={`p-2 rounded-xl border text-center transition-all ${selectedRate === r ? "border-[#F5820D] bg-[#F5820D]/10" : "border-white/10"}`}>
                    <div className="text-lg">{r.icon}</div>
                    <p className="text-white text-xs font-semibold">{r.weight}</p>
                    <p className="text-[#F5820D] text-sm font-bold">₦{r.price.toLocaleString()}</p>
                    <p className="text-[#BAD8F7]/50 text-[10px]">{r.tag}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { key: "fragile", label: "Fragile Item (+₦200)", val: fragile, set: setFragile },
                  { key: "insured", label: "Insure parcel (+5%)", val: insured, set: setInsured },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => opt.set(!opt.val)}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${opt.val ? "bg-[#F5820D] border-[#F5820D]" : "border-white/30"}`}>
                      {opt.val && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-[#BAD8F7]/70 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
              <input value={note} onChange={e => setNote(e.target.value)}
                placeholder="Special instructions (optional)"
                className="w-full bg-white/5 rounded-xl px-3 py-2 text-white text-sm outline-none border border-white/10 placeholder-[#BAD8F7]/30" />
            </div>

            {/* Fare summary */}
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>Fare Breakdown</p>
              <div className="flex justify-between text-sm"><span className="text-[#BAD8F7]/60">Base rate ({selectedRate.weight})</span><span className="text-white">₦{baseFare.toLocaleString()}</span></div>
              {fragile && <div className="flex justify-between text-sm"><span className="text-[#BAD8F7]/60">Fragile handling</span><span className="text-white">₦200</span></div>}
              {insured && <div className="flex justify-between text-sm"><span className="text-[#BAD8F7]/60">Insurance (5%)</span><span className="text-white">₦{insureExtra}</span></div>}
              <div className="border-t border-white/8 pt-2 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="font-outfit text-xl font-900 text-[#F5820D]" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4 rounded-2xl text-base font-outfit font-700" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
              Create Waybill → ₦{total.toLocaleString()}
            </button>
          </form>
        )}

        {step === "payment" && (
          <div className="flex-1 flex flex-col p-5 gap-4">
            <div>
              <h3 className="font-outfit text-xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Confirm & Pay</h3>
              <p className="text-[#BAD8F7]/50 text-sm">Waybill ID: <span className="text-[#F5820D] font-mono">{waybillId}</span></p>
            </div>
            <div className="glass-card rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">From</span><span className="text-white">{sender.address || "Lekki Phase 1"}</span></div>
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">To</span><span className="text-white">{recipient.address || "Victoria Island"}</span></div>
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Recipient OTP</span><span className="text-[#F5820D] font-mono">{otp}</span></div>
              <div className="flex justify-between font-semibold border-t border-white/8 pt-2"><span className="text-white">Total</span><span className="text-[#F5820D]">₦{total.toLocaleString()}</span></div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-[#BAD8F7]/60 text-xs mb-3 uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Pay with</p>
              <div className="grid grid-cols-2 gap-2">
                {[{ icon: "💳", label: "FastWallet", sub: "₦24,750" }, { icon: "🏦", label: "Bank Transfer", sub: "GTBank" }, { icon: "📞", label: "USSD *737#", sub: "No data" }, { icon: "🏪", label: "POS Agent", sub: "1,200+ agents" }].map(m => (
                  <button key={m.label} onClick={confirmPayment}
                    className="glass-card rounded-xl p-3 text-left hover:border-[#F5820D]/40 hover:bg-[#F5820D]/5 transition-all border border-white/10">
                    <span className="text-xl">{m.icon}</span>
                    <p className="text-white text-xs font-semibold mt-1">{m.label}</p>
                    <p className="text-[#BAD8F7]/50 text-[10px]">{m.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "pickup" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-5">
            <div className="text-5xl animate-bounce">📸</div>
            <div>
              <h3 className="font-outfit text-xl font-900 text-white mb-2" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Rider at Pickup</h3>
              <p className="text-[#BAD8F7]/60 text-sm">Photographing parcel and logging timestamp...</p>
            </div>
            <div className="glass-card rounded-2xl p-4 w-full text-left space-y-2">
              {["Rider verified identity ✓", "Parcel photographed ✓", "Chain-of-custody sealed ✓", "Timestamp logged: " + new Date().toLocaleTimeString()].map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-green-400 text-sm">
                  <span>{c}</span>
                </div>
              ))}
            </div>
            <p className="text-[#BAD8F7]/40 text-sm">Matching to nearest available rider...</p>
          </div>
        )}

        {step === "transit" && (
          <div className="flex-1 flex flex-col p-5 gap-4">
            <div>
              <h3 className="font-outfit text-xl font-900 text-white" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>In Transit</h3>
              <p className="text-[#BAD8F7]/50 text-sm">Live tracking · ETA 28 min</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white text-sm font-semibold">Live GPS</span>
                </div>
                <span className="text-[#BAD8F7]/60 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>{waybillId}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="map-dot" />
                <div className="flex-1 h-px bg-[#F5820D]" style={{ background: "linear-gradient(to right, #22c55e, #F5820D)" }} />
                <div className="w-3 h-3 rounded-sm bg-[#F5820D] flex items-center justify-center text-[8px]">🏁</div>
              </div>
              <div className="flex justify-between text-xs text-[#BAD8F7]/60">
                <span>{sender.address || "Lekki Phase 1"}</span>
                <span>{recipient.address || "Victoria Island"}</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <p className="text-[#BAD8F7]/60 text-xs mb-3 uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Recipient OTP (share with recipient)</p>
              <div className="flex justify-center gap-2">
                {otp.split("").map((d, i) => (
                  <div key={i} className="w-10 h-12 bg-[#1B3A7A] rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ fontFamily: "JetBrains Mono, monospace" }}>{d}</div>
                ))}
              </div>
              <p className="text-[#BAD8F7]/40 text-xs text-center mt-3">Rider needs this OTP from recipient to release parcel</p>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <p className="text-[#BAD8F7]/60 text-xs mb-2 uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Public tracking link</p>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                <span className="text-[#BAD8F7]/60 text-xs flex-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>fastwb.ng/track/{waybillId}</span>
                <button className="bg-[#F5820D] text-white text-xs px-3 py-1 rounded-lg">Copy</button>
              </div>
            </div>

            <button onClick={() => setStep("delivered")} className="btn-primary py-4 rounded-2xl text-base mt-auto">
              Simulate Delivery (Demo)
            </button>
          </div>
        )}

        {step === "delivered" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-5">
            <div className="text-6xl">✅</div>
            <div>
              <h3 className="font-outfit text-2xl font-900 text-white mb-2" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Delivered!</h3>
              <p className="text-[#BAD8F7]/60">Proof of Delivery sent to your email. ₦{total.toLocaleString()} deducted.</p>
            </div>
            <div className="glass-card rounded-2xl p-4 w-full text-left space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Waybill</span><span className="text-white font-mono">{waybillId}</span></div>
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Delivered to</span><span className="text-white">{recipient.name || "Recipient"}</span></div>
              <div className="flex justify-between"><span className="text-[#BAD8F7]/60">POD</span><span className="text-green-400">📄 Sent to email</span></div>
            </div>
            <button onClick={() => { setStep("form"); }} className="btn-primary w-full py-4 rounded-2xl">Send Another Parcel</button>
            <button onClick={() => nav("/dashboard")} className="btn-outline w-full py-3 rounded-2xl text-sm">Go to Dashboard</button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: "400px" }}>
        <MapView center={LAGOS_CENTER} zoom={12} markerA={[3.3792, 6.5244]} markerB={[3.41, 6.51]} height="100%" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-card rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F5820D] animate-pulse" />
          <span className="text-white text-xs font-semibold">Dispatch Route — Lagos</span>
        </div>
      </div>
    </div>
  );
}
