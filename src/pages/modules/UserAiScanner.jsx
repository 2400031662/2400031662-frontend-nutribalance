import { useEffect, useState } from "react";
import { estimateFoodScan, WELLNESS_KEYS } from "../../lib/wellness.js";

function UserAiScanner() {
  const [fileName, setFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [hint, setHint] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WELLNESS_KEYS.foodScans);
      setHistory(raw ? JSON.parse(raw) : []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WELLNESS_KEYS.foodScans, JSON.stringify(history));
  }, [history]);

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
    const result = estimateFoodScan(fileName, hint);
    setScanResult(result);
    setHistory((prev) => [
      {
        id: `${Date.now()}`,
        label: result.label,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fats: result.fats,
        fibre: result.fibre,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev.slice(0, 4),
    ]);
  };

  const activeResult = scanResult || {
    label: "No scan yet",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fibre: 0,
    vitamins: { vitaminA: 0, vitaminC: 0, vitaminB12: 0 },
    minerals: { iron: 0, calcium: 0, potassium: 0, magnesium: 0 },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            AI Food Scanner
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload a meal plate photo and get an estimated nutrition breakdown including macros, vitamins, and minerals.
          </p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">Photo-based estimate</p>
          <p className="text-[11px] text-slate-500">
            Demo AI estimates are based on the closest matching meal profile.
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
                Optional hint
              </label>
              <input
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
                placeholder="Example: idli sambar, oats, rice dal..."
              />

              <button
                type="button"
                onClick={scanPhoto}
                className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Scan Food
              </button>

              <div className="mt-4 rounded-2xl bg-white p-3 text-xs text-slate-500">
                <p className="font-semibold text-slate-800">Scan tip</p>
                <p className="mt-1">
                  If the photo does not clearly show the dish, add a small hint so the estimate becomes closer to your plate.
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

          <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
            Estimated values are a demo approximation. Your nutritionist can refine them after reviewing the upload.
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
                <p className="mt-1 text-slate-500">{item.time}</p>
                <p className="mt-1 text-slate-700">
                  {item.calories} kcal • {item.protein} g protein • {item.carbs} g carbs
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default UserAiScanner;
