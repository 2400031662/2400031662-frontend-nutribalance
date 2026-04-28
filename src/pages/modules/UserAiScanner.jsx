import { useEffect, useMemo, useState } from "react";
import {
  estimateFoodScan,
  generatePlateSupportGuide,
  loadFoodScans,
  saveFoodScans,
} from "../../lib/wellness.js";

const promptPresets = [
  "idli sambar",
  "poha plate",
  "oats bowl",
  "rice curry plate",
];

function getCurrentUserName() {
  return (
    localStorage.getItem("nbCurrentUserName") ||
    localStorage.getItem("nbUserName") ||
    "User"
  );
}

function UserAiScanner() {
  const [displayName, setDisplayName] = useState("User");
  const [fileName, setFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [hint, setHint] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setDisplayName(getCurrentUserName());
    try {
      setHistory(loadFoodScans());
    } catch {
      setHistory([]);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      saveFoodScans(history);
    }
  }, [history, isReady]);

  const handlePhoto = (file) => {
    if (!file) {
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const scanPhoto = () => {
    const now = new Date();
    const result = estimateFoodScan(fileName, hint);
    const guide = generatePlateSupportGuide(fileName, hint, result);
    const suggestedPoints = result.matched ? 12 : 6;

    const record = {
      id: `${Date.now()}`,
      userName: displayName,
      fileName,
      hint,
      photoUrl: photoPreview,
      label: result.label,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fats: result.fats,
      fibre: result.fibre,
      matched: result.matched,
      guideTitle: guide.title,
      guideSummary: guide.summary,
      guideSteps: guide.steps || [],
      status: "Pending review",
      suggestedPoints,
      pointsAwarded: 0,
      reviewedBy: "",
      reviewedAt: "",
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: now.toISOString().slice(0, 10),
    };

    setScanResult(result);
    setHistory((prev) => [record, ...prev]);
  };

  const activeResult = scanResult || {
    label: "No scan yet",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fibre: 0,
    matched: false,
    vitamins: { vitaminA: 0, vitaminC: 0, vitaminB12: 0 },
    minerals: { iron: 0, calcium: 0, potassium: 0, magnesium: 0 },
  };

  const supportGuide = useMemo(
    () => generatePlateSupportGuide(fileName, hint, scanResult),
    [fileName, hint, scanResult],
  );

  const guideConfidenceLabel =
    supportGuide.confidence === "high"
      ? "High confidence"
      : supportGuide.confidence === "medium"
      ? "Medium confidence"
      : "Fallback guide";

  const hasInput = Boolean(fileName || hint.trim());
  const myScans = history.filter(
    (item) => !item.userName || item.userName === displayName,
  );
  const totalAwardedPoints = myScans.reduce(
    (sum, item) => sum + Number(item.pointsAwarded || 0),
    0,
  );
  const approvedCount = myScans.filter(
    (item) => Number(item.pointsAwarded || 0) > 0,
  ).length;
  const pendingCount = myScans.filter(
    (item) => !item.pointsAwarded && (item.status || "").toLowerCase().includes("pending"),
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            AI Food Scanner
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload a meal plate photo to get a nutrition estimate, then let the
            AI plate supporter show how to prepare the same dish step by step
            and let the nutritionist award points after review.
          </p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">
            Logged in as {displayName}
          </p>
          <p className="text-[11px] text-slate-500">
            Demo scans stay saved locally for the nutritionist review flow.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr,1fr]">
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <label className="text-[11px] font-medium text-slate-700">
                Upload meal photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary"
                onChange={(e) => handlePhoto(e.target.files?.[0] || null)}
              />

              <label className="mt-4 block text-[11px] font-medium text-slate-700">
                Dish name or ingredient hint
              </label>
              <input
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
                placeholder="Example: idli sambar, poha, rice dal..."
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {promptPresets.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setHint(item)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={scanPhoto}
                className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Scan and build guide
              </button>

              <div className="mt-4 rounded-2xl bg-white p-3 text-xs text-slate-500">
                <p className="font-semibold text-slate-800">Scan tip</p>
                <p className="mt-1">
                  If the photo does not clearly show the dish, type the dish
                  name or ingredients so the AI can generate a better step by
                  step preparation guide.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Photo preview
              </p>
              <div className="mt-3 flex h-72 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Meal preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="px-6 text-center text-sm text-slate-400">
                    Upload a meal photo to preview it here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              AI nutrition estimate
            </h2>
            <p className="text-[11px] text-slate-500">
              Nutrients are estimated from the uploaded photo profile.
            </p>
          </div>

          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Meal</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {activeResult.label}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Calories</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {activeResult.calories} kcal
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Protein</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {activeResult.protein} g
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Carbs / Fats</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {activeResult.carbs} g / {activeResult.fats} g
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Fibre</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {activeResult.fibre} g
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-800">
            {activeResult.matched
              ? "A known food profile matched this plate."
              : "No exact food profile matched, so the AI plate supporter generated a safe fallback guide."}
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs">
            <p className="font-semibold text-slate-800">Vitamins & minerals</p>
            <p className="mt-1 text-slate-600">
              Vitamin A: {activeResult.vitamins?.vitaminA || 0} mcg
            </p>
            <p className="text-slate-600">
              Vitamin C: {activeResult.vitamins?.vitaminC || 0} mg
            </p>
            <p className="text-slate-600">
              Vitamin B12: {activeResult.vitamins?.vitaminB12 || 0} mcg
            </p>
            <p className="mt-2 text-slate-600">
              Iron: {activeResult.minerals?.iron || 0} mg
            </p>
            <p className="text-slate-600">
              Calcium: {activeResult.minerals?.calcium || 0} mg
            </p>
            <p className="text-slate-600">
              Potassium: {activeResult.minerals?.potassium || 0} mg
            </p>
            <p className="text-slate-600">
              Magnesium: {activeResult.minerals?.magnesium || 0} mg
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  {supportGuide.headline}
                </p>
                <p className="mt-1 text-[11px] text-emerald-800/80">
                  {guideConfidenceLabel}{" "}
                  {supportGuide.source === "ai-fallback"
                    ? "via AI fallback"
                    : "via recipe match"}
                </p>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-emerald-700">
                {supportGuide.prepTime}
              </span>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              {supportGuide.title}
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              {supportGuide.summary}
            </p>

            <div className="mt-3 grid gap-2 text-[11px] text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 p-3">
                <p className="font-semibold text-slate-800">Ingredients</p>
                <ul className="mt-2 space-y-1">
                  {supportGuide.ingredients?.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white/80 p-3">
                <p className="font-semibold text-slate-800">Quick facts</p>
                <p className="mt-2">Servings: {supportGuide.servings}</p>
                <p>Confidence: {guideConfidenceLabel}</p>
                <p className="mt-2">
                  Add a clear dish name for a more accurate recipe.
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {supportGuide.steps?.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-3 rounded-2xl bg-white px-3 py-2 text-[11px] text-slate-700"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700">
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl bg-white/80 p-3 text-[11px] text-slate-600">
              <p className="font-semibold text-slate-800">AI cooking tips</p>
              <ul className="mt-2 space-y-1">
                {supportGuide.tips?.map((tip) => (
                  <li key={tip}>- {tip}</li>
                ))}
              </ul>
            </div>

            {!hasInput ? (
              <div className="mt-3 rounded-2xl bg-white/80 p-3 text-[11px] text-slate-600">
                Type a dish name above to get a full step-by-step cooking guide.
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3 text-xs">
              <p className="text-[11px] text-slate-500">Approved meal points</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {totalAwardedPoints}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {approvedCount} approved scan{approvedCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
              <p className="font-semibold">Pending review</p>
              <p className="mt-1">
                {pendingCount} scan{pendingCount === 1 ? "" : "s"} are waiting
                for the nutritionist to award points.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
            Estimated values are a demo approximation. Your nutritionist can
            refine them after reviewing the upload.
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Recent scans</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {history.length === 0 ? (
            <p className="text-sm text-slate-400">No scans saved yet.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-3 text-xs">
                <p className="font-semibold text-slate-800">{item.label}</p>
                <p className="mt-1 text-slate-500">
                  {item.time} {item.userName ? `• ${item.userName}` : ""}
                </p>
                <p className="mt-1 text-slate-700">
                  {item.calories} kcal - {item.protein} g protein -{" "}
                  {item.carbs} g carbs
                </p>
                <p className="mt-2 text-[11px] text-slate-500">
                  {item.guideTitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                      item.pointsAwarded > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.pointsAwarded > 0
                      ? `${item.pointsAwarded} pts awarded`
                      : "Pending points"}
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                    {item.status || "Pending review"}
                  </span>
                </div>
                {Number(item.pointsAwarded || 0) > 0 ? (
                  <p className="mt-2 text-[11px] text-emerald-700">
                    Awarded by {item.reviewedBy || "nutritionist"} at{" "}
                    {item.reviewedAt
                      ? new Date(item.reviewedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "recently"}
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Waiting for the nutritionist to award points.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default UserAiScanner;
