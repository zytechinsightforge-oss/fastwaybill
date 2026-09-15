import { useState } from "react";
import { MOCK_TRANSACTIONS } from "../data/constants";
import { useAuth } from "../context/AuthContext";
import WalletSecurityGate from "../components/WalletSecurityGate";

const PAYSTACK_PUBLIC_KEY = "pk_test_a8d696328f6017bdc04e80ec0ed997410a85c5e0";
const EDGE_BASE = "https://rbhptfneaqmfvdoafehq.supabase.co/functions/v1/make-server-a0892b1f";

type Tab = "overview" | "topup" | "withdraw" | "history";

const BANKS: Record<string, string> = {
  "Opay": "999992",
  "GTBank": "058",
  "First Bank": "011",
  "Zenith Bank": "057",
  "Access Bank": "044",
  "UBA": "033",
  "Kuda Bank": "090267",
  "Palmpay": "999991",
  "Moniepoint": "090405",
  "Sterling Bank": "232",
  "Wema Bank": "035",
  "Fidelity Bank": "070",
};

export default function Wallet() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [securityGate, setSecurityGate] = useState(false);
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);
  const [walletUnlocked, setWalletUnlocked] = useState(false);

  const requireSecurity = (target: Tab) => {
    if (walletUnlocked) { setTab(target); return; }
    setPendingTab(target);
    setSecurityGate(true);
  };

  const onUnlock = () => {
    setSecurityGate(false);
    setWalletUnlocked(true);
    if (pendingTab) { setTab(pendingTab); setPendingTab(null); }
  };
  const [topupAmount, setTopupAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("Opay");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<"form" | "confirm" | "sent">("form");
  const [topupSuccess, setTopupSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [transferRef, setTransferRef] = useState("");

  const balance = 24750;
  const totalIn = MOCK_TRANSACTIONS.filter(t => t.type === "credit").reduce((a, b) => a + b.amount, 0);
  const totalOut = MOCK_TRANSACTIONS.filter(t => t.type === "debit").reduce((a, b) => a + b.amount, 0);

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "topup", label: "Top Up" },
    { id: "withdraw", label: "Withdraw" },
    { id: "history", label: "History" },
  ];

  const userEmail = user?.email ?? "user@fastwaybill.ng";

  const verifyAccount = async () => {
    if (accountNo.length < 10) return;
    setVerifying(true);
    setVerifyError("");
    setAccountName("");
    try {
      const resp = await fetch(`${EDGE_BASE}/wallet/verify-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNo, bank_code: BANKS[bankName] }),
      });
      const data = await resp.json();
      if (data.account_name) {
        setAccountName(data.account_name);
      } else {
        setVerifyError(data.error ?? "Could not verify account. Check the number and try again.");
      }
    } catch {
      setVerifyError("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawStep === "form") {
      setWithdrawStep("confirm");
      return;
    }
    setProcessing(true);
    setWithdrawError("");
    try {
      const resp = await fetch(`${EDGE_BASE}/wallet/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(withdrawAmount),
          account_number: accountNo,
          bank_code: BANKS[bankName],
          account_name: accountName,
          bank_name: bankName,
          user_email: userEmail,
        }),
      });
      const data = await resp.json();
      if (data.success) {
        setTransferRef(data.reference ?? "");
        setWithdrawStep("sent");
      } else {
        setWithdrawError(data.error ?? "Transfer failed. Please try again.");
      }
    } catch {
      setWithdrawError("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const openPaystack = () => {
    const amount = Number(topupAmount);
    if (!amount || amount < 100) return;

    const PaystackPop = (window as any).PaystackPop;
    if (!PaystackPop) {
      alert("Payment gateway not loaded. Please refresh the page and try again.");
      return;
    }

    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: userEmail,
      amount: amount * 100,
      currency: "NGN",
      ref: "FW-" + Date.now(),
      metadata: {
        custom_fields: [
          { display_name: "Wallet Top-up", variable_name: "wallet_topup", value: "true" },
          { display_name: "User", variable_name: "user_email", value: userEmail },
        ],
      },
      callback: () => {
        setTopupSuccess(true);
        setTopupAmount("");
        setTimeout(() => { setTopupSuccess(false); setTab("overview"); }, 3000);
      },
      onClose: () => {},
    });
    handler.openIframe();
  };

  return (
    <div className="pt-20 pb-20 md:pb-8 min-h-screen px-4 max-w-2xl mx-auto">
      {securityGate && (
        <WalletSecurityGate
          userId={user?.id ?? "guest"}
          onUnlock={onUnlock}
          onCancel={() => { setSecurityGate(false); setPendingTab(null); }}
        />
      )}

      {/* Balance card */}
      <div className="wallet-card rounded-3xl p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#F5820D", filter: "blur(80px)" }} />
        <p className="text-[#BAD8F7]/50 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>FastWallet Balance</p>
        <p className="font-outfit text-6xl font-900 text-white mb-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}>
          ₦{balance.toLocaleString()}
        </p>
        <p className="text-[#BAD8F7]/40 text-sm mb-4">{userEmail}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => requireSecurity("topup")} className="btn-primary px-6 py-2.5 rounded-xl text-sm">+ Top Up</button>
          <button onClick={() => requireSecurity("withdraw")} className="btn-outline px-6 py-2.5 rounded-xl text-sm">Withdraw →</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => {
            setWithdrawStep("form"); setWithdrawError("");
            if (t.id === "topup" || t.id === "withdraw") requireSecurity(t.id);
            else setTab(t.id);
          }}
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
              <p className="text-green-400 font-semibold text-lg">Payment Confirmed!</p>
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
                <p className="text-white font-semibold">Pay with Card / Bank</p>
                <p className="text-[#BAD8F7]/50 text-xs">Visa, Mastercard, Verve, Bank Transfer — secured by Paystack</p>
              </div>
              <span className="text-[#F5820D] text-sm font-bold">→</span>
            </button>

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
              <div className="glass-card rounded-2xl p-4 border border-blue-400/20 flex gap-3">
                <span className="text-2xl shrink-0">ℹ️</span>
                <div>
                  <p className="text-white font-semibold text-sm">Real bank transfer</p>
                  <p className="text-[#BAD8F7]/60 text-xs leading-relaxed mt-1">
                    Powered by <strong className="text-white">Paystack Transfer API</strong>. Credited within <strong className="text-white">10 minutes</strong> to any Nigerian bank or mobile wallet.
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
                <p className="text-[#BAD8F7]/40 text-xs">Available: ₦{balance.toLocaleString()} · Min: ₦500</p>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-4">
                <p className="text-[#BAD8F7]/60 text-xs uppercase tracking-wide" style={{ fontFamily: "JetBrains Mono, monospace" }}>Destination Account</p>

                <select value={bankName} onChange={e => { setBankName(e.target.value); setAccountName(""); setVerifyError(""); }}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white outline-none border border-white/10 focus:border-[#F5820D] transition-all">
                  {Object.keys(BANKS).map(b => <option key={b} value={b} className="bg-[#0D1F47]">{b}</option>)}
                </select>

                <div className="flex gap-2">
                  <input
                    type="text" inputMode="numeric" maxLength={10} required value={accountNo}
                    onChange={e => { setAccountNo(e.target.value); setAccountName(""); setVerifyError(""); }}
                    placeholder="Account / wallet number"
                    className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-white outline-none border border-white/10 focus:border-[#F5820D] transition-all placeholder-[#BAD8F7]/30"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  />
                  <button type="button" onClick={verifyAccount} disabled={accountNo.length < 10 || verifying}
                    className="btn-primary px-4 py-3 rounded-xl text-sm disabled:opacity-50 shrink-0">
                    {verifying ? "..." : "Verify"}
                  </button>
                </div>

                {verifyError && (
                  <p className="text-red-400 text-xs">{verifyError}</p>
                )}

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

              {withdrawError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                  {withdrawError}
                </div>
              )}

              <button type="submit" disabled={processing}
                className="btn-primary w-full py-4 rounded-2xl text-base disabled:opacity-50">
                {processing ? "Processing transfer..." : "Confirm & Send →"}
              </button>
              <button type="button" onClick={() => { setWithdrawStep("form"); setWithdrawError(""); }} className="btn-outline w-full py-3 rounded-2xl text-sm">
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
                  <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Reference</span><span className="text-[#F5820D]" style={{ fontFamily: "JetBrains Mono, monospace" }}>{transferRef || "FW-TRF-" + Date.now().toString().slice(-6)}</span></div>
                  <div className="flex justify-between"><span className="text-[#BAD8F7]/60">Expected by</span><span className="text-white">Within 10 minutes</span></div>
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
