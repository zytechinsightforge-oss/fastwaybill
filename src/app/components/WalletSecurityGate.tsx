import { useState, useEffect, useCallback } from "react";

type GateState = "idle" | "set-pin" | "confirm-pin" | "enter-pin" | "biometric" | "unlocked";

const PIN_KEY = "fw_wallet_pin";
const BIO_KEY = "fw_wallet_bio";

function hasPin() { return !!localStorage.getItem(PIN_KEY); }
function hasBio() { return localStorage.getItem(BIO_KEY) === "1"; }

async function isBiometricAvailable(): Promise<boolean> {
  try {
    return !!(window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
  } catch { return false; }
}

async function registerBiometric(userId: string): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "FastWaybill", id: window.location.hostname },
        user: { id: new TextEncoder().encode(userId), name: userId, displayName: "FastWaybill User" },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
      },
    });
    localStorage.setItem(BIO_KEY, "1");
    return true;
  } catch { return false; }
}

async function verifyBiometric(): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    await navigator.credentials.get({
      publicKey: {
        challenge,
        userVerification: "required",
        timeout: 60000,
      },
    });
    return true;
  } catch { return false; }
}

interface Props {
  userId: string;
  onUnlock: () => void;
  onCancel: () => void;
}

export default function WalletSecurityGate({ userId, onUnlock, onCancel }: Props) {
  const [state, setState] = useState<GateState>("idle");
  const [pin, setPin] = useState<string[]>([]);
  const [confirmPin, setConfirmPin] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBioAvailable);
    if (!hasPin()) {
      setState("set-pin");
    } else if (hasBio()) {
      setState("biometric");
    } else {
      setState("enter-pin");
    }
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleDigit = useCallback((d: string) => {
    setError("");
    if (state === "set-pin") {
      const next = [...pin, d].slice(0, 4);
      setPin(next);
      if (next.length === 4) setState("confirm-pin");
    } else if (state === "confirm-pin") {
      const next = [...confirmPin, d].slice(0, 4);
      setConfirmPin(next);
      if (next.length === 4) {
        if (next.join("") === pin.join("")) {
          localStorage.setItem(PIN_KEY, pin.join(""));
          if (bioAvailable) {
            registerBiometric(userId).then(ok => {
              if (ok) setState("unlocked");
              else setState("unlocked");
            });
          } else {
            setState("unlocked");
          }
        } else {
          setError("PINs don't match. Try again.");
          setConfirmPin([]);
          triggerShake();
        }
      }
    } else if (state === "enter-pin") {
      const next = [...pin, d].slice(0, 4);
      setPin(next);
      if (next.length === 4) {
        const stored = localStorage.getItem(PIN_KEY);
        if (next.join("") === stored) {
          setState("unlocked");
        } else {
          setError("Wrong PIN. Try again.");
          setPin([]);
          triggerShake();
        }
      }
    }
  }, [state, pin, confirmPin, bioAvailable, userId]);

  const handleDelete = useCallback(() => {
    if (state === "set-pin") setPin(p => p.slice(0, -1));
    else if (state === "confirm-pin") setConfirmPin(p => p.slice(0, -1));
    else if (state === "enter-pin") setPin(p => p.slice(0, -1));
  }, [state]);

  useEffect(() => {
    if (state === "unlocked") {
      setTimeout(onUnlock, 300);
    }
  }, [state, onUnlock]);

  const handleBiometric = async () => {
    setBioLoading(true);
    setError("");
    const ok = await verifyBiometric();
    if (ok) {
      setState("unlocked");
    } else {
      setError("Biometric failed. Use PIN instead.");
      setState("enter-pin");
      setPin([]);
    }
    setBioLoading(false);
  };

  const currentDots = state === "confirm-pin" ? confirmPin : pin;
  const dots = [0, 1, 2, 3];
  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  const title = {
    "set-pin": "Create Wallet PIN",
    "confirm-pin": "Confirm your PIN",
    "enter-pin": "Enter Wallet PIN",
    "biometric": "Verify to access wallet",
    "unlocked": "Unlocked ✓",
    "idle": "",
  }[state];

  const subtitle = {
    "set-pin": "Choose a 4-digit PIN to secure your wallet",
    "confirm-pin": "Re-enter your 4-digit PIN",
    "enter-pin": "Enter your wallet PIN to continue",
    "biometric": "Use Face ID or fingerprint",
    "unlocked": "",
    "idle": "",
  }[state];

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center" style={{ background: "rgba(7,15,36,0.92)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-sm rounded-t-3xl lg:rounded-3xl p-6 pb-8" style={{ background: "#0D1F47", border: "1px solid rgba(186,216,247,0.1)" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <span className="text-white font-semibold">FastWallet Security</span>
          </div>
          <button onClick={onCancel} className="text-sm" style={{ color: "rgba(186,216,247,0.4)" }}>Cancel</button>
        </div>

        {state === "unlocked" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-3">✅</div>
            <p className="text-white font-semibold">Wallet Unlocked</p>
          </div>
        )}

        {state === "biometric" && (
          <div className="text-center space-y-6 py-4">
            <div>
              <p className="text-xl font-bold text-white mb-1">{title}</p>
              <p className="text-sm" style={{ color: "rgba(186,216,247,0.5)" }}>{subtitle}</p>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button onClick={handleBiometric} disabled={bioLoading}
              className="mx-auto flex flex-col items-center gap-3 p-6 rounded-2xl transition-all disabled:opacity-50"
              style={{ background: "rgba(245,130,13,0.1)", border: "2px solid rgba(245,130,13,0.3)" }}>
              <span className="text-5xl">{bioLoading ? "⏳" : "🔐"}</span>
              <span className="text-white font-semibold text-sm">{bioLoading ? "Verifying..." : "Face ID / Fingerprint"}</span>
            </button>

            <button onClick={() => { setState("enter-pin"); setPin([]); }}
              className="text-sm hover:underline" style={{ color: "rgba(186,216,247,0.4)" }}>
              Use PIN instead
            </button>
          </div>
        )}

        {(state === "set-pin" || state === "confirm-pin" || state === "enter-pin") && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-1">{title}</p>
              <p className="text-sm" style={{ color: "rgba(186,216,247,0.5)" }}>{subtitle}</p>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {/* PIN dots */}
            <div className={`flex justify-center gap-4 ${shake ? "animate-bounce" : ""}`}>
              {dots.map(i => (
                <div key={i} className="w-4 h-4 rounded-full transition-all duration-200"
                  style={{ background: i < currentDots.length ? "#F5820D" : "rgba(186,216,247,0.2)" }} />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3">
              {KEYS.map((k, i) => (
                <button key={i} onClick={() => k === "⌫" ? handleDelete() : k ? handleDigit(k) : undefined}
                  disabled={!k}
                  className="h-14 rounded-2xl text-xl font-semibold transition-all disabled:opacity-0 active:scale-95"
                  style={{ background: k === "⌫" ? "rgba(239,68,68,0.15)" : k ? "rgba(255,255,255,0.06)" : "transparent", color: k === "⌫" ? "#ef4444" : "#fff" }}>
                  {k}
                </button>
              ))}
            </div>

            {state === "enter-pin" && hasBio() && bioAvailable && (
              <button onClick={handleBiometric} className="w-full text-sm py-2 text-center" style={{ color: "rgba(186,216,247,0.5)" }}>
                🔐 Use Face ID / Fingerprint
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
