import { useState } from "react";
import { useNavigate } from "react-router";

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      setUser(null);
      navigate("/login", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome, {user.email}!</p>

      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Logging out..." : "Logout"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Dashboard;
