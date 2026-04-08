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
  getAssignedNutritionist,
  getTodayPoints,
  getWeeklyPointsSeries,
  loadDailyRoutine,
  loadPointsLedger,
  saveDailyRoutine,
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

const mealPlanStorageKey = "nbMealPlans";
const stepBucketStorageKey = "nbStepBuckets";
const stepGoal = 10000;

const dailyReminderCards = [
  {
    time: "5:30 AM",
    title: "Wake up and warm water",
    description: "Warm water with chia seeds, honey, and lemon.",
  },
  {
    time: "6:00 AM",
    title: "Exercise",
    description: "Morning walk, yoga, or workout photo proof.",
  },
  {
    time: "8:00 AM",
    title: "Breakfast",
    description: "Meal planned by the nutritionist and uploaded by photo.",
  },
  {
    time: "11:00 AM",
    title: "Fruit break",
    description: "Seasonal fruit, juice, or a light healthy snack.",
  },
  {
    time: "12:30 PM",
    title: "Lunch",
    description: "Balanced lunch designed by your nutritionist.",
  },
  {
    time: "3:30 PM",
    title: "Snack break",
    description: "Fresh juice or a small snack with a photo upload.",
  },
  {
    time: "5:30 PM",
    title: "Light exercise",
    description: "Stretching, walking, or simple movement session.",
  },
  {
    time: "8:00 PM",
    title: "Dinner",
    description: "Dinner planned by your nutritionist before night review.",
  },
];

const defaultMealPlans = {
  BREAKFAST: {
    label: "Breakfast",
    summary: "Oats with skimmed milk, 1 boiled egg, green tea.",
    items: [
      "Oats with skimmed milk",
      "1 boiled egg",
      "Green tea",
    ],
    calories: 310,
    protein: 18,
    carbs: 28,
    fats: 10,
    fibre: 4,
    note: "Light start with steady energy and protein to keep you full longer.",
  },
  LUNCH: {
    label: "Lunch",
    summary: "2 chapatis, dal, mixed veg sabji, salad, buttermilk.",
    items: [
      "2 chapatis",
      "Dal",
      "Mixed veg sabji",
      "Salad",
      "Buttermilk",
    ],
    calories: 520,
    protein: 20,
    carbs: 62,
    fats: 14,
    fibre: 10,
    note: "Balanced thali with carbs, protein, and fibre to support the rest of the day.",
  },
  SNACKS: {
    label: "Snacks",
    summary: "Seasonal fruit, handful of nuts, lemon water.",
    items: [
      "Seasonal fruit",
      "Handful of nuts",
      "Lemon water",
    ],
    calories: 180,
    protein: 4,
    carbs: 22,
    fats: 8,
    fibre: 5,
    note: "Small snack to reduce cravings and maintain hydration.",
  },
  DINNER: {
    label: "Dinner",
    summary: "Vegetable soup, grilled paneer / tofu, light salad.",
    items: [
      "Vegetable soup",
      "Grilled paneer / tofu",
      "Light salad",
    ],
    calories: 410,
    protein: 14,
    carbs: 32,
    fats: 18,
    fibre: 3,
    note: "A lighter dinner that is easier to digest before sleep.",
  },
};

function cloneMealPlans(source = defaultMealPlans) {
  return Object.fromEntries(
    Object.entries(source).map(([key, meal]) => [
      key,
      {
        ...meal,
        items: [...meal.items],
      },
    ]),
  );
}

function loadMealPlans() {
  try {
    const raw = localStorage.getItem(mealPlanStorageKey);
    if (!raw) {
      return cloneMealPlans();
    }

    const parsed = JSON.parse(raw);
    const base = cloneMealPlans();

    return Object.keys(base).reduce((acc, key) => {
      const storedMeal = parsed?.[key];
      if (storedMeal) {
        acc[key] = {
          ...base[key],
          ...storedMeal,
          items: Array.isArray(storedMeal.items)
            ? storedMeal.items.filter(Boolean)
            : base[key].items,
        };
      }
      return acc;
    }, base);
  } catch {
    return cloneMealPlans();
  }
}

const nutritionRules = [
  {
    matches: ["oats", "skimmed milk"],
    calories: 220,
    protein: 10,
    carbs: 33,
    fats: 5,
    fibre: 4,
  },
  {
    matches: ["boiled egg"],
    calories: 78,
    protein: 6,
    carbs: 1,
    fats: 5,
    fibre: 0,
  },
  {
    matches: ["green tea"],
    calories: 2,
    protein: 0,
    carbs: 0,
    fats: 0,
    fibre: 0,
  },
  {
    matches: ["chapati"],
    calories: 120,
    protein: 3,
    carbs: 20,
    fats: 3,
    fibre: 3,
  },
  {
    matches: ["roti"],
    calories: 120,
    protein: 3,
    carbs: 20,
    fats: 3,
    fibre: 3,
  },
  {
    matches: ["dal"],
    calories: 150,
    protein: 9,
    carbs: 20,
    fats: 4,
    fibre: 5,
  },
  {
    matches: ["mixed veg", "sabji"],
    calories: 130,
    protein: 4,
    carbs: 18,
    fats: 5,
    fibre: 5,
  },
  {
    matches: ["vegetable sabji"],
    calories: 130,
    protein: 4,
    carbs: 18,
    fats: 5,
    fibre: 5,
  },
  {
    matches: ["salad"],
    calories: 35,
    protein: 1,
    carbs: 7,
    fats: 0,
    fibre: 2,
  },
  {
    matches: ["buttermilk"],
    calories: 60,
    protein: 3,
    carbs: 7,
    fats: 2,
    fibre: 0,
  },
  {
    matches: ["seasonal fruit"],
    calories: 90,
    protein: 1,
    carbs: 22,
    fats: 0,
    fibre: 4,
  },
  {
    matches: ["nuts"],
    calories: 170,
    protein: 5,
    carbs: 7,
    fats: 15,
    fibre: 3,
  },
  {
    matches: ["lemon water"],
    calories: 10,
    protein: 0,
    carbs: 3,
    fats: 0,
    fibre: 0,
  },
  {
    matches: ["vegetable soup"],
    calories: 80,
    protein: 3,
    carbs: 12,
    fats: 2,
    fibre: 3,
  },
  {
    matches: ["paneer"],
    calories: 220,
    protein: 16,
    carbs: 6,
    fats: 14,
    fibre: 1,
  },
  {
    matches: ["tofu"],
    calories: 150,
    protein: 15,
    carbs: 4,
    fats: 8,
    fibre: 2,
  },
  {
    matches: ["light salad"],
    calories: 35,
    protein: 1,
    carbs: 7,
    fats: 0,
    fibre: 2,
  },
];

function normalizeFoodLabel(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFoodNutrition(item) {
  const normalizedItem = normalizeFoodLabel(item);

  const rule = nutritionRules.find((entry) =>
    entry.matches.every((match) => normalizedItem.includes(match)),
  );

  return (
    rule || {
      calories: 80,
      protein: 2,
      carbs: 10,
      fats: 2,
      fibre: 2,
    }
  );
}

function calculateMealNutrition(items) {
  return items.reduce(
    (totals, item) => {
      const nutrition = getFoodNutrition(item);
      return {
        calories: totals.calories + nutrition.calories,
        protein: totals.protein + nutrition.protein,
        carbs: totals.carbs + nutrition.carbs,
        fats: totals.fats + nutrition.fats,
        fibre: totals.fibre + nutrition.fibre,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0, fibre: 0 },
  );
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDayIndex() {
  return (new Date().getDay() + 6) % 7;
}

function loadStepBuckets() {
  try {
    const raw = localStorage.getItem(stepBucketStorageKey);
    if (!raw) {
      return [0, 0, 0, 0, 0, 0, 0];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 7) {
      return parsed.map((value) => Number(value) || 0);
    }
  } catch {
    // Ignore storage errors and fall back to a fresh tracker.
  }

  return [0, 0, 0, 0, 0, 0, 0];
}

function getRecentDateSeries(days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, index) => {
    const offset = days - 1 - index;
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString([], { weekday: "short" }),
    };
  });
}

function calculateCurrentStreak(entries) {
  const approvedDates = new Set(
    entries
      .filter((entry) => Number(entry.points || 0) > 0)
      .map((entry) => entry.date),
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (streak < 365) {
    const key = cursor.toISOString().slice(0, 10);
    if (!approvedDates.has(key)) {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

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

const macroOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom", labels: { boxWidth: 10 } },
  },
};

const stepChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: "rgba(255, 255, 255, 0.75)", font: { size: 10 } },
      grid: { display: false },
    },
    y: {
      ticks: { color: "rgba(255, 255, 255, 0.75)", font: { size: 10 } },
      grid: { color: "rgba(255, 255, 255, 0.08)" },
    },
  },
};

function normalizeUsername(value) {
  if (!value) {
    return "";
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return trimmedValue.includes("@")
    ? trimmedValue.split("@")[0]
    : trimmedValue;
}

function UserDashboard() {
  const [displayName, setDisplayName] = useState("User");
  const [selectedMealKey, setSelectedMealKey] = useState("BREAKFAST");
  const [mealPlans, setMealPlans] = useState(() => loadMealPlans());
  const [mealEditor, setMealEditor] = useState(() => {
    const initialMeal = loadMealPlans().BREAKFAST;
    return {
      itemsText: initialMeal.items.join(", "),
    };
  });
  const [nutritionist, setNutritionist] = useState({
    name: "Priya Sharma",
    employeeId: "NB1023",
    specialty: "Weight loss and pregnancy support",
  });
  const [dailyRoutine, setDailyRoutine] = useState(() => loadDailyRoutine());
  const [isMobileView, setIsMobileView] = useState(false);
  const [stepBuckets, setStepBuckets] = useState(() => loadStepBuckets());
  const [stepTrackingStatus, setStepTrackingStatus] = useState("idle");
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);
  const [stepMessage, setStepMessage] = useState(
    "Tap enable and keep the page open while you walk.",
  );
  const [gender, setGender] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [goal, setGoal] = useState("");
  // Reactive chart data – charts update when these change
  const [weeklyWater, setWeeklyWater] = useState([1.2, 1.5, 1.8, 2, 1.6, 2.2, 1.8]);
  const [weeklyProtein, setWeeklyProtein] = useState([52, 68, 58, 72, 65, 70, 56]);
  const [weeklyCalories, setWeeklyCalories] = useState([1380, 1620, 1550, 1720, 1480, 1650, 1420]);
  const [weightData, setWeightData] = useState([72, 71.8, 71.5, 71.2, 71, 70.8, 70.5]);
  const [waterToday, setWaterToday] = useState(1.8);
  const waterTarget = 2.5;
  const lastStepTimeRef = useRef(0);
  const motionBaselineRef = useRef(null);
  const motionSeenRef = useRef(false);
  const orientationBaselineRef = useRef(null);
  const simulationTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateMobileView = () => {
      setIsMobileView(mediaQuery.matches);
    };

    updateMobileView();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMobileView);
      return () => mediaQuery.removeEventListener("change", updateMobileView);
    }

    mediaQuery.addListener(updateMobileView);
    return () => mediaQuery.removeListener(updateMobileView);
  }, []);

  useEffect(() => {
    try {
      const name = normalizeUsername(
        localStorage.getItem("nbCurrentUserName") ||
        localStorage.getItem("nbUserName") ||
        "",
      );
      const storedGender = localStorage.getItem("nbGender") || "";
      const storedLifeStage = localStorage.getItem("nbLifeStage") || "";
      const storedGoal = localStorage.getItem("nbGoal") || "";
      const storedMealPlans = loadMealPlans();
      const assignedNutritionist = getAssignedNutritionist(name || "User");
      if (name) {
        setDisplayName(name);
        localStorage.setItem("nbCurrentUserName", name);
        localStorage.setItem("nbUserName", name);
      }
      setNutritionist(assignedNutritionist);
      setGender(storedGender);
      setLifeStage(storedLifeStage);
      setGoal(storedGoal);
      setMealPlans(storedMealPlans);
      setDailyRoutine(loadDailyRoutine());
    } catch {
      // ignore storage errors in demo
    }
  }, []);

  const formattedGender =
    gender === "FEMALE" ? "Female" : gender === "MALE" ? "Male" : "User";

  const formattedLifeStage = (() => {
    switch (lifeStage) {
      case "CHILD":
        return "Child";
      case "ADULT":
        return "Adult";
      case "OLD_AGE":
        return "Old age";
      case "PREGNANT":
        return "Pregnant woman";
      case "LACTATING":
        return "Lactating mother";
      case "GYM":
        return "Gym person";
      default:
        return "General";
    }
  })();

  const goalLabel = (() => {
    switch (goal) {
      case "WEIGHT_LOSS":
        return "Weight loss";
      case "WEIGHT_GAIN":
        return "Weight gain";
      case "MUSCLE_GAIN":
        return "Muscle gain";
      case "GENERAL_HEALTH":
        return "General health";
      default:
        return "General health";
    }
  })();

  const selectedMeal = mealPlans[selectedMealKey];
  const selectedMealNutrition = calculateMealNutrition(selectedMeal.items);
  const selectedMealMacroData = {
    labels: ["Protein", "Carbs", "Fats"],
    datasets: [
      {
        data: [
          selectedMealNutrition.protein,
          selectedMealNutrition.carbs,
          selectedMealNutrition.fats,
        ],
        backgroundColor: ["#0f9d58", "#22c55e", "#f97316"],
        borderWidth: 0,
      },
    ],
  };

  useEffect(() => {
    const selected = mealPlans[selectedMealKey];
    setMealEditor({
      itemsText: selected.items.join(", "),
    });
  }, [selectedMealKey, mealPlans]);

  useEffect(() => {
    saveDailyRoutine(dailyRoutine);
  }, [dailyRoutine]);

  useEffect(() => {
    localStorage.setItem(stepBucketStorageKey, JSON.stringify(stepBuckets));
  }, [stepBuckets]);

  const currentDayIndex = getDayIndex();
  const stepsToday = stepBuckets[currentDayIndex] || 0;
  const stepProgress = Math.min((stepsToday / stepGoal) * 100, 100);
  const stepCalories = Math.round(stepsToday * 0.04);
  const weeklyStepsData = useMemo(
    () => ({
      labels: weekLabels,
      datasets: [
        {
          label: "Steps",
          data: stepBuckets,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.12)",
          tension: 0.35,
          fill: true,
        },
      ],
    }),
    [stepBuckets],
  );

  const profileSubtitle = `${formattedGender} • ${formattedLifeStage} • ${goalLabel}`;

  // Demo values for nutrition breakdown
  const targetCalories =
    goal === "WEIGHT_GAIN" || goal === "MUSCLE_GAIN" ? 2400 : 1800;
  const consumedCalories = 1420;
  const remainingCalories = Math.max(targetCalories - consumedCalories, 0);
  const proteinConsumed = goal === "MUSCLE_GAIN" ? 72 : 56;
  const proteinTarget = goal === "MUSCLE_GAIN" ? 110 : 80;
  const proteinPercent = Math.min(
    Math.round((proteinConsumed / proteinTarget) * 100),
    100,
  );

  // Demo macro values
  const carbs = 180;
  const fats = 50;
  const fibre = 22;

  const macroData = {
    labels: ["Protein (g)", "Carbs (g)", "Fats (g)", "Fibre (g)"],
    datasets: [
      {
        data: [proteinConsumed, carbs, fats, fibre],
        backgroundColor: ["#0f9d58", "#22c55e", "#f97316", "#38bdf8"],
        borderWidth: 0,
      },
    ],
  };

  const weightChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Weight (kg)",
        data: weightData,
        borderColor: "#0f9d58",
        backgroundColor: "rgba(15, 157, 88, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const waterChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Water (L)",
        data: weeklyWater,
        backgroundColor: "rgba(56, 189, 248, 0.7)",
        borderColor: "#0ea5e9",
        borderWidth: 1,
      },
    ],
  };

  const proteinChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Protein (g)",
        data: weeklyProtein,
        backgroundColor: "rgba(15, 157, 88, 0.7)",
        borderColor: "#0f9d58",
        borderWidth: 1,
      },
    ],
  };

  const caloriesChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Calories",
        data: weeklyCalories,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const addWater = () => {
    const next = Math.min(waterToday + 0.25, waterTarget);
    setWaterToday(Number(next.toFixed(1)));
    setWeeklyWater((prev) => {
      const copy = [...prev];
      copy[6] = Number((copy[6] + 0.25).toFixed(1));
      return copy;
    });
  };

  const addStep = (note) => {
    const now = Date.now();

    if (now - lastStepTimeRef.current <= 180) {
      return;
    }

    lastStepTimeRef.current = now;
    setStepBuckets((prev) => {
      const next = [...prev];
      next[currentDayIndex] = (next[currentDayIndex] || 0) + 1;
      return next;
    });

    if (note) {
      setStepMessage(note);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const motionSupported = "DeviceMotionEvent" in window;
    const touchCapable =
      typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

    if (!motionSupported) {
      setStepTrackingStatus("unsupported");
      setStepMessage(
        "Motion-based step tracking is not available in this browser.",
      );
      return undefined;
    }

    if (
      stepTrackingStatus === "idle" &&
      isMobileView &&
      touchCapable &&
      typeof window.DeviceMotionEvent.requestPermission !== "function"
    ) {
      setStepTrackingStatus("enabled");
      setStepMessage(
        "Mobile motion tracking is active. Keep this app open while you walk.",
      );
      return undefined;
    }

    if (stepTrackingStatus === "idle" && isMobileView && !touchCapable) {
      setStepMessage(
        "This looks like a laptop preview. Real step counting works on a phone with motion sensors.",
      );
    }

    if (stepTrackingStatus === "idle" && !isMobileView) {
      setStepMessage(
        "Open NutriBalance on your phone to count real walking steps.",
      );
    }

    return undefined;
  }, [isMobileView, stepTrackingStatus]);

  const enableStepTracking = async () => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      setStepTrackingStatus("unsupported");
      setStepMessage("This phone or browser does not support motion-based step tracking.");
      return;
    }

    try {
      if (typeof window.DeviceMotionEvent.requestPermission === "function") {
        const permission = await window.DeviceMotionEvent.requestPermission();
        if (permission !== "granted") {
          setStepTrackingStatus("blocked");
          setStepMessage("Motion permission is blocked. Allow motion access on your phone to count steps.");
          return;
        }
      }

      setStepTrackingStatus("enabled");
      setStepMessage("Step tracking is active. Keep this page open while you walk.");
    } catch {
      setStepTrackingStatus("blocked");
      setStepMessage("Could not enable motion tracking. Please allow motion access and try again.");
    }
  };

  useEffect(() => {
    if (stepTrackingStatus !== "enabled" || isSimulatingWalk) {
      return undefined;
    }

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      const rotation = event.rotationRate;
      const hasAccel = Boolean(acc);
      const hasRotation = Boolean(rotation);

      if (!hasAccel && !hasRotation) {
        return;
      }

      if (!motionSeenRef.current) {
        motionSeenRef.current = true;
        setStepMessage(
          "Motion sensor active. Walk normally for a few seconds to begin counting steps.",
        );
      }

      if (hasAccel) {
        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const previousBaseline =
          motionBaselineRef.current === null
            ? magnitude
            : motionBaselineRef.current;
        const nextBaseline = previousBaseline * 0.92 + magnitude * 0.08;
        const delta = Math.abs(magnitude - previousBaseline);

        motionBaselineRef.current = nextBaseline;

        if (delta > 0.35 && magnitude > 7.5) {
          addStep("Walking detected. Step count is increasing from phone movement.");
          return;
        }
      }

      if (hasRotation) {
        const alpha = rotation.alpha || 0;
        const beta = rotation.beta || 0;
        const gamma = rotation.gamma || 0;
        const rotationMagnitude = Math.abs(alpha) + Math.abs(beta) + Math.abs(gamma);
        const previousOrientation =
          orientationBaselineRef.current === null
            ? rotationMagnitude
            : orientationBaselineRef.current;
        const nextOrientation = previousOrientation * 0.92 + rotationMagnitude * 0.08;
        const rotationDelta = Math.abs(rotationMagnitude - previousOrientation);

        orientationBaselineRef.current = nextOrientation;

        if (rotationDelta > 8) {
          addStep("Walking detected from movement changes. Step count updated.");
        }
      }
    };

    motionBaselineRef.current = null;
    motionSeenRef.current = false;
    orientationBaselineRef.current = null;
    window.addEventListener("devicemotion", handleMotion);
    window.addEventListener("deviceorientation", handleMotion);
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleMotion);
    };
  }, [stepTrackingStatus, currentDayIndex, isSimulatingWalk]);

  useEffect(() => {
    if (!isSimulatingWalk) {
      if (simulationTimerRef.current) {
        window.clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
      setStepTrackingStatus((current) =>
        current === "simulating" ? "idle" : current,
      );
      return undefined;
    }

    setStepTrackingStatus((current) => (current === "enabled" ? current : "simulating"));
    setStepMessage("Simulated walk running. Stop it anytime or use a real phone to count motion.");
    simulationTimerRef.current = window.setInterval(() => {
      addStep("Simulated walk added one step for laptop testing.");
    }, 1200);

    return () => {
      if (simulationTimerRef.current) {
        window.clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
    };
  }, [isSimulatingWalk, currentDayIndex]);

  const toggleWalkSimulation = () => {
    setIsSimulatingWalk((current) => !current);
  };

  const updateRoutineItem = (itemId, updater) => {
    setDailyRoutine((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...updater(item),
            }
          : item,
      ),
    );
  };

  const handleRoutinePhotoUpload = (itemId, file) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateRoutineItem(itemId, () => ({
        photoUrl: reader.result,
        completed: true,
        submittedAt: "",
        verified: false,
      }));
    };
    reader.readAsDataURL(file);
  };

  const markRoutineCompleted = (itemId) => {
    updateRoutineItem(itemId, () => ({
      completed: true,
    }));
  };

  const submitRoutineForReview = (itemId) => {
    updateRoutineItem(itemId, (item) => ({
      submittedAt: new Date().toISOString(),
      verified: item.verified,
    }));
  };

  const saveMealPlan = () => {
    const items = mealEditor.itemsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const nextMeal = {
      ...mealPlans[selectedMealKey],
      items,
      summary: items.length
        ? items.join(", ")
        : mealPlans[selectedMealKey].summary,
    };

    const nextMeals = {
      ...mealPlans,
      [selectedMealKey]: nextMeal,
    };

    setMealPlans(nextMeals);
    localStorage.setItem(mealPlanStorageKey, JSON.stringify(nextMeals));
  };

  const resetMealPlan = () => {
    const nextMeals = Object.fromEntries(
      Object.entries(defaultMealPlans).map(([key, meal]) => [
        key,
        {
          ...meal,
          items: [],
          summary: "",
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          fibre: 0,
          note: "",
        },
      ]),
    );
    setMealPlans(nextMeals);
    setSelectedMealKey("BREAKFAST");
    setMealEditor({
      itemsText: "",
    });
    localStorage.setItem(mealPlanStorageKey, JSON.stringify(nextMeals));
  };

  const routinePoints = getTodayPoints(dailyRoutine);
  const pointsLedger = loadPointsLedger();
  const currentStreak = calculateCurrentStreak(pointsLedger);
  const recentDateSeries = getRecentDateSeries(7);
  const routineConsistencyData = {
    labels: recentDateSeries.map((entry) => entry.label),
    datasets: [
      {
        label: "Approved uploads",
        data: recentDateSeries.map(
          (entry) =>
            pointsLedger.filter((ledgerEntry) => ledgerEntry.date === entry.key)
              .length,
        ),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };
  const weeklyPointsData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Points",
        data: getWeeklyPointsSeries(),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.12)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
  const exerciseRoutineItems = dailyRoutine.filter((item) =>
    ["exercise-1", "exercise-2"].includes(item.id),
  );
  const completedRoutineCount = dailyRoutine.filter((item) => item.verified).length;
  const pendingRoutineItem = dailyRoutine.find(
    (item) => item.requiresPhoto && !item.verified,
  );
  const waterProgress = Math.min((waterToday / waterTarget) * 100, 100);
  const wellnessScore = Math.min(
    Math.round(
      routinePoints * 1.1 +
        stepProgress * 0.25 +
        waterProgress * 0.15 +
        currentStreak * 3 +
        completedRoutineCount * 2,
    ),
    100,
  );
  const nextBestAction = pendingRoutineItem
    ? `Upload your ${pendingRoutineItem.title.toLowerCase()} photo to unlock ${pendingRoutineItem.points} pts.`
    : stepsToday < 3000
    ? "Take a short walk to push your step count higher today."
    : waterToday < waterTarget
    ? `Drink ${Math.max(Number((waterTarget - waterToday).toFixed(1)), 0)} L more water today.`
    : selectedMeal.items.length === 0
    ? "Save a meal for the selected time slot so nutrition can be estimated."
    : "Send a quick note to your nutritionist or review your latest progress.";
  const recentActivity = [...pointsLedger].reverse().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 md:pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            User Dashboard
          </p>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs text-slate-500">
            {formattedGender} • {formattedLifeStage} • Goal: {goalLabel}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200" />
          <div className="text-xs">
            <p className="font-semibold text-slate-800">{displayName}</p>
            <p className="text-slate-500">Assigned nutritionist: {nutritionist.name}</p>
            <p className="text-[11px] text-slate-500">{nutritionist.employeeId} • {nutritionist.specialty}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.15fr,0.95fr,1fr]">
        <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Daily wellness score
          </p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-4xl font-semibold tracking-tight text-slate-900">
                {wellnessScore}
              </p>
              <p className="mt-1 text-xs text-emerald-800/80">
                Based on routine check-ins, steps, water, and approvals.
              </p>
            </div>
            <div className="rounded-2xl bg-white px-3 py-2 text-right text-xs shadow-sm">
              <p className="text-slate-500">Completed</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {completedRoutineCount}/{dailyRoutine.length}
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${wellnessScore}%` }}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Next best action
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            What should you do now?
          </p>
          <p className="mt-2 text-sm text-slate-600">{nextBestAction}</p>
          <Link
            to="/dashboard/user/deep-dive/routine"
            className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Open routine deep view
          </Link>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Recent activity
          </p>
          <div className="mt-3 space-y-2">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-400">
                Verified uploads and point awards will appear here.
              </p>
            ) : (
              recentActivity.map((entry) => (
                <div
                  key={`${entry.date}-${entry.itemId || entry.label}`}
                  className="rounded-2xl bg-slate-50 px-3 py-2 text-xs"
                >
                  <p className="font-medium text-slate-800">{entry.label || entry.source}</p>
                  <p className="text-[11px] text-slate-500">
                    {entry.points} pts • {entry.date}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
            Your assigned nutritionist: {nutritionist.name}
          </div>
        </section>
      </div>

      <div className="grid gap-5 md:grid-cols-[2fr,1.5fr]">
        {/* Diet plan */}
        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Today&apos;s Diet Plan
            </h2>
            <p className="text-[11px] text-slate-500">
              Designed by Nutritionist Priya Sharma
            </p>
          </div>
          <div className="grid gap-3 text-xs sm:grid-cols-2">
            {Object.entries(mealPlans).map(([key, meal]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedMealKey(key)}
                className={`rounded-2xl p-3 text-left transition-all ${
                  selectedMealKey === key
                    ? "border-2 border-primary bg-emerald-50 shadow-sm"
                    : "border border-slate-100 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <p className="text-[11px] font-semibold text-slate-700">
                  {meal.label}
                </p>
                <p className="mt-1 text-slate-600">
                  {meal.items.join(", ")}
                </p>
              </button>
            ))}
          </div>

          <div className="grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Selected meal
              </p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">
                {selectedMeal.label}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Nutrition is estimated from the foods you add below.
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[11px] text-slate-500">Calories</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedMealNutrition.calories} kcal
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[11px] text-slate-500">Protein</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedMealNutrition.protein} g
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[11px] text-slate-500">Carbs</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedMealNutrition.carbs} g
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[11px] text-slate-500">Fats / Fibre</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedMealNutrition.fats} g / {selectedMealNutrition.fibre} g
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Macro diagram
              </p>
              <div className="mt-3 h-44">
                <Doughnut data={selectedMealMacroData} options={macroOptions} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold text-slate-500">
              What you ate
            </p>
            <ul className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {selectedMeal.items.map((item) => (
                <li key={item} className="rounded-xl bg-white px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Edit this meal</p>
                <p className="text-[11px] text-slate-500">
                  Add only the foods you ate. The app will estimate nutrition.
                </p>
              </div>
              <button
                type="button"
                onClick={resetMealPlan}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset all meals
              </button>
            </div>

            <div className="mt-4 grid gap-3 text-xs md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Meal items
                </label>
                <textarea
                  value={mealEditor.itemsText}
                  onChange={(e) =>
                    setMealEditor((prev) => ({
                      ...prev,
                      itemsText: e.target.value,
                    }))
                  }
                  className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                  placeholder="Separate items with commas"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={saveMealPlan}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Save meal
              </button>
            </div>
          </div>
        </section>

        {/* Nutrition breakdown */}
        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Nutrition Breakdown (Today)
          </h2>
          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Calories</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {consumedCalories} / {targetCalories} kcal
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Remaining:{" "}
                <span className="font-semibold">
                  {remainingCalories} kcal
                </span>
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Protein</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {proteinConsumed} g / {proteinTarget} g
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {proteinPercent}% of daily protein goal reached.
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Carbohydrates</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {carbs} g (approx.)
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                From roti, rice, fruits and vegetables.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Fats & Fibre</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {fats} g fats • {fibre} g fibre
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Healthy fats (nuts, oil) and fibre (salads, fruits).
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-xs sm:grid-cols-[1.3fr,1.7fr] items-center">
            <div className="rounded-2xl bg-slate-50 p-3 text-xs">
              <p className="text-[11px] text-slate-500">Water intake (reactive)</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {waterToday} L / {waterTarget} L
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-sky-400 transition-all"
                  style={{ width: `${Math.min((waterToday / waterTarget) * 100, 100)}%` }}
                />
              </div>
              <button
                type="button"
                onClick={addWater}
                className="mt-2 rounded-full bg-sky-100 px-2 py-1 text-[10px] font-medium text-sky-700 hover:bg-sky-200"
              >
                + Add 1 glass (0.25 L)
              </button>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500 mb-1">
                Macro distribution
              </p>
              <div className="h-32">
                <Doughnut data={macroData} options={macroOptions} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Reactive charts row */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Weekly weight (reactive)
          </h2>
          <div className="h-48">
            <Line data={weightChartData} options={chartOptions} />
          </div>
        </section>
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Weekly calories (reactive)
          </h2>
          <div className="h-48">
            <Line data={caloriesChartData} options={chartOptions} />
          </div>
        </section>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Weekly water intake – L (reactive)
          </h2>
          <div className="h-48">
            <Bar data={waterChartData} options={chartOptions} />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Click &quot;+ Add 1 glass&quot; above to see today&apos;s bar increase.
          </p>
        </section>
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Weekly protein intake – g (reactive)
          </h2>
          <div className="h-48">
            <Bar data={proteinChartData} options={chartOptions} />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1.55fr,1fr]">
        <section className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Daily Photo Check-In
              </h2>
              <p className="text-[11px] text-slate-500">
                Upload proof for meals, exercise, and water rituals. Your nutritionist reviews it at night.
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              Today&apos;s points: <span className="font-semibold">{routinePoints}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Exercise photo upload
                </p>
                <p className="text-xs text-emerald-800/80">
                  Upload morning and evening exercise proof so the nutritionist can verify your consistency.
                </p>
              </div>
              <div className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                Current streak: {currentStreak} day{currentStreak === 1 ? "" : "s"}
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {exerciseRoutineItems.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-3 text-xs shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {item.time}
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">{item.title}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                        item.verified
                          ? "bg-emerald-100 text-emerald-700"
                          : item.submittedAt
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.verified
                        ? "Verified"
                        : item.submittedAt
                        ? "Submitted"
                        : "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {item.description}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3 block w-full text-[11px] text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-[11px] file:font-medium file:text-emerald-700"
                    onChange={(e) =>
                      handleRoutinePhotoUpload(item.id, e.target.files?.[0] || null)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            {dailyRoutine.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {item.time}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                      item.verified
                        ? "bg-emerald-100 text-emerald-700"
                        : item.submittedAt
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.verified
                      ? "Verified"
                      : item.submittedAt
                      ? "Submitted"
                      : "Pending"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="rounded-full bg-white px-2 py-1">
                    {item.points} pts
                  </span>
                  <span className="rounded-full bg-white px-2 py-1">
                    Photo required: {item.requiresPhoto ? "Yes" : "No"}
                  </span>
                </div>

                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="mt-3 h-28 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="mt-3 flex h-28 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-[11px] text-slate-400">
                    Photo preview will appear here
                  </div>
                )}

                <div className="mt-3 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-[11px] text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary"
                    onChange={(e) =>
                      handleRoutinePhotoUpload(item.id, e.target.files?.[0] || null)
                    }
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => markRoutineCompleted(item.id)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Mark done
                    </button>
                    <button
                      type="button"
                      onClick={() => submitRoutineForReview(item.id)}
                      className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary/90"
                    >
                      Send to nutritionist
                    </button>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl bg-white px-3 py-2 text-[11px] text-slate-500">
                  {item.verified
                    ? `Verified at ${new Date(item.verifiedAt || item.submittedAt || "").toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : item.submittedAt
                    ? "Waiting for nutritionist approval tonight"
                    : "Upload a photo and submit for review"}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Weekly points
            </h2>
            <p className="text-[11px] text-slate-500">
              Points go up when your nutritionist verifies your daily uploads.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3 text-xs">
              <p className="text-[11px] text-slate-500">Current streak</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {currentStreak} day{currentStreak === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Streak grows when approved uploads continue day after day.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-xs">
              <p className="text-[11px] text-slate-500">Approved uploads today</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {pointsLedger.filter(
                  (entry) => entry.date === getTodayKey(),
                ).length}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Nutritionist verified check-ins from your routine.
              </p>
            </div>
          </div>
          <div className="h-64">
            <Line data={weeklyPointsData} options={chartOptions} />
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Weekly consistency
                </p>
                <p className="text-[11px] text-slate-500">
                  Approved uploads per day across the last 7 days.
                </p>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                Streak graph
              </span>
            </div>
            <div className="mt-3 h-40">
              <Bar data={routineConsistencyData} options={chartOptions} />
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-medium text-slate-800">Assigned nutritionist</p>
            <p>{nutritionist.name}</p>
            <p>{nutritionist.employeeId}</p>
            <p>{nutritionist.specialty}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
            Reminder: upload meal photos, exercise proof, and water logs by the evening so the nutritionist can approve them at night.
          </div>
        </section>
      </div>

      {/* Progress + actions */}
      <div className="mt-6 grid gap-5 md:grid-cols-[2fr,1.5fr]">

        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm text-xs">
          <h2 className="text-sm font-semibold text-slate-900">
            Meal Suggestions (Based on goal)
          </h2>
          <p className="text-[11px] text-slate-500">
            Goal selected during registration:{" "}
            <span className="font-semibold">{goalLabel}</span>
          </p>
          <div className="rounded-2xl bg-slate-50 p-3 space-y-1.5">
            {goal === "WEIGHT_LOSS" && (
              <>
                <p>
                  • Focus on high-protein, low-calorie meals like sprouts,
                  lentil soup, grilled paneer/tofu, salads.
                </p>
                <p>
                  • Avoid deep-fried foods and sugary drinks. Prefer steamed or
                  grilled options.
                </p>
              </>
            )}
            {goal === "WEIGHT_GAIN" && (
              <>
                <p>
                  • Include calorie-dense meals: nuts, seeds, peanut butter,
                  paneer, ghee in moderation.
                </p>
                <p>
                  • Add an extra roti/rice portion and bedtime milk with dry
                  fruits.
                </p>
              </>
            )}
            {goal === "MUSCLE_GAIN" && (
              <>
                <p>
                  • Prioritise protein-rich foods: eggs, paneer, chicken, dal,
                  sprouts, milk, curd.
                </p>
                <p>
                  • Combine with complex carbs (brown rice, millet, oats) around
                  workout time.
                </p>
              </>
            )}
            {goal === "GENERAL_HEALTH" && (
              <>
                <p>
                  • Maintain a balanced thali: half plate vegetables + salad,
                  one-quarter protein, one-quarter whole grains.
                </p>
                <p>• Limit packaged snacks; choose fruits and nuts instead.</p>
              </>
            )}
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            Reminder System (Daily cards)
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {dailyReminderCards.map((item) => (
              <div
                key={item.time}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.time}
                </p>
                <h4 className="mt-1 text-sm font-semibold text-slate-900">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-600">
                  {item.description}
                </p>
                <div className="mt-2 inline-flex rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                  Photo upload reminder
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Health tips, step counter and quick modules */}
      <div className="mt-6 grid gap-5 md:grid-cols-3 text-xs">
        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Today&apos;s Health Tips
          </h2>
          <ul className="space-y-1.5 text-slate-700">
            <li>
              • <span className="font-semibold">Nutrition tip:</span> Fill half
              your plate with colourful vegetables to improve fibre and vitamin
              intake.
            </li>
            <li>
              • <span className="font-semibold">Fitness tip:</span> Aim for at
              least 30 minutes of brisk walking or light exercise today.
            </li>
            <li>
              • <span className="font-semibold">Motivation:</span> Small
              consistent habits every day create big long-term changes.
            </li>
          </ul>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Live Step Tracker
              </h2>
              <p className="text-[11px] text-white/70">
                {isMobileView
                  ? "Phone view detected. Step counting works when motion sensors are available."
                  : "Open the app on your phone to count real walking steps."}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 sm:flex-row">
              {stepTrackingStatus === "enabled" && !isSimulatingWalk ? (
                <div className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-[11px] font-medium text-emerald-300">
                  Tracking on
                </div>
              ) : (
                <button
                  type="button"
                  onClick={enableStepTracking}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-white/15"
                >
                  Enable motion
                </button>
              )}
              <button
                type="button"
                onClick={toggleWalkSimulation}
                className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-[11px] font-medium text-emerald-300 hover:bg-emerald-400/25"
              >
                {isSimulatingWalk ? "Stop simulate" : "Simulate walk"}
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                  Steps today
                </p>
                <p className="mt-1 text-4xl font-semibold tracking-tight text-white">
                  {stepsToday.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-white/70">
                  Goal: {stepGoal.toLocaleString()} steps
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-right text-xs">
                <p className="text-white/60">Calories burned</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {stepCalories}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-white/70">
                {Math.round(stepProgress)}% of your daily step goal reached.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                Weekly steps
              </p>
              <p className="text-[11px] text-white/60">
                Motion-based estimate
              </p>
            </div>
            <div className="mt-3 h-40">
              <Line data={weeklyStepsData} options={stepChartOptions} />
            </div>
          </div>

          <p className="mt-3 text-[11px] text-white/70">{stepMessage}</p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Quick Modules
          </h2>
          <p className="text-[11px] text-slate-600">
            Open each module to see its dedicated screen.
          </p>
          <div className="space-y-2">
            <Link
              to="/dashboard/user/chat"
              className="block rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100"
            >
              Open Chat
            </Link>
            <Link
              to="/dashboard/user/deep-dive/chat"
              className="block rounded-full border border-slate-200 bg-white px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50"
            >
              Chat Deep View
            </Link>
            <Link
              to="/dashboard/user/ai-scanner"
              className="block rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100"
            >
              Open AI Food Scanner
            </Link>
            <Link
              to="/dashboard/user/deep-dive/scanner"
              className="block rounded-full border border-slate-200 bg-white px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50"
            >
              Scanner Deep View
            </Link>
            <Link
              to="/dashboard/user/video-consultation"
              className="block rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100"
            >
              Open Video Consultation
            </Link>
            <Link
              to="/dashboard/user/deep-dive/consultation"
              className="block rounded-full border border-slate-200 bg-white px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50"
            >
              Consultation Deep View
            </Link>
            <Link
              to="/dashboard/user/deep-dive/routine"
              className="block rounded-full border border-slate-200 bg-white px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50"
            >
              Routine Deep View
            </Link>
            <Link
              to="/dashboard/user/deep-dive/points"
              className="block rounded-full border border-slate-200 bg-white px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50"
            >
              Points Deep View
            </Link>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-50 rounded-full border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1 text-[10px] font-medium text-slate-600">
          <Link
            to="/dashboard/user"
            className="rounded-full px-2 py-2 text-center hover:bg-slate-100 hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            to="/dashboard/user/chat"
            className="rounded-full px-2 py-2 text-center hover:bg-slate-100 hover:text-slate-900"
          >
            Chat
          </Link>
          <Link
            to="/dashboard/user/ai-scanner"
            className="rounded-full px-2 py-2 text-center hover:bg-slate-100 hover:text-slate-900"
          >
            Scan
          </Link>
          <Link
            to="/dashboard/user/video-consultation"
            className="rounded-full px-2 py-2 text-center hover:bg-slate-100 hover:text-slate-900"
          >
            Consult
          </Link>
          <Link
            to="/dashboard/user/deep-dive/points"
            className="rounded-full px-2 py-2 text-center hover:bg-slate-100 hover:text-slate-900"
          >
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default UserDashboard;
