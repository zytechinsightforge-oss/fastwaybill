interface Props {
  countdown: number;
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
}

export default function InactivityWarning({ countdown, onStayLoggedIn, onLogoutNow }: Props) {
  const pct = Math.max(0, (countdown / 30) * 100);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4" style={{ background: "rgba(7,15,36,0.88)", backdropFilter: "blur(10px)" }}>
      <div className="w-full max-w-sm rounded-3xl p-6 text-center space-y-5" style={{ background: "#0D1F47", border: "1px solid rgba(245,130,13,0.3)" }}>

        {/* Icon + progress ring */}
        <div className="relative w-20 h-20 mx-auto">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(186,216,247,0.1)" strokeWidth="6" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="#F5820D" strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{countdown}</span>
          </div>
        </div>

        <div>
          <h3 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Still there?</h3>
          <p className="text-sm" style={{ color: "rgba(186,216,247,0.55)" }}>
            You will be logged out in <strong className="text-[#F5820D]">{countdown} second{countdown !== 1 ? "s" : ""}</strong> due to inactivity.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onLogoutNow}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            Log out now
          </button>
          <button onClick={onStayLoggedIn}
            className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all"
            style={{ background: "#F5820D", color: "#fff" }}>
            Stay logged in
          </button>
        </div>
      </div>
    </div>
  );
}
