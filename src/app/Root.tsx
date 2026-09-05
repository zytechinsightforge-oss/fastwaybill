import { Outlet, useLocation } from "react-router";
import Nav from "./components/Nav";
import InstallPrompt from "./components/InstallPrompt";

export default function Root() {
  const { pathname } = useLocation();
  const hideNav = pathname === "/login";

  return (
    <div className="min-h-screen" style={{ background: "#0D1F47", fontFamily: "Inter, sans-serif" }}>
      {!hideNav && <Nav />}
      <Outlet />
      <InstallPrompt />
    </div>
  );
}
