import { Link } from "react-router-dom";
import { HeartPulse, Sparkles, ShieldCheck, Video, MessageCircle } from "lucide-react";

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Intro banner */}
      <section className="mb-10 rounded-3xl bg-gradient-to-r from-primary/15 via-secondary to-white px-6 py-6 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Welcome to NutriBalance
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          A complete digital platform for{" "}
          <span className="text-primary">diet, health & nutrition</span>.
        </h1>
        <p className="mt-3 text-sm text-slate-700">
          NutriBalance connects <span className="font-semibold">Users</span>,{" "}
          <span className="font-semibold">Nutritionists</span> and{" "}
          <span className="font-semibold">Admin (Manager)</span> in one web
          application – with AI food scanner, personalized diet plans, video
          consultation, progress graphs, water tracker and reminders.
        </p>
        <ul className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-3">
          <li>• AI calculates calories and macros from food photos.</li>
          <li>• Nutritionists design and update your daily diet chart.</li>
          <li>• Admin monitors users, subscriptions and reports.</li>
        </ul>
      </section>

      {/* Hero section */}
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            Personalized nutrition, powered by AI
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Balance your plate,{" "}
            <span className="text-primary">transform your health.</span>
          </h1>
          <p className="text-sm text-slate-600 sm:text-base">
            NutriBalance connects you with certified nutritionists, smart diet
            plans, and AI-based food tracking so you can build a healthy
            lifestyle that actually fits your day.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              Start Your Journey – Register
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-primary/40 px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
            >
              Login
            </Link>
            <Link
              to="/"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to Welcome
            </Link>
          </div>
          <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-800">3 Roles</p>
              <p>Admin, Nutritionist & User modules.</p>
              <Link
                to="/details/roles"
                className="mt-2 inline-block text-[11px] font-medium text-primary hover:underline"
              >
                Open deep view
              </Link>
            </div>
            <div>
              <p className="font-semibold text-slate-800">AI Food Scanner</p>
              <p>Instant calories & macros from photos.</p>
              <Link
                to="/details/ai-scanner"
                className="mt-2 inline-block text-[11px] font-medium text-primary hover:underline"
              >
                Open deep view
              </Link>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Video Consultations</p>
              <p>Book & chat with experts anytime.</p>
              <Link
                to="/details/video-consultations"
                className="mt-2 inline-block text-[11px] font-medium text-primary hover:underline"
              >
                Open deep view
              </Link>
            </div>
          </div>
        </div>

        {/* Right side card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Today&apos;s Balance
                </p>
                <p className="text-[11px] text-slate-500">
                  Example of user progress overview
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
              On track
            </span>
          </div>

          <div className="mt-5 grid gap-4 text-xs sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Calories today</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                1,420 / 1,800 kcal
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[78%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Water intake</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                1.8 L / 2.5 L
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[64%] rounded-full bg-sky-400" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 p-3">
              <p className="mb-1 text-[11px] font-semibold text-slate-700">
                Upcoming video consult
              </p>
              <p className="text-slate-600">Today • 6:30 PM</p>
              <p className="text-[11px] text-slate-500">
                With Nutritionist Priya Sharma
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 p-3">
              <p className="mb-1 text-[11px] font-semibold text-slate-700">
                Smart suggestion
              </p>
              <p className="text-slate-600">
                Add a fruit snack to balance vitamins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section id="services" className="mt-14 space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          What NutriBalance offers
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              For Users
            </h3>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li>• Personalized diet plan – breakfast, lunch, snacks, dinner</li>
              <li>• Water intake tracker & daily reminders</li>
              <li>• BMI calculator & weekly progress graph</li>
              <li>• Chat & video consultations with nutritionists</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              For Nutritionists
            </h3>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li>• Profile with qualification & experience</li>
              <li>• View assigned users & consultations</li>
              <li>• Create and update diet plans</li>
              <li>• Chat and conduct video sessions</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              For Admin (Manager)
            </h3>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li>• Monitor active users & subscriptions</li>
              <li>• Manage nutritionists and user accounts</li>
              <li>• Track complaints & system issues</li>
              <li>• Generate weekly/monthly reports</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI + Subscription + Contact */}
      <section className="mt-14 grid gap-10 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Video className="h-4 w-4 text-primary" />
            AI & Health Insights
          </h3>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
            <li>• AI-based food scanner from photos</li>
            <li>• Daily nutrition summary</li>
            <li>• Smart diet suggestions based on progress</li>
            <li>• Health progress analysis & BMI tracking</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Subscription Plans
          </h3>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
            <li>• Free: basic diet & BMI tools</li>
            <li>• Premium: chat + video consultations</li>
            <li>• Flexible monthly / yearly billing</li>
            <li>• Secure payment & data protection</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <MessageCircle className="h-4 w-4 text-primary" />
            Contact & About
          </h3>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <p>
              NutriBalance is designed to make healthy eating simple,
              personalized, and sustainable with the help of professionals.
            </p>
            <p>
              Email:{" "}
              <span className="font-medium text-slate-800">
                support@nutribalance.app
              </span>
            </p>
            <p>Phone: +91-98765-43210</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
