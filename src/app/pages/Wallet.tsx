import { useState } from "react";
import { MOCK_TRANSACTIONS } from "../data/constants";

type Tab = "overview" | "topup" | "withdraw" | "history";

const BANKS: Record<string, string> = {
  "Opay": "999992",
  "GTBank": "058152522",
  "First Bank": "011152303",
  "Zenith Bank": "057083151",
  "Access Bank": "044150149",
  "UBA": "033153285",
  "Kuda Bank": "090267",
  "Palmpay": "999991",
  "Moniepoint": "090405",
};

export default function Wallet() {
  const [tab, setTab] = useState<Tab>("overview");
  const [topupAmount, setTopupAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("Opay");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<"form" | "confirm" | "sent">("form");
  const [topupSuccess, setTopupSuccess] = useState(false);

  const balance = 24750;
  const totalIn = MOCK_TRANSACTIONS.filter(t => t.type === "credit").reduce((a, b) => a + b.amount, 0);
  const totalOut = MOCK_TRANSACTIONS.filter(t => t.type === "debit").reduce((a, b) => a + b.amount, 0);

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "topup", label: "Top Up" },
    { id: "withdraw", label: "Withdraw" },
    { id: "history", label: "History" },
  ];

  // Verify account name (mocked — in production calls Paystack /bank/resolve)
  const verifyAccount = () => {
    if (accountNo.length < 10) return;
    setVerifying(true);
    setTimeout(() => {
      setAccountName("CHUKWUEMEKA OKAFOR");
      setVerifying(false);
    }, 1400);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawStep === "form") {
      setWithdrawStep("confirm");
      return;
    }
    setProcessing(true);
    // In production: POST /api/transfer with Paystack secret key on your server
    setTimeout(() => {
      setProcessing(false);
      setWithdrawStep("sent");
    }, 2500);
  };

  const openPaystack = () => {
    // Real Paystack inline payment — replace pk_test_... with your live public key
    const amount = Number(topupAmount);
    if (!amount || amount < 100) return;

    const handler = (window as unknown as { PaystackPop?: { setup: (opts: Record<string, unknown>) => { openIframe: () => void } } }).PaystackPop;
    if (handler) {
      handler.setup({
        key: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // ← replace with your Paystack public key
        email: "user@fastwaybill.ng",
        amount: amount * 100,
        currency: "NGN",
        ref: "FW-" + Date.now(),
        metadata: { custom_fields: [{ display_name: "Wallet Top-up", variable_name: "wallet_topup", value: "true" }] },
        callback: () => {
          setTopupSuccess(true);
          setTopupAmount("");
          setTimeout(() => { setTopupSuccess(false); setTab("overview"); }, 3000);
        },
        onClose: () => {},
      }).openIframe();
    } else {
      // Paystack.js not loaded — show USSD fallback
      alert("Top-up via USSD: Dial *737*50*" + amount + "#\n\nOr bank transfer to:\nGTBank · 0521234567\nAccount name: FastWaybill Logistics Ltd");
    }
  };

  return (
    <div className="pt-20 pb-20 md:pb-8 min-h-screen px-4 max-w-2xl mx-auto">

      {/* Balance card */}
      <div className="wallet-card rounded-3xl p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#F5820D", filter: "blur(80px)" }} />
        <p className="text-[#BAD8F7]/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>FastWallet Balance</p>
        <p className="font-outfit text-6xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
          ₦{balance.toLocaleString()}
        </p>
        <p className="text-[#BAD8F7]/40 text-sm mb-4">0812 345 6789 · Chukwuemeka O.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setTab("topup")} className="btn-primary px-6 py-2.5 rounded-xl text-sm">+ Top Up</button>
          <button onClick={() => setTab("withdraw")} className="btn-outline px-6 py-2.5 rounded-xl text-sm">Withdraw →</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setWithdrawStep("form"); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? "bg-[#F5820D] text-white" : "text-[#BAD8F7]/60 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total In", val: `₦${totalIn.toLocaleString()}`, color: "text-green-400", icon: "↓" },
              { label: "Total Out", val: `₦${totalOut.toLocaleString()}`, color: "text-red-400", icon: "↑" },
              { label: "Saved (No Surge)", val: "₦8,400", color: "text-[#F5820D]", icon: "💰" },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.icon}</p>
                <p className={`font-outfit font-900 text-base ${s.color}`} style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>{s.val}</p>
                <p className="text-[#BAD8F7]/50 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>Recent Transactions</p>
            {MOCK_TRANSACTIONS.slice(0, 4).map((t, i) => (
              <div key={t.id} className={`flex items-center gap-3 py-3 ${i < 3 ? "border-b border-white/5" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${t.type === "credit" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                  {t.type === "credit" ? "↓" : "↑"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{t.desc}</p>
                  <p className="text-[#BAD8F7]/40 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>{t.ref}</p>
                </div>
                <p className={`text-sm font-semibold shrink-0 ${t.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                  {t.type === "credit" ? "+" : "-"}₦{t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOP UP ── */}
      {tab === "topup" && (
        <div className="space-y-4">
          {topupSuccess && (
            <div className="bg-green-500/15 border border-green-500/40 rounded-2xl p-4 text-center">
              <p className="text-green-400 font-semibold text-lg">✅ Payment Confirmed!</p>
              <p className="text-[#BAD8F7]/60 text-sm mt-1">Your wallet has been funded.</p>
            </div>
          )}

          <div className="glass-card rounded-2xl p-5">
            <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>Enter Amount (₦)</p>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BAD8F7]/40 text-2xl font-bold">₦</span>
              <input
                type="number" min="100" value={topupAmount} onChange={e => setTopupAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-4 bg-white/5 rounded-2xl text-white text-3xl font-bold outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/20"
                style={{ fontFamily: "Outfit, sans-serif" }}
              />
            </div>
            <div className="flex gap-2 flex-wrap mb-2">
              {[500, 1000, 2000, 5000, 10000, 20000].map(a => (
                <button key={a} type="button" onClick={() => setTopupAmount(String(a))}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${topupAmount === String(a) ? "border-[#F5820D] bg-[#F5820D]/15 text-[#F5820D]" : "border-white/10 text-[#BAD8F7]/60 hover:text-white"}`}>
                  ₦{a.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide mb-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>Choose Payment Method</p>

            <button onClick={openPaystack} disabled={!topupAmount || Number(topupAmount) < 100}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#F5820D]/40 bg-[#F5820D]/8 hover:bg-[#F5820D]/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <span className="text-2xl">💳</span>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold">Pay with Card / Paystack</p>
                <p className="text-[#BAD8F7]/50 text-xs">Visa, Mastercard, Verve — secured & instant</p>
              </div>
              <span className="text-[#F5820D] text-sm font-bold">→</span>
            </button>

            <div className="glass-card rounded-xl p-4 border border-white/10">
              <p className="text-white font-semibold text-sm mb-2 flex items-center gap-2"><span className="text-xl">🏦</span> Bank Transfer</p>
              <div className="bg-black/20 rounded-lg p-3 space-y-1 text-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                <div className="flex justify-between"><span className="text-[#BAD8F7]/50">Bank</span><span className="text-white">GTBank</span></div>
                <div className="flex justify-between"><span className="text-[#BAD8F7]/50">Account No</span><span className="text-[#F5820D] font-bold">0521234567</span></div>
                <div className="flex justify-between"><span className="text-[#BAD8F7]/50">Name</span><span className="text-white">FastWaybill Logistics Ltd</span></div>
              </div>
              <p className="text-[#BAD8F7]/40 text-xs mt-2">Transfer ₦{topupAmount || "0"} and your wallet tops up automatically within 60s.</p>
            </div>

            <div className="glass-card rounded-xl p-4 border border-white/10">
              <p className="text-white font-semibold text-sm flex items-center gap-2"><span className="text-xl">📞</span> USSD (No internet needed)</p>
              <p className="text-[#F5820D] text-lg font-bold mt-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                Dial: *737*50*{topupAmount || "AMOUNT"}#
              </p>
              <p className="text-[#BAD8F7]/40 text-xs mt-1">Works on any network — 2G, 3G, no data required.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── WITHDRAW ── */}
      {tab === "withdraw" && (
        <div className="space-y-4">

          {withdrawStep === "form" && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              {/* Info banner */}
              <div className="glass-card rounded-2xl p-4 border border-blue-400/20 flex gap-3">
                <span className="text-2xl shrink-0">ℹ️</span>
                <div>
                  <p className="text-white font-semibold text-sm">Real bank transfer</p>
                  <p className="text-[#BAD8F7]/60 text-xs leading-relaxed mt-1">
                    Withdrawals are processed via <strong className="text-white">Paystack Transfer API</strong> and credited within <strong className="text-white">10 minutes</strong>. Opay, GTBank, Kuda, Palmpay, and all Nigerian banks are supported.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-4">
                <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Amount</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BAD8F7]/40 text-2xl font-bold">₦</span>
                  <input type="number" min="500" max={balance} required value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-4 bg-white/5 rounded-2xl text-white text-3xl font-bold outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/20"
                    style={{ fontFamily: "Outfit, sans-serif" }} />
                </div>
                <p className="text-[#BAD8F7]/40 text-xs">Available: ₦{balance.toLocaleString()} · Min withdrawal: ₦500</p>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-4">
                <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Bank / Mobile Money Account</p>

                <select value={bankName} onChange={e => { setBankName(e.target.value); setAccountName(""); }}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white outline-none border border-white/10 focus:border-[#F5820D] transition-all">
                  {Object.keys(BANKS).map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <div className="flex gap-2">
                  <input
                    type="text" inputMode="numeric" maxLength={10} required value={accountNo}
                    onChange={e => { setAccountNo(e.target.value); setAccountName(""); }}
                    placeholder="Account / wallet number"
                    className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-white outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/30"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  />
                  <button type="button" onClick={verifyAccount} disabled={accountNo.length < 10 || verifying}
                    className="btn-primary px-4 py-3 rounded-xl text-sm disabled:opacity-50 shrink-0">
                    {verifying ? "⏳" : "Verify"}
                  </button>
                </div>

                {accountName && (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                    <span className="text-green-400">✓</span>
                    <p className="text-green-400 font-semibold text-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>{accountName}</p>
                  </div>
                )}
              </div>

              <button type="submit"
                disabled={!withdrawAmount || Number(withdrawAmount) < 500 || !accountName}
                className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-40 disabled:cursor-not-allowed">
                Review Withdrawal →
              </button>
            </form>
          )}

          {withdrawStep === "confirm" && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-[#BAD8F7]/50 text-sm mb-2">Sending</p>
                <p className="font-outfit text-5xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
                  ₦{Number(withdrawAmount).toLocaleString()}
                </p>
                <p className="text-[#BAD8F7]/40 text-sm">to</p>
                <p className="text-white font-semibold mt-2">{accountName}</p>
                <p className="text-[#BAD8F7]/60 text-sm">{bankName} · {accountNo}</p>
              </div>

              <div className="glass-card rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Amount</span><span className="text-white">₦{Number(withdrawAmount).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Transfer fee</span><span className="text-green-400">₦0 (waived)</span></div>
                <div className="flex justify-between font-semibold border-t border-white/8 pt-2"><span className="text-white">You receive</span><span className="text-[#F5820D]">₦{Number(withdrawAmount).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#BAD8F7]/60">ETA</span><span className="text-white">Within 10 minutes</span></div>
              </div>

              <button type="submit" disabled={processing}
                className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Processing transfer...
                  </span>
                ) : "Confirm & Send →"}
              </button>
              <button type="button" onClick={() => setWithdrawStep("form")} className="btn-outline w-full py-3 rounded-2xl text-sm">
                ← Go back
              </button>
            </form>
          )}

          {withdrawStep === "sent" && (
            <div className="space-y-4 text-center">
              <div className="glass-card rounded-3xl p-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="font-outfit text-2xl font-900 text-white mb-2" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>Transfer Initiated!</h3>
                <p className="text-[#BAD8F7]/70 text-sm mb-4">
                  ₦{Number(withdrawAmount).toLocaleString()} is on its way to <strong className="text-white">{accountName}</strong> on <strong className="text-white">{bankName}</strong>.
                </p>
                <div className="bg-[#0D1F47] rounded-2xl p-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Reference</span><span className="text-[#F5820D]" style={{ fontFamily: "JetBrains Mono, monospace" }}>FW-TRF-{Date.now().toString().slice(-6)}</span></div>
                  <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Expected by</span><span className="text-white">Within 10 minutes</span></div>
                  <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Support</span><span className="text-white">WhatsApp: wa.me/+2348100000000</span></div>
                </div>
              </div>
              <button onClick={() => { setWithdrawStep("form"); setWithdrawAmount(""); setAccountName(""); setAccountNo(""); setTab("overview"); }}
                className="btn-primary w-full py-4 rounded-2xl text-base">
                Back to Wallet
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY ── */}
      {tab === "history" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          {MOCK_TRANSACTIONS.map((t, i) => (
            <div key={t.id} className={`flex items-center gap-3 p-4 ${i < MOCK_TRANSACTIONS.length - 1 ? "border-b border-white/5" : ""}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${t.type === "credit" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                {t.type === "credit" ? "↓" : "↑"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{t.desc}</p>
                <p className="text-[#BAD8F7]/50 text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>{t.date} · {t.ref}</p>
              </div>
              <p className={`text-sm font-semibold shrink-0 ${t.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                {t.type === "credit" ? "+" : "-"}₦{t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
