import { useEffect, useState } from "react";
import logoImg from "@/imports/WhatsApp_Image_2026-08-27_at_12.51.32_AM__1_.jpeg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Already installed — don't show
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show our custom banner after a short delay
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setInstalling(false);
    if (outcome === "accepted") {
      setDone(true);
      setTimeout(() => setVisible(false), 2000);
    } else {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "12px",
        right: "12px",
        zIndex: 9999,
        animation: "float-up 0.4s ease forwards",
      }}
    >
      <div
        className="glass-card rounded-2xl p-4 flex items-center gap-4 shadow-2xl"
        style={{ border: "1px solid rgba(245,130,13,0.4)" }}
      >
        <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
          <img src={logoImg} alt="FastWaybill" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          {done ? (
            <p className="text-green-400 font-semibold">✅ Installed! Check your home screen.</p>
          ) : (
            <>
              <p className="text-white font-outfit font-700 text-sm leading-tight" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                Install FastWaybill
              </p>
              <p className="text-[#BAD8F7]/60 text-xs mt-0.5">
                Add to home screen — works offline
              </p>
            </>
          )}
        </div>

        {!done && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={install}
              disabled={installing}
              className="btn-primary px-4 py-2 rounded-xl text-sm"
            >
              {installing ? "⏳" : "Install"}
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-[#BAD8F7]/40 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
