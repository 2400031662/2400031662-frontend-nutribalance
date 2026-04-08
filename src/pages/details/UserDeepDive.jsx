import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const deepDiveMap = {
  chat: {
    title: "Chat Support - Deep View",
    summary:
      "Ask nutrition questions and receive instant guidance from your assigned nutritionist flow.",
    points: [
      "Quick replies cover water, meal timing, exercise, and common doubts.",
      "Messages stay saved locally so you can continue the same conversation later.",
      "Use chat to ask what to eat before or after a workout.",
      "Escalate to the nutritionist when you need a human review.",
    ],
  },
  scanner: {
    title: "AI Food Scanner - Deep View",
    summary:
      "Upload meal photos and estimate calories, protein, carbs, fats, fibre, vitamins, and minerals.",
    points: [
      "Photo upload gives a quick estimate for common Indian meals and plate patterns.",
      "Vitamins and minerals are shown as a demo approximation for your image.",
      "Scan history lets you compare meals and spot high-calorie days.",
      "The nutritionist can refine the estimate after review.",
    ],
  },
  consultation: {
    title: "Video Consultation - Deep View",
    summary:
      "Book a slot with your assigned nutritionist instead of calling directly.",
    points: [
      "One user stays mapped to one nutritionist for continuity, like a real hospital follow-up.",
      "Appointments are booked with date, time, and reason.",
      "A reminder appears 5 minutes before the scheduled consultation.",
      "Completed sessions stay visible in your appointment history.",
    ],
  },
  routine: {
    title: "Daily Routine - Deep View",
    summary:
      "Upload photos for morning water, exercise, meals, and evening routines.",
    points: [
      "Every routine item has a time slot and a points value.",
      "Meal, exercise, and water proof photos are submitted for nightly review.",
      "The nutritionist can verify each item and award points.",
      "Your weekly score grows as more checks are approved.",
    ],
  },
  points: {
    title: "Weekly Points - Deep View",
    summary:
      "Understand how approvals turn into progress on the weekly score graph.",
    points: [
      "Approved check-ins add points to the weekly graph.",
      "Consistency matters more than one perfect day.",
      "Use the graph to track habit building across the week.",
      "The nutritionist review acts as the final verification step.",
    ],
  },
};

function UserDeepDive() {
  const { section } = useParams();
  const detail = section ? deepDiveMap[section] : null;

  if (!detail) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          Deep view not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          That dashboard section does not have a deep page yet.
        </p>
        <Link
          to="/dashboard/user"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to User Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/dashboard/user"
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User Dashboard
      </Link>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{detail.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{detail.summary}</p>

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

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/dashboard/user/chat"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Open Chat
          </Link>
          <Link
            to="/dashboard/user/ai-scanner"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Open AI Scanner
          </Link>
          <Link
            to="/dashboard/user/video-consultation"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Open Video Consultation
          </Link>
          <Link
            to="/dashboard/user"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

export default UserDeepDive;
