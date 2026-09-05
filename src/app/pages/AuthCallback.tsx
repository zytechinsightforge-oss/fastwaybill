import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      nav(session ? "/dashboard" : "/login", { replace: true });
    });
  }, [nav]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0D1F47" }}>
      <div className="text-5xl animate-bounce">🚖</div>
      <p className="font-outfit text-white text-xl font-700" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
        Signing you in...
      </p>
      <p className="text-[#BAD8F7]/50 text-sm">FastWaybill</p>
    </div>
  );
}
