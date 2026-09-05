import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { projectId } from "../../../utils/supabase/info";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<string | null>;
  signInWithPhone: (phone: string) => Promise<string | null>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

const EDGE_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a0892b1f`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
  };

  const signInWithEmail = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signUpWithEmail = async (email: string, password: string, name: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return error ? error.message : null;
  };

  // Sends OTP via Termii through our edge function
  const signInWithPhone = async (phone: string): Promise<string | null> => {
    try {
      const resp = await fetch(`${EDGE_BASE}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) return data.error ?? "Failed to send OTP";
      return null;
    } catch {
      return "Network error. Check your connection and try again.";
    }
  };

  // Verifies OTP and establishes Supabase session via magic-link token
  const verifyPhoneOtp = async (phone: string, token: string): Promise<string | null> => {
    try {
      const resp = await fetch(`${EDGE_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: token }),
      });
      const data = await resp.json();

      if (!resp.ok || !data.success) return data.error ?? "OTP verification failed";

      // Exchange hashed_token for a real Supabase session
      const { error } = await supabase.auth.verifyOtp({
        token_hash: data.hashed_token,
        type: "email",
      });

      return error ? error.message : null;
    } catch {
      return "Network error. Check your connection and try again.";
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithPhone, verifyPhoneOtp, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
