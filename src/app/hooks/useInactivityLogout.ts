import { useEffect, useRef, useCallback, useState } from "react";

const STORAGE_KEY = "fw_auto_logout_mins";
const DEFAULT_MINS = 1;

export function getAutoLogoutMins(): number {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "0") return 0;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MINS;
}

export function setAutoLogoutMins(mins: number) {
  localStorage.setItem(STORAGE_KEY, String(mins));
}

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

interface Options {
  onLogout: () => void;
  enabled: boolean;
}

export function useInactivityLogout({ onLogout, enabled }: Options) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const minsRef = useRef(getAutoLogoutMins());

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warnRef.current) clearTimeout(warnRef.current);
    if (countRef.current) clearInterval(countRef.current);
    timerRef.current = warnRef.current = countRef.current = null;
    setCountdown(null);
  }, []);

  const reset = useCallback(() => {
    minsRef.current = getAutoLogoutMins();
    const mins = minsRef.current;
    if (!enabled || mins === 0) { clear(); return; }

    clear();
    const ms = mins * 60 * 1000;
    const warnAt = Math.max(0, ms - 30_000);

    warnRef.current = setTimeout(() => {
      let secs = Math.min(30, Math.floor((ms - warnAt) / 1000));
      setCountdown(secs);
      countRef.current = setInterval(() => {
        secs -= 1;
        setCountdown(secs);
        if (secs <= 0) {
          if (countRef.current) clearInterval(countRef.current);
        }
      }, 1000);
    }, warnAt);

    timerRef.current = setTimeout(() => {
      clear();
      onLogout();
    }, ms);
  }, [enabled, clear, onLogout]);

  useEffect(() => {
    if (!enabled) { clear(); return; }
    reset();
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clear();
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, reset));
    };
  }, [enabled, reset, clear]);

  const dismiss = useCallback(() => {
    reset();
  }, [reset]);

  return { countdown, dismiss };
}
