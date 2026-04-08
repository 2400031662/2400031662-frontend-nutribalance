import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sectionMap = {
  overview: {
    title: "Admin Command Center - Overview",
    summary:
      "Monitor users, nutritionists, subscriptions, complaints, reports, and system health from one place.",
    points: [
      "Every major admin area opens inside the app as a deep view.",
      "Use approval queues to handle registrations and support cases quickly.",
      "Track nutritionist workload, user growth, and subscription health together.",
      "Audit log entries show what changed and who changed it.",
    ],
  },
  users: {
    title: "User Management - Deep View",
    summary:
      "See each user record, assigned nutritionist, plan, and current status.",
    points: [
      "Open a user record to inspect plan, goal, and last activity.",
      "Reassignment and subscription changes can be handled from this area.",
      "Users are grouped by active status so pending work is easy to spot.",
      "This view is meant to support support triage and follow-up work.",
    ],
  },
  nutritionists: {
    title: "Nutritionist Management - Deep View",
    summary:
      "Review nutritionist accounts, employee IDs, workload, and verification queue.",
    points: [
      "See assigned users and pending approvals for each nutritionist.",
      "Verify, update, or flag accounts as needed.",
      "Deep view links can open the nutritionist workflow directly.",
      "The admin can watch case load and consultation activity from here.",
    ],
  },
  subscriptions: {
    title: "Subscription Control - Deep View",
    summary:
      "Manage plans, renewals, and payment-related issues in one workflow.",
    points: [
      "Review active, pending, and overdue plans.",
      "Upgrade or downgrade plans from the subscription queue.",
      "Identify users whose access needs manual follow-up.",
      "Track premium activation and payment issues without leaving the app.",
    ],
  },
  complaints: {
    title: "Complaints & Issues - Deep View",
    summary:
      "Review open support cases, assign actions, and resolve issues quickly.",
    points: [
      "Each complaint shows category, severity, owner, and current status.",
      "Open incidents can be marked in progress or resolved.",
      "High severity issues should be handled first.",
      "The admin deep view keeps problem handling centralized.",
    ],
  },
  approvals: {
    title: "Approval Queue - Deep View",
    summary:
      "Approve pending user, nutritionist, and subscription actions from one queue.",
    points: [
      "New registrations and subscription requests appear here.",
      "Approve or defer each request before it moves into the system.",
      "A single queue keeps operational work from getting lost.",
      "Every approval adds an audit trail entry.",
    ],
  },
  reports: {
    title: "Reports - Deep View",
    summary:
      "Read weekly and monthly summaries for platform usage and support work.",
    points: [
      "Track total users, subscriptions, complaints, and verification trends.",
      "Generate snapshots for meetings or management review.",
      "Use these summaries to spot growth and bottlenecks early.",
      "Reports are the admin-level view of platform health.",
    ],
  },
  health: {
    title: "System Health - Deep View",
    summary:
      "Watch platform stability, failed logins, pending approvals, and uptime signals.",
    points: [
      "Monitor login activity and failed sign-in attempts.",
      "Watch pending verifications and approval backlog.",
      "Quick checks help detect slowdowns or broken workflows early.",
      "Health data should be reviewed before the end of each day.",
    ],
  },
  audit: {
    title: "Audit Log - Deep View",
    summary:
      "See who performed actions and when the platform changed.",
    points: [
      "Account changes, approvals, and complaint resolutions are logged here.",
      "Audit logs support accountability and troubleshooting.",
      "A change history helps admins review what happened later.",
      "Keep the log visible when multiple staff members are active.",
    ],
  },
};

const seedUsers = [
  { id: "U-1001", name: "Karthika", plan: "Premium", nutritionist: "Priya Sharma", status: "Active", lastActivity: "Today" },
  { id: "U-1002", name: "Ananya Verma", plan: "Premium", nutritionist: "Ritu Verma", status: "Active", lastActivity: "Yesterday" },
  { id: "U-1003", name: "Rahul Singh", plan: "Free", nutritionist: "Anita Nair", status: "Pending upgrade", lastActivity: "Today" },
  { id: "U-1004", name: "Meera Joshi", plan: "Premium", nutritionist: "Priya Sharma", status: "Active", lastActivity: "Today" },
];

const seedNutritionists = [
  { id: "N-1023", name: "Priya Sharma", users: 12, status: "Verified", pending: 2 },
  { id: "N-1048", name: "Ritu Verma", users: 9, status: "Verified", pending: 1 },
  { id: "N-1077", name: "Anita Nair", users: 8, status: "Pending check", pending: 4 },
];

const seedSubscriptions = [
  { id: "S-201", user: "Karthika", plan: "Premium", status: "Active", renewal: "2026-04-20" },
  { id: "S-202", user: "Rahul Singh", plan: "Free", status: "Pending upgrade", renewal: "2026-04-12" },
  { id: "S-203", user: "Ananya Verma", plan: "Premium", status: "Active", renewal: "2026-04-25" },
];

const seedComplaints = [
  { id: "C-1001", category: "System", severity: "High", owner: "Support Team", status: "Open", message: "Video consultation page loads slowly." },
  { id: "C-1002", category: "Payment", severity: "Medium", owner: "Billing", status: "In progress", message: "Premium upgrade not reflected." },
  { id: "C-1003", category: "Service", severity: "Low", owner: "Nutrition Team", status: "Resolved", message: "Diet plan update requested." },
];

const seedApprovals = [
  { id: "A-001", type: "Nutritionist registration", name: "G Sriya", status: "Pending" },
  { id: "A-002", type: "User subscription change", name: "Rahul Singh", status: "Pending" },
  { id: "A-003", type: "Complaint close-out", name: "C-1003", status: "Pending" },
];

function loadProfile() {
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
}

function AdminDeepDive() {
  const { section } = useParams();
  const detail = section ? sectionMap[section] : sectionMap.overview;
  const adminProfile = loadProfile();
  const [users, setUsers] = useState(seedUsers);
  const [nutritionists] = useState(seedNutritionists);
  const [subscriptions, setSubscriptions] = useState(seedSubscriptions);
  const [complaints, setComplaints] = useState(seedComplaints);
  const [approvals, setApprovals] = useState(seedApprovals);
  const [auditLog, setAuditLog] = useState([
    { time: "08:00 PM", action: "Nightly review window started", detail: "Approval queue opened." },
    { time: "03:20 PM", action: "Subscription change requested", detail: "Rahul Singh asked for upgrade review." },
    { time: "11:10 AM", action: "Nutritionist login", detail: `${adminProfile.name} accessed admin tools.` },
  ]);

  const summary = useMemo(
    () => ({
      users: users.length,
      nutritionists: nutritionists.length,
      subscriptions: subscriptions.filter((item) => item.status === "Active").length,
      complaints: complaints.filter((item) => item.status !== "Resolved").length,
      approvals: approvals.filter((item) => item.status === "Pending").length,
    }),
    [approvals, complaints, nutritionists.length, subscriptions.length, users.length],
  );

  const pushAudit = (action, detailText) => {
    setAuditLog((prev) => [
      {
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action,
        detail: detailText,
      },
      ...prev,
    ]);
  };

  const acceptApproval = (approvalId) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === approvalId ? { ...item, status: "Approved" } : item,
      ),
    );
    pushAudit("Approval accepted", `Queue item ${approvalId} approved by admin.`);
  };

  const resolveComplaint = (complaintId) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === complaintId ? { ...item, status: "Resolved" } : item,
      ),
    );
    pushAudit("Complaint resolved", `Complaint ${complaintId} marked resolved.`);
  };

  const activatePlan = (subscriptionId) => {
    setSubscriptions((prev) =>
      prev.map((item) =>
        item.id === subscriptionId ? { ...item, status: "Active" } : item,
      ),
    );
    pushAudit("Plan activated", `Subscription ${subscriptionId} activated.`);
  };

  if (!detail) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Deep view not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          That admin section does not have a deep page yet.
        </p>
        <Link
          to="/dashboard/admin"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/dashboard/admin"
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Dashboard
      </Link>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Admin Deep View
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">{detail.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{detail.summary}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">{adminProfile.name}</p>
            <p>Employee ID: {adminProfile.employeeId || "Not set"}</p>
            <p>Platform command center</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Users</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.users}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Nutritionists</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.nutritionists}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Active plans</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.subscriptions}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Open complaints</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.complaints}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Pending approvals</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.approvals}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Section Breakdown
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {detail.points.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {section === "nutritionists" ? "Nutritionist management" : section === "subscriptions" ? "Subscription control" : section === "complaints" ? "Complaint review" : section === "approvals" ? "Approval queue" : "Operational records"}
              </h2>
              <p className="text-[11px] text-slate-500">
                Everything stays inside the admin deep view.
              </p>
            </div>
            <Link
              to="/dashboard/admin/deep-dive/overview"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Overview
            </Link>
          </div>

          {section === "users" && (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {user.id} • {user.plan} • {user.status}
                      </p>
                    </div>
                    <Link
                      to="/dashboard/user/deep-dive/routine"
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Open user deep view
                    </Link>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600">
                    Nutritionist: {user.nutritionist} • Last activity: {user.lastActivity}
                  </p>
                </div>
              ))}
            </div>
          )}

          {section === "nutritionists" && (
            <div className="space-y-2">
              {nutritionists.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.id} • {item.users} users • {item.pending} pending
                      </p>
                    </div>
                    <Link
                      to="/dashboard/nutritionist/deep-dive/overview"
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Open deep view
                    </Link>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600">
                    Status: {item.status}
                  </p>
                </div>
              ))}
            </div>
          )}

          {section === "subscriptions" && (
            <div className="space-y-2">
              {subscriptions.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{item.user}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.plan} • renews {item.renewal}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500">
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => activatePlan(item.id)}
                      className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90"
                    >
                      Activate / renew
                    </button>
                    <Link
                      to="/dashboard/admin/deep-dive/reports"
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Open report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === "complaints" && (
            <div className="space-y-2">
              {complaints.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.id} • {item.category}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.owner} • severity {item.severity}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600">{item.message}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => resolveComplaint(item.id)}
                      className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90"
                    >
                      Resolve
                    </button>
                    <Link
                      to="/dashboard/admin/deep-dive/audit"
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      View audit log
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === "approvals" && (
            <div className="space-y-2">
              {approvals.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{item.type}</p>
                      <p className="text-[11px] text-slate-500">{item.name}</p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500">
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => acceptApproval(item.id)}
                      className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90"
                      disabled={item.status === "Approved"}
                    >
                      Accept
                    </button>
                    <Link
                      to="/dashboard/admin/deep-dive/audit"
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Audit trail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === "reports" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Weekly users</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">+12%</p>
                <p className="mt-1 text-[11px] text-slate-600">Growth versus last week.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Complaint close rate</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">84%</p>
                <p className="mt-1 text-[11px] text-slate-600">Resolved within SLA window.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Nutritionist verifications</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">96</p>
                <p className="mt-1 text-[11px] text-slate-600">Records accepted this week.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Subscription renewals</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">58</p>
                <p className="mt-1 text-[11px] text-slate-600">Auto-renew with manual review queue.</p>
              </div>
            </div>
          )}

          {section === "health" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Successful logins", "1,284", "Today"],
                ["Failed logins", "14", "Check suspicious attempts"],
                ["Pending verifications", "9", "Nutritionist onboarding"],
                ["Night approvals", "22", "Records awaiting sign-off"],
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
                  <p className="mt-1 text-[11px] text-slate-600">{note}</p>
                </div>
              ))}
            </div>
          )}

          {section === "audit" && (
            <div className="space-y-2">
              {auditLog.map((item) => (
                <div key={`${item.time}-${item.action}`} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800">{item.action}</p>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          )}

          {section === "overview" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Users", "Open user management", "/dashboard/admin/deep-dive/users"],
                ["Nutritionists", "Review staff and workload", "/dashboard/admin/deep-dive/nutritionists"],
                ["Subscriptions", "Check plan health", "/dashboard/admin/deep-dive/subscriptions"],
                ["Complaints", "Resolve open issues", "/dashboard/admin/deep-dive/complaints"],
              ].map(([title, copy, path]) => (
                <Link key={title} to={path} className="rounded-2xl bg-slate-50 p-3 hover:bg-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-[11px] text-slate-600">{copy}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <h2 className="text-sm font-semibold text-slate-900">Admin shortcuts</h2>
          <div className="space-y-2">
            {[
              ["Users", "/dashboard/admin/deep-dive/users"],
              ["Nutritionists", "/dashboard/admin/deep-dive/nutritionists"],
              ["Subscriptions", "/dashboard/admin/deep-dive/subscriptions"],
              ["Complaints", "/dashboard/admin/deep-dive/complaints"],
              ["Approvals", "/dashboard/admin/deep-dive/approvals"],
              ["Reports", "/dashboard/admin/deep-dive/reports"],
              ["System Health", "/dashboard/admin/deep-dive/health"],
              ["Audit Log", "/dashboard/admin/deep-dive/audit"],
            ].map(([label, path]) => (
              <Link
                key={label}
                to={path}
                className="block rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 text-[11px] text-amber-800">
            Deep view entries stay inside the admin panel so every operational task opens within the app.
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminDeepDive;
