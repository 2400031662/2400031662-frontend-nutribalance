import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getAssignedUsersForNutritionist,
  getLoggedInNutritionist,
  loadFoodScans,
  loadDailyRoutine,
  loadAppointments,
  loadPointsLedger,
  saveDailyRoutine,
  savePointsLedger,
  saveFoodScans,
} from "../../lib/wellness.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function NutritionistDashboard() {
  const [nutritionist, setNutritionist] = useState({
    name: "Priya Sharma",
    employeeId: "NB1023",
    specialty: "Weight loss and pregnancy support",
  });
  const [reviewRoutine, setReviewRoutine] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [mealPhotoReviews, setMealPhotoReviews] = useState([]);
  const [mealPointDrafts, setMealPointDrafts] = useState({});
  const [consultationsToday, setConsultationsToday] = useState(6);
  const [completedToday, setCompletedToday] = useState(2);
  const [pendingUpdates, setPendingUpdates] = useState(3);
  const [weeklyConsultations, setWeeklyConsultations] = useState([4, 5, 6, 5, 7, 4, 6]);
  const [usersOverWeek, setUsersOverWeek] = useState([18, 19, 20, 21, 22, 23, 24]);
  const [nightRecordAccepted, setNightRecordAccepted] = useState(false);
  const mealReviewRef = useRef(null);

  useEffect(() => {
    const currentUser =
      localStorage.getItem("nbCurrentNutritionistName") ||
      localStorage.getItem("nbCurrentUserName") ||
      localStorage.getItem("nbUserName") ||
      "Karthika";
    const currentProfile = getLoggedInNutritionist(currentUser);
    setNutritionist(currentProfile);
    setReviewRoutine(loadDailyRoutine());
    setAssignedUsers(getAssignedUsersForNutritionist(currentProfile));
    setAppointments(loadAppointments());
    setMealPhotoReviews(loadFoodScans());
  }, []);

  useEffect(() => {
    const syncMealReviews = () => {
      setMealPhotoReviews(loadFoodScans());
    };

    if (typeof window === "undefined") {
      return undefined;
    }

    window.addEventListener("storage", syncMealReviews);
    window.addEventListener("focus", syncMealReviews);
    return () => {
      window.removeEventListener("storage", syncMealReviews);
      window.removeEventListener("focus", syncMealReviews);
    };
  }, []);

  const upcomingToday = consultationsToday - completedToday;
  const pendingReviewCount = reviewRoutine.filter(
    (item) => item.submittedAt && !item.verified,
  ).length;
  const nutritionistAppointments = appointments.filter(
    (item) => item.nutritionist === nutritionist.name,
  );
  const weeklyGroupCount = assignedUsers.length;
  const pendingAppointmentCount = nutritionistAppointments.filter(
    (item) => item.status !== "Completed",
  ).length;
  const pendingMealReviewCount = mealPhotoReviews.filter(
    (item) => !Number(item.pointsAwarded || 0),
  ).length;
  const awardedMealPoints = useMemo(
    () =>
      mealPhotoReviews.reduce(
        (sum, item) => sum + Number(item.pointsAwarded || 0),
        0,
      ),
    [mealPhotoReviews],
  );
  const currentAppointmentNames = useMemo(
    () => nutritionistAppointments.slice(0, 3).map((item) => item.reason || item.time),
    [nutritionistAppointments],
  );
  const currentPatient = assignedUsers[0] || null;
  const patientNightRecord = useMemo(
    () =>
      reviewRoutine.map((item) => ({
        id: item.id,
        time: item.time,
        title: item.title,
        status: item.verified ? "Accepted" : item.submittedAt ? "Awaiting approval" : "Pending upload",
        points: item.points,
      })),
    [reviewRoutine],
  );

  const addUser = () => {
    setAssignedUsers((prev) => [
      {
        name: `User ${prev.length + 1}`,
        plan: "Premium plan",
        status: "On track",
      },
      ...prev,
    ]);
    setUsersOverWeek((prev) => [...prev.slice(0, -1), prev[6] + 1]);
  };

  const completeConsultation = () => {
    if (upcomingToday <= 0) return;
    setCompletedToday((c) => c + 1);
  };

  const openMealReviewSection = () => {
    mealReviewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const approveAllPending = () => {
    reviewRoutine
      .filter((item) => item.photoUrl && !item.verified)
      .forEach((item) => approveRoutineItem(item.id));
    setNightRecordAccepted(true);
  };

  const acceptNightRecord = () => {
    approveAllPending();
    setNightRecordAccepted(true);
  };

  const approveRoutineItem = (itemId) => {
    const now = new Date();
    const weekIndex = (now.getDay() + 6) % 7;
    const currentRoutine = loadDailyRoutine();
    const target = currentRoutine.find((item) => item.id === itemId);

    if (!target) {
      return;
    }

    const updatedRoutine = currentRoutine.map((item) =>
      item.id === itemId
        ? {
            ...item,
            completed: true,
            verified: true,
            submittedAt: item.submittedAt || now.toISOString(),
            verifiedAt: now.toISOString(),
          }
        : item,
    );

    saveDailyRoutine(updatedRoutine);
    setReviewRoutine(updatedRoutine);

    const ledger = loadPointsLedger();
    ledger.push({
      date: now.toISOString().slice(0, 10),
      weekIndex,
      source: "nutritionist-approval",
      itemId,
      label: target.title,
      points: Number(target.points || 0),
    });
    savePointsLedger(ledger);
  };

  const approveMealPhotoItem = (itemId) => {
    const now = new Date();
    const weekIndex = (now.getDay() + 6) % 7;
    const currentScans = loadFoodScans();
    const target = currentScans.find((item) => item.id === itemId);

    if (!target || Number(target.pointsAwarded || 0) > 0) {
      return;
    }

    const draftValue = Number(
      mealPointDrafts[itemId] ?? target.suggestedPoints ?? 8,
    );
    const points =
      Number.isFinite(draftValue) && draftValue > 0 ? draftValue : 8;

    const updatedScans = currentScans.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status: "Accepted",
            pointsAwarded: points,
            reviewedBy: nutritionist.name,
            reviewedAt: now.toISOString(),
          }
        : item,
    );

    saveFoodScans(updatedScans);
    setMealPhotoReviews(updatedScans);

    const ledger = loadPointsLedger();
    ledger.push({
      date: now.toISOString().slice(0, 10),
      weekIndex,
      source: "meal-photo-approval",
      itemId,
      label: target.label,
      points,
      userName: target.userName || "User",
      hint: target.hint || "",
      fileName: target.fileName || "",
      reviewedBy: nutritionist.name,
    });
    savePointsLedger(ledger);
  };

  const consultationPieData = {
    labels: ["Completed", "Upcoming"],
    datasets: [
      {
        data: [completedToday, upcomingToday],
        backgroundColor: ["#0f9d58", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const consultationsBarData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Consultations",
        data: weeklyConsultations,
        backgroundColor: "rgba(15, 157, 88, 0.7)",
        borderColor: "#0f9d58",
        borderWidth: 1,
      },
    ],
  };

  const usersLineData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Assigned users (total)",
        data: usersOverWeek,
        borderColor: "#0f9d58",
        backgroundColor: "rgba(15, 157, 88, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#64748b", font: { size: 10 } },
        grid: { color: "rgba(148, 163, 184, 0.15)" },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Nutritionist Dashboard
          </p>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Good afternoon, {nutritionist.name.split(" ")[0]}
          </h1>
          <p className="text-xs text-slate-500">
            Overview of today&apos;s consultations, assigned users, and daily approvals.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openMealReviewSection}
              className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90"
            >
              Open meal award section
            </button>
            <Link
              to="/dashboard/nutritionist/deep-dive/points"
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Points deep view
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200" />
          <div className="text-xs">
            <p className="font-semibold text-slate-800">{nutritionist.name}</p>
            <p className="text-slate-500">Employee ID: {nutritionist.employeeId}</p>
            <p className="text-[11px] text-slate-500">{nutritionist.specialty}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 text-xs">
        {[
          ["", "Overview"],
          ["consultations", "Consultations"],
          ["users", "Assigned Users"],
          ["records", "Night Record"],
          ["review", "8 PM Review"],
          ["appointments", "Appointments"],
          ["points", "Points"],
        ].map(([key, label]) => (
          <Link
            key={key}
            to={key ? `/dashboard/nutritionist/deep-dive/${key}` : "/dashboard/nutritionist/deep-dive"}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            {label} deep view
          </Link>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] text-slate-500">Video consultations today</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{consultationsToday}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            {completedToday} completed • {upcomingToday} upcoming
          </p>
          <button
            type="button"
            onClick={completeConsultation}
            className="mt-2 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20"
          >
            + Mark 1 completed
          </button>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] text-slate-500">Assigned active users</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{assignedUsers.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            {weeklyGroupCount} users mapped to your case list.
          </p>
          <button
            type="button"
            onClick={addUser}
            className="mt-2 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20"
          >
            + Add 1 user
          </button>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] text-slate-500">Pending diet updates</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{pendingReviewCount || pendingUpdates}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Prioritize high-risk health cases.
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            {pendingAppointmentCount} open appointments waiting on your schedule.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Today&apos;s consultations (reactive pie)
          </h2>
          <div className="h-52">
            <Doughnut data={consultationPieData} options={pieOptions} />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Click &quot;Mark 1 completed&quot; to see the pie update.
          </p>
        </section>
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Assigned users this week (reactive)
          </h2>
          <div className="h-52">
            <Line data={usersLineData} options={chartOptions} />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Click &quot;Add 1 user&quot; – the line and total users increase.
          </p>
        </section>
      </div>
      <div className="mt-6">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Consultations per day this week (bar chart)
          </h2>
          <div className="h-48">
            <Bar data={consultationsBarData} options={chartOptions} />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1.7fr,1.3fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Today&apos;s Video Consultations
            </h2>
            <Link
              to="/dashboard/nutritionist/deep-dive/consultations"
              className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Open deep view
            </Link>
          </div>
          <div className="space-y-2">
            {(nutritionistAppointments.length > 0
              ? nutritionistAppointments
              : [
                  {
                    time: "10:00 AM",
                    date: "Today",
                    reason: "General review",
                    status: "Completed",
                    nutritionist: nutritionist.name,
                  },
                  {
                    time: "12:30 PM",
                    date: "Today",
                    reason: "Weight loss follow-up",
                    status: "Upcoming",
                    nutritionist: nutritionist.name,
                  },
                  {
                    time: "3:00 PM",
                    date: "Today",
                    reason: "Meal planning",
                    status: "Upcoming",
                    nutritionist: nutritionist.name,
                  },
                ]
            ).slice(0, 3).map((item) => (
              <div
                key={`${item.date || "today"}-${item.time}-${item.reason || "appt"}`}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-800">{item.reason || "Consultation"}</p>
                  <p className="text-[11px] text-slate-500">{item.time}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    item.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-600">
            <p className="font-semibold text-slate-800">Weekly connect summary</p>
            <p className="mt-1">
              {weeklyGroupCount} users are mapped to you this week.
            </p>
            <p className="mt-1">
              Next focus: {currentAppointmentNames.length > 0 ? currentAppointmentNames.join(" • ") : "Follow-up reviews and meal planning."}
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <h2 className="text-sm font-semibold text-slate-900">
            Assigned Users
          </h2>
          <div className="space-y-2">
            {assignedUsers.map((user) => (
              <div
                key={user.name}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-800">{user.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {user.plan} • {user.status}
                  </p>
                </div>
                <Link
                  to="/dashboard/nutritionist/deep-dive/users"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  Deep view
                </Link>
              </div>
            ))}
          </div>

          <div className="pt-1 text-[11px] text-slate-500">
            In a complete system, these cards would open detailed user
            profiles, chat, and diet plan editing screens.
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1.4fr,1fr]">
        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600">
                8:00 PM review checkpoint
              </p>
              <h2 className="text-sm font-semibold text-slate-900">
                Nightly photo review queue
              </h2>
              <p className="text-[11px] text-slate-500">
                Approve the user&apos;s uploads so points go to the weekly graph. This is the daily approval window at 8:00 PM.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500">
                Pending: {reviewRoutine.filter((item) => item.submittedAt && !item.verified).length}
              </p>
              <Link
                to="/dashboard/nutritionist/deep-dive/review"
                className="mt-1 inline-flex rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Open deep view
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={approveAllPending}
              className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90"
            >
              Approve all pending
            </button>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-700">
              8:00 PM notification enabled
            </span>
          </div>

          <div className="space-y-3">
            {reviewRoutine
              .filter((item) => item.photoUrl)
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.time} • {item.points} pts
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        item.verified
                          ? "bg-emerald-50 text-emerald-700"
                          : item.submittedAt
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.verified ? "Verified" : item.submittedAt ? "Submitted" : "Pending"}
                    </span>
                  </div>

                  {item.photoUrl && (
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="mt-2 h-28 w-full rounded-2xl object-cover"
                    />
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => approveRoutineItem(item.id)}
                      className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90"
                      disabled={item.verified}
                    >
                      Approve & award points
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Assigned patient focus
            </h2>
            <Link
              to="/dashboard/nutritionist/deep-dive/users"
              className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Deep view
            </Link>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            {currentPatient ? (
              <>
                <p className="font-semibold text-slate-800">{currentPatient.name}</p>
                <p className="text-[11px] text-slate-500">
                  {currentPatient.plan} • {currentPatient.status}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-800">
                  No patient selected
                </p>
                <p className="text-[11px] text-slate-500">
                  Your mapped user list will appear here.
                </p>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            The user always stays mapped to one nutritionist, like a regular hospital follow-up relationship.
          </p>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Night record
                </p>
                <p className="text-xs text-slate-600">
                  {currentPatient?.name || "Patient"} record upto night
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                  nightRecordAccepted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {nightRecordAccepted ? "Accepted" : "Pending"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {patientNightRecord.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-white px-3 py-2 text-[11px] text-slate-600"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-800">
                      {item.time} • {item.title}
                    </p>
                    <span className="text-[10px] text-slate-500">{item.points} pts</span>
                  </div>
                  <p className="mt-1">{item.status}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={acceptNightRecord}
                className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90"
              >
                Accept night record
              </button>
              <Link
                to="/dashboard/nutritionist/deep-dive/records"
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
              >
                Open deep view
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-600">
            Weekly round-up: {weeklyGroupCount} mapped users, {pendingAppointmentCount} open appointments, and {pendingReviewCount} uploads awaiting approval.
          </div>
        </section>

        <section
          ref={mealReviewRef}
          id="meal-reviews"
          className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs md:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                AI meal supporter
              </p>
              <h2 className="text-sm font-semibold text-slate-900">
                Meal photo reviews and points
              </h2>
              <p className="text-[11px] text-slate-500">
                Review the user&apos;s meal upload, enter the points you want to award, and save it back to the user portal.
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800">
              {pendingMealReviewCount} pending, {awardedMealPoints} awarded
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {mealPhotoReviews.length === 0 ? (
              <p className="text-sm text-slate-400">
                No meal uploads have been sent yet.
              </p>
            ) : (
              mealPhotoReviews.map((item) => {
                const draftValue =
                  mealPointDrafts[item.id] ?? item.suggestedPoints ?? 8;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.time} • {item.userName || "User"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          item.pointsAwarded > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.pointsAwarded > 0 ? "Awarded" : "Pending"}
                      </span>
                    </div>

                    {item.photoUrl && (
                      <img
                        src={item.photoUrl}
                        alt={item.label}
                        className="mt-2 h-32 w-full rounded-2xl object-cover"
                      />
                    )}

                    <p className="mt-2 text-[11px] text-slate-600">
                      {item.guideTitle}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Suggested points: {item.suggestedPoints || 8}
                    </p>

                    <label className="mt-3 block text-[11px] font-medium text-slate-700">
                      Award points
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={draftValue}
                      onChange={(e) =>
                        setMealPointDrafts((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => approveMealPhotoItem(item.id)}
                        disabled={item.pointsAwarded > 0}
                        className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Award points
                      </button>
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                        {item.pointsAwarded > 0
                          ? `${item.pointsAwarded} pts saved`
                          : "Waiting for review"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default NutritionistDashboard;
