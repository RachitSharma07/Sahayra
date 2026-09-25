import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-teal-600" />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-600">
            Checking your session...
          </p>

          <p className="mt-1 text-xs text-slate-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;
