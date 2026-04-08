import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, parseApiResponse } from "../lib/api.js";

const roles = [
  { id: "USER", label: "User" },
  { id: "NUTRITIONIST", label: "Nutritionist" },
  { id: "ADMIN", label: "Admin / Manager" },
];

function normalizeUsername(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return trimmedValue.includes("@")
    ? trimmedValue.split("@")[0]
    : trimmedValue;
}

function Login() {
  const [selectedRole, setSelectedRole] = useState("USER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role: selectedRole,
        }),
      });
      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to log in");
      }

      const nameToUse =
        data?.displayName ||
        normalizeUsername(data?.username || username) ||
        normalizeUsername(localStorage.getItem("nbUserName") || "") ||
        "User";

      localStorage.setItem("nbCurrentUserName", nameToUse);
      localStorage.setItem("nbUserName", nameToUse);
      localStorage.setItem("nbCurrentUserRole", data?.role || selectedRole);

      if (selectedRole === "USER") {
        navigate("/dashboard/user");
      } else if (selectedRole === "NUTRITIONIST") {
        localStorage.setItem("nbCurrentNutritionistName", nameToUse);
        localStorage.setItem(
          "nbCurrentNutritionistProfile",
          JSON.stringify({
            name: nameToUse,
            employeeId:
              localStorage.getItem("nbNutritionistEmployeeId") ||
              localStorage.getItem("nbEmployeeId") ||
              "",
            specialty: localStorage.getItem("nbNutritionistSpecialty") || "Assigned nutritionist",
          }),
        );
        navigate("/dashboard/nutritionist");
      } else {
        localStorage.setItem("nbCurrentAdminName", nameToUse);
        localStorage.setItem(
          "nbCurrentAdminProfile",
          JSON.stringify({
            name: nameToUse,
            employeeId:
              localStorage.getItem("nbAdminEmployeeId") ||
              localStorage.getItem("nbEmployeeId") ||
              "",
            role: "ADMIN",
          }),
        );
        navigate("/dashboard/admin");
      }
    } catch (err) {
      setError(err.message || "Unable to log in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center">
      <div className="md:w-1/2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Login to <span className="text-primary">NutriBalance</span>
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Common login for all roles. Use your registered username or email
          and password to access your personalized dashboard.
        </p>
        <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
          <li>- Users: view your diet plan and progress</li>
          <li>- Nutritionists: manage assigned users and consultations</li>
          <li>- Admins: monitor system, subscriptions, and reports</li>
        </ul>
      </div>

      <div className="md:w-1/2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-slate-700">
                Select Role
              </label>
              <div className="mt-2 flex gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      if (role.id !== "USER") {
                        setFeedback("");
                      }
                    }}
                    className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                      selectedRole === role.id
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-xs font-medium text-slate-700"
              >
                Username / Email ID / Employee ID
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter username, email, or employee ID"
                required
              />
            </div>

            {selectedRole === "USER" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="feedback"
                  className="text-xs font-medium text-slate-700"
                >
                  Today&apos;s feedback
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                  rows={3}
                  placeholder="How are you feeling today? Any quick feedback for your nutritionist?"
                />
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {submitting ? "Logging In..." : "Login"}
            </button>

            <p className="text-[11px] text-slate-500">
              Use the username, email, or employee ID stored for this account,
              along with your password and selected role.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
