import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          setUser(null);
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Authentication check failed");
        }

        setUser(data.user);
      } catch (error) {
        setAuthError(error.message);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (authLoading) {
    return <p>Checking authentication...</p>;
  }

  return (
    <div>
      {authError && <p>{authError}</p>}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        <Route element={<ProtectedRoute user={user} />}>
          <Route
            path="/dashboard"
            element={<Dashboard user={user} setUser={setUser} />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
