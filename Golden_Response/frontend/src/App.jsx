import { useEffect, useState } from "react";
import { getToken } from "./services/api";
import { fetchMe } from "./services/auth";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  const [view, setView] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setCheckingSession(false);
      return;
    }

    fetchMe()
      .then((data) => {
        setUser(data.user);
        setView("dashboard");
      })
      .catch(() => localStorage.removeItem("ridejunto_token"))
      .finally(() => setCheckingSession(false));
  }, []);

  function openAuth(mode) {
    setAuthMode(mode);
    setView("auth");
  }

  if (checkingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-skywash text-ink">
        <div className="rounded-lg bg-white px-6 py-5 font-bold shadow-panel">
          Loading RideJunto...
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={() => {
          setUser(null);
          setView("landing");
        }}
      />
    );
  }

  if (view === "auth") {
    return (
      <Auth
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthenticated={(nextUser) => {
          setUser(nextUser);
          setView("dashboard");
        }}
        onBack={() => setView("landing")}
      />
    );
  }

  return <Landing onAuth={openAuth} />;
}
