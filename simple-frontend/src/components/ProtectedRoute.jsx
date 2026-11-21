import { Navigate, Outlet } from "react-router";

function ProtectedRoute({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
