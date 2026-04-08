import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getAssignedUsersForNutritionist,
  getLoggedInNutritionist,
  getTodayPoints,
  getWeeklyPointsSeries,
  loadAppointments,
  loadDailyRoutine,
} from "../../lib/wellness.js";

const deepDiveMap = {
  overview: {
    title: "Nutritionist Overview - Deep View",
    summary:
      "See the live summary for your assigned users, consultations, appointment load, and daily review work.",
    points: [
      "The dashboard now reflects the logged-in nutritionist instead of a fixed default name.",
      "Assigned users are grouped to the nutritionist who owns that case list.",
      "Evening approvals at 8:00 PM turn uploads into points and weekly progress.",
      "Appointments booked by users are tied back to the same nutritionist profile.",
    ],
  },
  consultations: {
    title: "Consultations - Deep View",
    summary:
      "Track the consultations attached to this nutritionist and prepare the face-to-face video calls.",
    points: [
      "Appointments are booked before the call instead of users calling directly.",
      "The 5-minute reminder helps the user and nutritionist prepare on time.",
      "A nutritionist can review the reason for each booking before joining.",
      "Completed calls stay in history so the weekly schedule is easy to follow.",
    ],
  },
  users: {
    title: "Assigned Users - Deep View",
    summary:
      "View the users mapped to this nutritionist and keep one doctor-like follow-up relationship.",
    points: [
      "Each user stays mapped to one nutritionist for continuity.",
      "The list can include meals, routine check-ins, and consultation follow-up work.",
      "The weekly round-up shows how many users are currently under this case load.",
      "Open a user card to review the plan and note what needs attention.",
    ],
  },
  review: {
    title: "8:00 PM Review - Deep View",
    summary:
      "Review meal photos, exercise proof, and daily uploads in the nightly approval window.",
    points: [
      "The review queue becomes the point-award checkpoint at 8:00 PM.",
      "Approved uploads raise the weekly graph and consistency streak.",
      "Exercise proof and meal photos are shown with the same nightly workflow.",
      "Use the approve button after checking the submitted image and routine slot.",
    ],
  },
  records: {
    title: "Patient Night Record - Deep View",
    summary:
      "See the patient's record up to night and accept the full daily check-in set in one place.",
    points: [
      "The patient name is shown with the record so the nutritionist knows whose file is being reviewed.",
      "Morning water, exercise, meals, snacks, and dinner can all be accepted from the nightly record.",
      "The accept action closes the loop after the day&apos;s uploads are reviewed.",
      "This view keeps the record inside the app instead of sending you outside the dashboard.",
    ],
  },
  appointments: {
    title: "Appointments - Deep View",
    summary:
      "See the appointment load that belongs to this nutritionist and the users waiting for their slot.",
    points: [
      "Appointments stay attached to the assigned nutritionist.",
      "The dashboard can surface the next few consultations at a glance.",
      "Weekly connect sessions can be planned from the same list.",
      "The same nutritionist sees the user again, like a regular hospital follow-up.",
    ],
  },
  points: {
    title: "Points - Deep View",
    summary:
      "Review how approvals, streaks, and verified uploads move the weekly points graph.",
    points: [
      "Today&apos;s approvals feed the points total for the day and week.",
      "A streak grows when uploads are approved on consecutive days.",
      "The weekly graph shows how the nutritionist review impacts habit building.",
      "Points are awarded only after review, so the final check stays with the nutritionist.",
    ],
  },
};

function NutritionistDeepDive() {
  const { section } = useParams();
  const detail = section ? deepDiveMap[section] : deepDiveMap.overview;

  const identity =
    localStorage.getItem("nbCurrentNutritionistName") ||
    localStorage.getItem("nbCurrentUserName") ||
    localStorage.getItem("nbUserName") ||
    "Priya Sharma";
  const nutritionist = getLoggedInNutritionist(identity);
  const assignedUsers = getAssignedUsersForNutritionist(nutritionist);
  const appointments = loadAppointments().filter(
    (item) => item.nutritionist === nutritionist.name,
  );
  const reviewRoutine = loadDailyRoutine();
  const pendingReviews = reviewRoutine.filter(
    (item) => item.photoUrl && !item.verified,
  );
  const todayPoints = getTodayPoints(reviewRoutine);
  const weeklyPoints = getWeeklyPointsSeries();
  const nightRecord = reviewRoutine.map((item) => ({
    ...item,
    status: item.verified ? "Accepted" : item.submittedAt ? "Awaiting approval" : "Pending upload",
  }));

  if (!detail) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          Deep view not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          That nutritionist section does not have a deep page yet.
        </p>
        <Link
          to="/dashboard/nutritionist"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Nutritionist Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/dashboard/nutritionist"
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Nutritionist Dashboard
      </Link>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{detail.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{detail.summary}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">{nutritionist.name}</p>
            <p>{nutritionist.employeeId}</p>
            <p>{nutritionist.specialty}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Assigned users</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {assignedUsers.length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Appointments</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {appointments.length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Pending reviews</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {pendingReviews.length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] text-slate-500">Today&apos;s points</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {todayPoints}
            </p>
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

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Assigned users</p>
                <p className="text-[11px] text-slate-500">
                  Users mapped to this nutritionist this week.
                </p>
              </div>
              <Link
                to="/dashboard/nutritionist/deep-dive/users"
                className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Open users view
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {assignedUsers.slice(0, 5).map((user) => (
                <div
                  key={user.name}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {user.plan} • {user.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500">
                    {nutritionist.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Appointments</p>
                <p className="text-[11px] text-slate-500">
                  Booked slots for the currently logged-in nutritionist.
                </p>
              </div>
              <Link
                to="/dashboard/nutritionist/deep-dive/appointments"
                className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Open appointments
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {appointments.length === 0 ? (
                <p className="text-sm text-slate-400">No appointments booked yet.</p>
              ) : (
                appointments.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-50 px-3 py-2 text-xs"
                  >
                    <p className="font-medium text-slate-800">
                      {item.reason || "Consultation"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.date} • {item.time} • {item.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Patient record upto night
              </p>
              <p className="text-[11px] text-slate-500">
                {nutritionist.name}&apos;s current mapped patient and their day record.
              </p>
            </div>
            <Link
              to="/dashboard/nutritionist"
              className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to dashboard
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {assignedUsers[0] ? (
              <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs">
                <p className="font-semibold text-slate-800">{assignedUsers[0].name}</p>
                <p className="text-[11px] text-slate-500">
                  {assignedUsers[0].plan} • {assignedUsers[0].status}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No patient is assigned yet.</p>
            )}
            {nightRecord.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-50 px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-slate-800">
                    {item.time} • {item.title}
                  </p>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/dashboard/nutritionist/deep-dive/review"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Accept night record
            </Link>
            <Link
              to="/dashboard/nutritionist/deep-dive/users"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View assigned users
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/dashboard/nutritionist"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/dashboard/nutritionist/deep-dive/review"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Review queue
          </Link>
          <Link
            to="/dashboard/nutritionist/deep-dive/points"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Weekly points
          </Link>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          Weekly points trend: {weeklyPoints.join(" • ")}
        </div>
      </section>
    </div>
  );
}

export default NutritionistDeepDive;
