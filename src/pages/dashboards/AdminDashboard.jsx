import { Link } from "react-router-dom";

function AdminDashboard() {
  const adminProfile = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("nbCurrentAdminProfile") || "null") || {
          name: localStorage.getItem("nbCurrentAdminName") || "Admin Manager",
          employeeId: localStorage.getItem("nbAdminEmployeeId") || "",
        }
      );
    } catch {
      return {
        name: localStorage.getItem("nbCurrentAdminName") || "Admin Manager",
        employeeId: localStorage.getItem("nbAdminEmployeeId") || "",
      };
    }
  })();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Admin / Manager Dashboard
          </p>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            System overview
          </h1>
          <p className="text-xs text-slate-500">
            Monitor NutriBalance users, nutritionists, subscriptions and
            complaints.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200" />
          <div className="text-xs">
            <p className="font-semibold text-slate-800">{adminProfile.name}</p>
            <p className="text-slate-500">
              Employee ID: {adminProfile.employeeId || "Not set"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <Link
          to="/dashboard/admin/deep-dive/users"
          className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:bg-slate-50"
        >
          <p className="text-[11px] text-slate-500">Active users</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">1,248</p>
          <p className="mt-1 text-[11px] text-emerald-600">
            +12% vs last month
          </p>
        </Link>
        <Link
          to="/dashboard/admin/deep-dive/subscriptions"
          className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:bg-slate-50"
        >
          <p className="text-[11px] text-slate-500">Active subscriptions</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">892</p>
          <p className="mt-1 text-[11px] text-emerald-600">
            72% users on premium
          </p>
        </Link>
        <Link
          to="/dashboard/admin/deep-dive/nutritionists"
          className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:bg-slate-50"
        >
          <p className="text-[11px] text-slate-500">Registered nutritionists</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">36</p>
          <p className="mt-1 text-[11px] text-slate-500">
            4 pending verification
          </p>
        </Link>
        <Link
          to="/dashboard/admin/deep-dive/complaints"
          className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:bg-slate-50"
        >
          <p className="text-[11px] text-slate-500">Open complaints</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">7</p>
          <p className="mt-1 text-[11px] text-amber-600">
            Resolve within 24 hours
          </p>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {[
          ["", "Overview"],
          ["users", "Users"],
          ["nutritionists", "Nutritionists"],
          ["subscriptions", "Subscriptions"],
          ["complaints", "Complaints"],
          ["approvals", "Approvals"],
          ["reports", "Reports"],
          ["health", "System Health"],
          ["audit", "Audit Log"],
        ].map(([key, label]) => (
          <Link
            key={label}
            to={key ? `/dashboard/admin/deep-dive/${key}` : "/dashboard/admin/deep-dive"}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            {label} deep view
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1.6fr,1.4fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Complaints & Issues
            </h2>
            <Link
              to="/dashboard/admin/deep-dive/complaints"
              className="text-[11px] text-slate-500 hover:text-slate-900"
            >
              Daily monitoring
            </Link>
          </div>
          <div className="space-y-2">
            {[
              {
                id: "#C1023",
                type: "System",
                desc: "Slow loading on video consultation page.",
                status: "In Progress",
              },
              {
                id: "#C1024",
                type: "Payment",
                desc: "Premium subscription not activated after payment.",
                status: "Open",
              },
              {
                id: "#C1025",
                type: "Service",
                desc: "Diet plan not updated after consultation.",
                status: "Resolved",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-slate-800">
                    {item.id} • {item.type}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      item.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.status === "Open"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600">
                  {item.desc}
                </p>
                <Link
                  to="/dashboard/admin/deep-dive/complaints"
                  className="mt-2 inline-flex rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  Open in deep view
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <h2 className="text-sm font-semibold text-slate-900">
            Management Actions
          </h2>
          <div className="space-y-2">
            <Link
              to="/dashboard/admin/deep-dive/nutritionists"
              className="block w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100"
            >
              Manage nutritionist accounts
            </Link>
            <Link
              to="/dashboard/admin/deep-dive/users"
              className="block w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100"
            >
              Manage user accounts & subscriptions
            </Link>
            <Link
              to="/dashboard/admin/deep-dive/subscriptions"
              className="block w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100"
            >
              Configure subscription plans
            </Link>
            <Link
              to="/dashboard/admin/deep-dive/reports"
              className="block w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100"
            >
              Generate weekly / monthly reports
            </Link>
          </div>
          <p className="text-[11px] text-slate-500">
            These options represent the core admin functionalities described in
            your project: monitoring users, subscriptions, complaints, and
            system health.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
