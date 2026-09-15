import { Outlet, useLocation, useNavigate } from "react-router";
import Nav from "./components/Nav";
import InstallPrompt from "./components/InstallPrompt";
import InactivityWarning from "./components/InactivityWarning";
import { useInactivityLogout } from "./hooks/useInactivityLogout";
import { useAuth } from "./context/AuthContext";

export default function Root() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const hideNav = pathname === "/login";

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const { countdown, dismiss } = useInactivityLogout({
    onLogout: handleLogout,
    enabled: !!user,
  });

  return (
    <div className="min-h-screen" style={{ background: "#0D1F47", fontFamily: "Inter, sans-serif" }}>
      {!hideNav && <Nav />}
      <Outlet />
      <InstallPrompt />
      {countdown !== null && countdown > 0 && (
        <InactivityWarning
          countdown={countdown}
          onStayLoggedIn={dismiss}
          onLogoutNow={handleLogout}
        />
      )}
    </div>
  );
}
