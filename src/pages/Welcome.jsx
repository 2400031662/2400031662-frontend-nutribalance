import { Link } from "react-router-dom";
import { HeartPulse, ArrowRight, Sparkles, LogIn } from "lucide-react";

function Welcome() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 inline-flex items-center justify-center rounded-3xl bg-primary/10 p-4 text-primary">
          <HeartPulse className="h-16 w-16" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Welcome to <span className="text-primary">NutriBalance</span>
        </h1>
        <p className="mt-3 text-lg text-slate-600 sm:text-xl">
          Your digital partner for diet, health and nutrition. Connect with
          nutritionists, track your meals with AI, and build a healthier
          lifestyle.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-primary/90"
          >
            Enter and Go to Home
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-6 py-3 text-base font-semibold text-primary transition hover:bg-primary/5"
          >
            <Sparkles className="h-5 w-5" />
            Register
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <LogIn className="h-5 w-5" />
            Login
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Click <strong>Enter and Go to Home</strong> to explore services, or
          open <strong>Register</strong> or <strong>Login</strong> to get started.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
