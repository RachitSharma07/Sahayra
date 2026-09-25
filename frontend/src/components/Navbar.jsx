import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-600/20">
            S
          </div>

          <span className="text-xl font-bold tracking-tight">
            Service<span className="text-blue-400">Hub</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Home */}
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Home
          </Link>

          {user ? (
            <>
              {/* Customer */}
              {user.role === "customer" && (
                <Link
                  to="/customer"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Customer
                </Link>
              )}

              {/* Provider */}
              {user.role === "provider" && (
                <Link
                  to="/provider"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Provider
                </Link>
              )}

              {/* Admin */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Admin
                </Link>
              )}

              {/* User indicator */}
              <div className="hidden items-center gap-2 border-l border-slate-700 pl-4 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <span className="max-w-28 truncate text-sm text-slate-300">
                  {user.name || "User"}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
