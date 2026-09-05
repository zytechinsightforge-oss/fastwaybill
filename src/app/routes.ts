import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import Ride from "./pages/Ride";
import Dispatch from "./pages/Dispatch";
import Track from "./pages/Track";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Driver from "./pages/Driver";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "ride", Component: Ride },
      { path: "dispatch", Component: Dispatch },
      { path: "track", Component: Track },
      { path: "track/:id", Component: Track },
      { path: "dashboard", Component: Dashboard },
      { path: "wallet", Component: Wallet },
      { path: "driver", Component: Driver },
      { path: "login", Component: Login },
      { path: "auth/callback", Component: AuthCallback },
    ],
  },
]);
