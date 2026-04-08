const nutritionistRoster = [
  { id: "PRIYA", name: "Priya Sharma", employeeId: "NB1023", specialty: "Weight loss and pregnancy support" },
  { id: "RITU", name: "Ritu Verma", employeeId: "NB1048", specialty: "Lifestyle and meal planning" },
  { id: "ANITA", name: "Anita Nair", employeeId: "NB1077", specialty: "Diabetes and balanced diet" },
];

const demoAssignedUsers = [
  { name: "Ananya Verma", plan: "Premium plan", status: "On track" },
  { name: "Rahul Singh", plan: "Premium plan", status: "On track" },
  { name: "Meera Joshi", plan: "Premium plan", status: "On track" },
  { name: "Siddharth Rao", plan: "Premium plan", status: "On track" },
  { name: "Karthika", plan: "Weight loss plan", status: "Needs review" },
  { name: "G. Sriva", plan: "Pregnancy support", status: "On track" },
  { name: "Nisha Patel", plan: "Diabetes care", status: "On track" },
  { name: "Arjun Kumar", plan: "Balanced diet", status: "On track" },
  { name: "Lakshmi Devi", plan: "Premium plan", status: "Check-in pending" },
];

export const WELLNESS_KEYS = {
  assignedNutritionist: "nbAssignedNutritionist",
  assignedUsers: "nbAssignedUsers",
  currentNutritionistProfile: "nbCurrentNutritionistProfile",
  dailyRoutine: "nbDailyRoutine",
  chatThreads: "nbChatThreads",
  foodScans: "nbFoodScans",
  appointments: "nbAppointments",
  pointsLedger: "nbPointsLedger",
};

export const dailyRoutineTemplate = [
  {
    id: "wake-water",
    time: "5:30 AM",
    title: "Wake up and warm water",
    description: "Warm water with chia seeds, honey, and lemon.",
    points: 10,
    requiresPhoto: true,
  },
  {
    id: "exercise-1",
    time: "6:00 AM",
    title: "Exercise",
    description: "Morning workout or yoga as suggested by nutritionist.",
    points: 15,
    requiresPhoto: true,
  },
  {
    id: "breakfast",
    time: "8:00 AM",
    title: "Breakfast",
    description: "Breakfast suggested by your nutritionist.",
    points: 15,
    requiresPhoto: true,
  },
  {
    id: "fruit",
    time: "11:00 AM",
    title: "Fruit snack",
    description: "Seasonal fruit or a light healthy snack.",
    points: 8,
    requiresPhoto: true,
  },
  {
    id: "lunch",
    time: "12:30 PM",
    title: "Lunch",
    description: "Lunch designed by the nutritionist.",
    points: 15,
    requiresPhoto: true,
  },
  {
    id: "snack",
    time: "3:30 PM",
    title: "Fruit juice or snack",
    description: "Light snack or fresh juice.",
    points: 8,
    requiresPhoto: true,
  },
  {
    id: "exercise-2",
    time: "5:30 PM",
    title: "Light exercise",
    description: "Walk, stretch, or light movement.",
    points: 10,
    requiresPhoto: true,
  },
  {
    id: "dinner",
    time: "8:00 PM",
    title: "Dinner",
    description: "Dinner suggested by the nutritionist.",
    points: 15,
    requiresPhoto: true,
  },
];

const foodProfiles = [
  {
    tags: ["idli", "sambar"],
    label: "Idli sambar plate",
    calories: 320,
    protein: 12,
    carbs: 48,
    fats: 8,
    fibre: 6,
    vitamins: { vitaminA: 12, vitaminC: 14, vitaminB12: 0.8 },
    minerals: { iron: 2.6, calcium: 120, potassium: 390, magnesium: 46 },
  },
  {
    tags: ["poha"],
    label: "Poha plate",
    calories: 290,
    protein: 7,
    carbs: 46,
    fats: 9,
    fibre: 4,
    vitamins: { vitaminA: 8, vitaminC: 12, vitaminB12: 0.3 },
    minerals: { iron: 1.8, calcium: 32, potassium: 230, magnesium: 28 },
  },
  {
    tags: ["oats"],
    label: "Oats bowl",
    calories: 260,
    protein: 11,
    carbs: 38,
    fats: 7,
    fibre: 5,
    vitamins: { vitaminA: 5, vitaminC: 6, vitaminB12: 0.4 },
    minerals: { iron: 2.9, calcium: 96, potassium: 260, magnesium: 61 },
  },
  {
    tags: ["roti", "dal"],
    label: "Roti and dal meal",
    calories: 430,
    protein: 18,
    carbs: 58,
    fats: 12,
    fibre: 9,
    vitamins: { vitaminA: 10, vitaminC: 8, vitaminB12: 0.2 },
    minerals: { iron: 4.1, calcium: 110, potassium: 520, magnesium: 72 },
  },
  {
    tags: ["rice", "curry"],
    label: "Rice and curry plate",
    calories: 520,
    protein: 13,
    carbs: 76,
    fats: 16,
    fibre: 5,
    vitamins: { vitaminA: 12, vitaminC: 10, vitaminB12: 0.3 },
    minerals: { iron: 2.2, calcium: 58, potassium: 420, magnesium: 54 },
  },
  {
    tags: ["fruit"],
    label: "Fruit bowl",
    calories: 150,
    protein: 2,
    carbs: 36,
    fats: 0,
    fibre: 6,
    vitamins: { vitaminA: 44, vitaminC: 62, vitaminB12: 0 },
    minerals: { iron: 1.1, calcium: 40, potassium: 340, magnesium: 24 },
  },
  {
    tags: ["paneer", "salad"],
    label: "Paneer salad",
    calories: 360,
    protein: 22,
    carbs: 16,
    fats: 22,
    fibre: 5,
    vitamins: { vitaminA: 22, vitaminC: 24, vitaminB12: 1.2 },
    minerals: { iron: 2.8, calcium: 280, potassium: 310, magnesium: 38 },
  },
  {
    tags: ["smoothie", "milk"],
    label: "Smoothie",
    calories: 240,
    protein: 9,
    carbs: 34,
    fats: 6,
    fibre: 3,
    vitamins: { vitaminA: 18, vitaminC: 22, vitaminB12: 0.9 },
    minerals: { iron: 1.2, calcium: 180, potassium: 430, magnesium: 32 },
  },
];

const genericEstimate = {
  label: "Estimated meal",
  calories: 280,
  protein: 9,
  carbs: 34,
  fats: 9,
  fibre: 4,
  vitamins: { vitaminA: 12, vitaminC: 10, vitaminB12: 0.4 },
  minerals: { iron: 1.8, calcium: 75, potassium: 210, magnesium: 30 },
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function hashString(value) {
  let hash = 0;
  const input = value || "user";

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }

  return hash;
}

function normalizeIdentityKey(value) {
  return String(value || "guest")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getNutritionistIndex(identity) {
  return hashString(identity || "guest") % nutritionistRoster.length;
}

function getNutritionistProfile(identity) {
  const normalizedIdentity = normalizeIdentityKey(identity);
  const rosterMatch = nutritionistRoster.find((entry) => {
    const nameKey = normalizeIdentityKey(entry.name);
    const employeeKey = normalizeIdentityKey(entry.employeeId);
    const idKey = normalizeIdentityKey(entry.id);
    return (
      normalizedIdentity === nameKey ||
      normalizedIdentity === employeeKey ||
      normalizedIdentity === idKey
    );
  });

  return rosterMatch || nutritionistRoster[getNutritionistIndex(identity)];
}

function getAssignedUsersKey(nutritionist) {
  const profile = typeof nutritionist === "string"
    ? getNutritionistProfile(nutritionist)
    : nutritionist;
  return `${WELLNESS_KEYS.assignedUsers}:${normalizeIdentityKey(profile?.employeeId || profile?.name)}`;
}

function ensureAssignedUsersSeed(nutritionist) {
  const profile = typeof nutritionist === "string"
    ? getNutritionistProfile(nutritionist)
    : nutritionist;
  const targetIndex = nutritionistRoster.findIndex((entry) => entry.id === profile.id);
  const demoUsers = demoAssignedUsers.filter((user) =>
    getNutritionistIndex(user.name) === targetIndex,
  );

  return demoUsers.length > 0 ? demoUsers : demoAssignedUsers.slice(0, 3);
}

function loadAssignedUsersForNutritionist(nutritionist) {
  const key = getAssignedUsersKey(nutritionist);
  const stored = loadJson(key, null);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  const seeded = ensureAssignedUsersSeed(nutritionist);
  saveJson(key, seeded);
  return seeded;
}

function saveAssignedUsersForNutritionist(nutritionist, users) {
  saveJson(getAssignedUsersKey(nutritionist), users);
}

function registerUserWithNutritionist(userName, nutritionist) {
  const profile = typeof nutritionist === "string"
    ? getNutritionistProfile(nutritionist)
    : nutritionist;
  const key = getAssignedUsersKey(profile);
  const currentUsers = loadAssignedUsersForNutritionist(profile);
  const safeName = String(userName || "User").trim();

  if (!safeName) {
    return profile;
  }

  if (!currentUsers.some((entry) => normalizeIdentityKey(entry.name) === normalizeIdentityKey(safeName))) {
    currentUsers.unshift({
      name: safeName,
      plan: "Auto-assigned plan",
      status: "Active",
    });
    saveJson(key, currentUsers);
  }

  return profile;
}

export function getAssignedNutritionist(username) {
  const normalizedUser = String(username || "User").trim() || "User";
  const storageKey = `${WELLNESS_KEYS.assignedNutritionist}:${normalizeIdentityKey(normalizedUser)}`;
  const stored = loadJson(storageKey, null);
  if (stored?.name) {
    registerUserWithNutritionist(normalizedUser, stored);
    return stored;
  }

  const assigned = getNutritionistProfile(normalizedUser);
  saveJson(storageKey, assigned);
  registerUserWithNutritionist(normalizedUser, assigned);
  return assigned;
}

export function getLoggedInNutritionist(identity) {
  const storedProfile = loadJson(WELLNESS_KEYS.currentNutritionistProfile, null);
  const normalizedIdentity = normalizeIdentityKey(identity);

  if (storedProfile?.name) {
    const storedIdentity =
      normalizeIdentityKey(storedProfile.name) ||
      normalizeIdentityKey(storedProfile.employeeId);

    if (!normalizedIdentity || storedIdentity === normalizedIdentity) {
      return storedProfile;
    }
  }

  const rosterMatch = getNutritionistProfile(identity);
  if (rosterMatch?.name && normalizedIdentity === normalizeIdentityKey(rosterMatch.name)) {
    saveJson(WELLNESS_KEYS.currentNutritionistProfile, rosterMatch);
    return rosterMatch;
  }

  const fallbackProfile = {
    name: identity || "Nutritionist",
    employeeId:
      typeof localStorage !== "undefined"
        ? localStorage.getItem("nbNutritionistEmployeeId") ||
          localStorage.getItem("nbEmployeeId") ||
          ""
        : "",
    specialty:
      typeof localStorage !== "undefined"
        ? localStorage.getItem("nbNutritionistSpecialty") || "Assigned nutritionist"
        : "Assigned nutritionist",
  };

  saveJson(WELLNESS_KEYS.currentNutritionistProfile, fallbackProfile);
  return fallbackProfile;
}

export function getAssignedUsersForNutritionist(identity) {
  return loadAssignedUsersForNutritionist(identity);
}

export function getDailyRoutine() {
  return dailyRoutineTemplate.map((item) => ({
    ...item,
    photoUrl: "",
    completed: false,
    verified: false,
    notes: "",
    submittedAt: "",
    verifiedAt: "",
  }));
}

export function loadDailyRoutine() {
  const stored = loadJson(WELLNESS_KEYS.dailyRoutine, null);
  if (Array.isArray(stored) && stored.length === dailyRoutineTemplate.length) {
    return stored;
  }
  const fallback = getDailyRoutine();
  saveJson(WELLNESS_KEYS.dailyRoutine, fallback);
  return fallback;
}

export function saveDailyRoutine(routine) {
  saveJson(WELLNESS_KEYS.dailyRoutine, routine);
}

export function loadChatThreads() {
  return loadJson(WELLNESS_KEYS.chatThreads, []);
}

export function saveChatThreads(threads) {
  saveJson(WELLNESS_KEYS.chatThreads, threads);
}

export function loadAppointments() {
  return loadJson(WELLNESS_KEYS.appointments, []);
}

export function saveAppointments(appointments) {
  saveJson(WELLNESS_KEYS.appointments, appointments);
}

export function loadPointsLedger() {
  return loadJson(WELLNESS_KEYS.pointsLedger, []);
}

export function savePointsLedger(entries) {
  saveJson(WELLNESS_KEYS.pointsLedger, entries);
}

export function generateSupportReply(message) {
  const text = (message || "").toLowerCase();

  if (text.includes("water")) {
    return "Keep sipping water in 250 ml steps. Aim for a steady pace through the day, and log each glass when you finish it.";
  }

  if (text.includes("breakfast") || text.includes("meal")) {
    return "Send your meal photo and I will help estimate calories, carbs, protein, fibre, vitamins, and minerals.";
  }

  if (text.includes("exercise") || text.includes("walk") || text.includes("workout")) {
    return "Great. Try to keep your movement consistent and upload a quick photo or note after the session for your nutritionist review.";
  }

  if (text.includes("weight loss")) {
    return "For weight loss, keep protein higher, use smaller portions of carbs, and stay consistent with your water and meal photo uploads.";
  }

  if (text.includes("pregnant") || text.includes("pregnancy")) {
    return "For pregnancy, follow the assigned nutritionist carefully and avoid skipping meals. Upload all check-ins so your plan can be adjusted safely.";
  }

  if (text.includes("constipation")) {
    return "Try more fibre-rich food, water, and light walking. Upload your meal photo so we can see if the fibre intake is enough.";
  }

  return "I have noted your question. Your assigned nutritionist can review this in detail, but meanwhile keep logging meals, water, and photos daily.";
}

export function estimateFoodScan(fileName, hint = "") {
  const normalized = `${fileName || ""} ${hint || ""}`.toLowerCase();
  const profile = foodProfiles.find((entry) =>
    entry.tags.every((tag) => normalized.includes(tag)),
  );

  return profile || genericEstimate;
}

export function getWeeklyPointsSeries() {
  const ledger = loadPointsLedger();
  const base = [12, 18, 20, 24, 22, 28, 30];

  return base.map((value, index) => {
    const extra = ledger
      .filter((entry) => Number(entry.weekIndex) === index)
      .reduce((sum, entry) => sum + Number(entry.points || 0), 0);
    return value + extra;
  });
}

export function getTodayPoints(routine) {
  return routine.reduce(
    (sum, item) => sum + (item.verified ? Number(item.points || 0) : 0),
    0,
  );
}
