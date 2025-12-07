import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
