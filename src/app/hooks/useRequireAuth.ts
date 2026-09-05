import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const guardAction = (action: () => void) => {
    if (loading) return;
    if (!user) {
      // Save intended destination so we bounce back after login
      nav(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: false });
      return;
    }
    action();
  };

  return { user, loading, guardAction, isAuthenticated: !!user };
}
