import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const detailMap = {
  roles: {
    title: "3 Roles Overview",
    summary: "How User, Nutritionist, and Admin work together in one platform.",
    points: [
      "Users track meals, health progress, reminders, and consultations.",
      "Nutritionists review user data and update diet plans quickly.",
      "Admins monitor subscriptions, issues, and platform quality.",
      "Role separation keeps each dashboard focused and easier to use.",
    ],
  },
  users: {
    title: "For Users - Deep View",
    summary: "Everything available for end users in NutriBalance.",
    points: [
      "Personalized daily diet plan with breakfast, lunch, snacks, and dinner.",
      "Water tracker, reminders, and weekly progress trend charts.",
      "Health guidance based on selected goal and profile details.",
      "Direct access to chat and video consultation modules.",
    ],
  },
  nutritionists: {
    title: "For Nutritionists - Deep View",
    summary: "Core workflow for nutrition professionals.",
    points: [
      "Manage assigned user list and review health progress snapshots.",
      "Create, edit, and optimize diet plans per user goal.",
      "Provide continuous support through chat and video consultation.",
      "Track recurring issues to improve user outcomes.",
    ],
  },
  admin: {
    title: "For Admin / Manager - Deep View",
    summary: "Administrative control and system monitoring areas.",
    points: [
      "Monitor user growth, subscription status, and service quality.",
      "Manage nutritionist onboarding and account lifecycle.",
      "Track complaints, prioritize incidents, and resolve bottlenecks.",
      "Review weekly and monthly operational performance.",
    ],
  },
  "ai-scanner": {
    title: "AI Food Scanner - Deep View",
    summary: "How image-based nutrition analysis fits the user journey.",
    points: [
      "Upload meal photos and estimate calorie and macro distribution.",
      "Use scanned values to improve diet adherence day by day.",
      "Support personalized recommendations from nutritionists.",
      "Connect scanner output with progress trends for better decisions.",
    ],
  },
  "video-consultations": {
    title: "Video Consultations - Deep View",
    summary: "Live expert interaction as part of the care loop.",
    points: [
      "Schedule consultation slots for regular follow-up.",
      "Discuss meal performance and plan adjustments in real time.",
      "Capture action points for next week inside the dashboard routine.",
      "Improve consistency with guided accountability.",
    ],
  },
  "ai-insights": {
    title: "AI & Health Insights - Deep View",
    summary: "Combined intelligence from nutrition data and behavior patterns.",
    points: [
      "Daily summaries help users understand intake quality quickly.",
      "Goal-aware suggestions support steady progress and retention.",
      "Insights can guide both self-correction and nutritionist feedback.",
      "Pattern tracking highlights where consistency is dropping.",
    ],
  },
  subscriptions: {
    title: "Subscription Plans - Deep View",
    summary: "Access levels and value progression across plans.",
    points: [
      "Free plan supports baseline diet and BMI awareness.",
      "Premium plans unlock richer support like direct consultation.",
      "Plan structure enables gradual upgrade as user commitment grows.",
      "Role-based governance keeps access clean and manageable.",
    ],
  },
  contact: {
    title: "Contact & About - Deep View",
    summary: "Support and communication context for platform users.",
    points: [
      "Clear support channels improve trust and issue resolution speed.",
      "About messaging reinforces the health-first product direction.",
      "Contact points help users when they need rapid guidance.",
      "Operational transparency supports long-term adoption.",
    ],
  },
};

function PlatformDetails() {
  const { topic } = useParams();
  const detail = topic ? detailMap[topic] : null;

  if (!detail) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          Detail page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The section you tried to open does not exist yet.
        </p>
        <Link
          to="/home"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/home"
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{detail.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{detail.summary}</p>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Deep Details
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {detail.points.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Open Register
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
          >
            Open Login
          </Link>
        </div>
      </section>
    </div>
  );
}

export default PlatformDetails;
