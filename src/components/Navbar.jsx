import { Link, NavLink, useLocation } from "react-router-dom";
import { HeartPulse, LogIn } from "lucide-react";

const navLinkClasses =
  "px-3 py-2 text-sm font-medium rounded-full transition-colors";

function Navbar() {
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">
              NutriBalance
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Eat Smart. Live Better.
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {!isDashboard && (
            <>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-primary border border-primary/40 hover:bg-primary/5"
                  } flex items-center gap-1`
                }
              >
                <LogIn className="h-4 w-4" />
                Login
              </NavLink>
            </>
          )}
          {isDashboard && (
            <Link
              to="/home"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
            >
              Back to Home
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
