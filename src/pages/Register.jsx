import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, parseApiResponse } from "../lib/api.js";

function normalizeUsername(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return trimmedValue.includes("@")
    ? trimmedValue.split("@")[0]
    : trimmedValue;
}

function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("USER");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [referredBy, setReferredBy] = useState("SELF");
  const [hospitalName, setHospitalName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [gender, setGender] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [goal, setGoal] = useState("WEIGHT_LOSS");
  const [subscription, setSubscription] = useState("FREE");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const isUserRole = role === "USER";
  const isEmployeeRole = role === "NUTRITIONIST" || role === "ADMIN";

  const updateBmi = (h, w) => {
    const heightNum = parseFloat(h);
    const weightNum = parseFloat(w);

    if (!heightNum || !weightNum || heightNum <= 0) {
      setBmi("");
      return;
    }

    const heightMeters = heightNum / 100;
    const value = weightNum / (heightMeters * heightMeters);
    setBmi(value.toFixed(1));
  };

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setError("");
    setSuccessMessage("");
    setUsername("");

    if (nextRole === "USER") {
      setFullName("");
      setEmployeeId("");
      setReferredBy("SELF");
      setHospitalName("");
    } else {
      setAge("");
      setHeight("");
      setWeight("");
      setBmi("");
      setGender("");
      setLifeStage("");
      setGoal("WEIGHT_LOSS");
      setSubscription("FREE");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const trimmedUsername = username.trim();
      const registrationPayload = {
        username: isEmployeeRole
          ? trimmedUsername
          : normalizeUsername(trimmedUsername),
        password,
        role,
      };

      if (isEmployeeRole) {
        registrationPayload.fullName = fullName.trim();
        registrationPayload.employeeId = employeeId.trim();
        registrationPayload.mobileNumber = mobile.trim();
        registrationPayload.emailId = trimmedUsername;
      } else {
        registrationPayload.referredBy = referredBy;
        registrationPayload.hospitalName =
          referredBy === "HOSPITAL" ? hospitalName.trim() : "";
      }

      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationPayload),
      });
      const data = await parseApiResponse(response);

      if (!response.ok) {
        const validationSummary = data?.validationErrors
          ? Object.values(data.validationErrors).join(", ")
          : "";
        throw new Error(
          validationSummary || data?.message || "Unable to register account"
        );
      }

      const displayName =
        data?.displayName ||
        (isEmployeeRole ? fullName.trim() : normalizeUsername(trimmedUsername)) ||
        "User";

      localStorage.setItem("nbUserName", displayName);
      localStorage.setItem("nbCurrentUserName", displayName);
      localStorage.setItem("nbCurrentUserRole", data?.role || role);

      if (isEmployeeRole) {
        localStorage.setItem("nbUserEmail", trimmedUsername);
        localStorage.setItem("nbUserMobile", mobile.trim());
        if (role === "NUTRITIONIST") {
          localStorage.setItem("nbNutritionistEmployeeId", employeeId.trim());
          localStorage.setItem("nbCurrentNutritionistName", displayName);
            localStorage.setItem(
              "nbCurrentNutritionistProfile",
              JSON.stringify({
                name: displayName,
                employeeId: employeeId.trim(),
                specialty: localStorage.getItem("nbNutritionistSpecialty") || "Assigned nutritionist",
              }),
            );
        } else if (role === "ADMIN") {
          localStorage.setItem("nbAdminEmployeeId", employeeId.trim());
          localStorage.setItem("nbCurrentAdminName", displayName);
          localStorage.setItem(
            "nbCurrentAdminProfile",
            JSON.stringify({
              name: displayName,
              employeeId: employeeId.trim(),
              role: "ADMIN",
            }),
          );
        }
        localStorage.setItem("nbEmployeeId", employeeId.trim());
      } else {
        localStorage.setItem("nbUserMobile", mobile);
        localStorage.setItem("nbGender", gender);
        localStorage.setItem("nbLifeStage", lifeStage);
        localStorage.setItem("nbGoal", goal);
        localStorage.setItem("nbReferralSource", referredBy);
        localStorage.setItem("nbHospitalName", hospitalName.trim());
      }

      setSuccessMessage("Account created successfully. You can log in now.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Unable to register account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Create your <span className="text-primary">NutriBalance</span> account
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Choose a role first. Users can continue with the health profile fields,
        while nutritionists and admins register with their employee details.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <div className="space-y-1.5">
          <label htmlFor="role" className="text-xs font-medium text-slate-700">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
            required
          >
            <option value="USER">User</option>
            <option value="NUTRITIONIST">Nutritionist</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {isEmployeeRole ? (
          <>
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-xs font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="employeeId"
                className="text-xs font-medium text-slate-700"
              >
                Employee ID
              </label>
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter employee ID"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="mobile"
                className="text-xs font-medium text-slate-700"
              >
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-xs font-medium text-slate-700"
              >
                Email ID
              </label>
              <input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter email address"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-xs font-medium text-slate-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="referredBy"
                className="text-xs font-medium text-slate-700"
              >
                Referred By
              </label>
              <select
                id="referredBy"
                value={referredBy}
                onChange={(e) => {
                  setReferredBy(e.target.value);
                  if (e.target.value !== "HOSPITAL") {
                    setHospitalName("");
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                required
              >
                <option value="SELF">Self</option>
                <option value="HOSPITAL">Hospital</option>
              </select>
            </div>

            {referredBy === "HOSPITAL" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="hospitalName"
                  className="text-xs font-medium text-slate-700"
                >
                  Hospital Name
                </label>
                <input
                  id="hospitalName"
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                  placeholder="Enter hospital name"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="age" className="text-xs font-medium text-slate-700">
                Age
              </label>
              <input
                id="age"
                type="number"
                min="1"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter age"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="mobile"
                className="text-xs font-medium text-slate-700"
              >
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="height"
                className="text-xs font-medium text-slate-700"
              >
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                min="1"
                value={height}
                onChange={(e) => {
                  const value = e.target.value;
                  setHeight(value);
                  updateBmi(value, weight);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="e.g. 165"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="weight"
                className="text-xs font-medium text-slate-700"
              >
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                min="1"
                value={weight}
                onChange={(e) => {
                  const value = e.target.value;
                  setWeight(value);
                  updateBmi(height, value);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="e.g. 65"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bmi" className="text-xs font-medium text-slate-700">
                BMI (auto calculated)
              </label>
              <input
                id="bmi"
                type="text"
                value={bmi}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700"
                placeholder="Will be calculated automatically"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="gender"
                className="text-xs font-medium text-slate-700"
              >
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setLifeStage("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                required
              >
                <option value="">Select gender</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lifeStage"
                className="text-xs font-medium text-slate-700"
              >
                Category (based on gender)
              </label>
              <select
                id="lifeStage"
                value={lifeStage}
                onChange={(e) => setLifeStage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                required
                disabled={!gender}
              >
                <option value="">Select category</option>
                {gender === "FEMALE" && (
                  <>
                    <option value="CHILD">Child</option>
                    <option value="ADULT">Adult</option>
                    <option value="OLD_AGE">Old age</option>
                    <option value="PREGNANT">Pregnant woman</option>
                    <option value="LACTATING">Lactating mother</option>
                  </>
                )}
                {gender === "MALE" && (
                  <>
                    <option value="CHILD">Child</option>
                    <option value="ADULT">Adult</option>
                    <option value="OLD_AGE">Old age</option>
                    <option value="GYM">Gym person</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="goal"
                className="text-xs font-medium text-slate-700"
              >
                Health Goal
              </label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
              >
                <option value="WEIGHT_LOSS">Weight loss</option>
                <option value="WEIGHT_GAIN">Weight gain</option>
                <option value="MUSCLE_GAIN">Muscle gain</option>
                <option value="GENERAL_HEALTH">General health</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="subscription"
                className="text-xs font-medium text-slate-700"
              >
                Subscription Plan
              </label>
              <select
                id="subscription"
                value={subscription}
                onChange={(e) => setSubscription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
              >
                <option value="FREE">Free (Basic Diet)</option>
                <option value="PREMIUM_MONTHLY">Premium - Monthly</option>
                <option value="PREMIUM_YEARLY">Premium - Yearly</option>
              </select>
            </div>
          </>
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
            placeholder="Create a strong password"
            required
          />
        </div>

        {error && (
          <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="md:col-span-2 mt-2 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            After registration you will be redirected to the login page.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            {submitting ? "Creating Account..." : "Register & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
