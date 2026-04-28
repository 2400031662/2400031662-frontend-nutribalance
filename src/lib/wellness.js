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

const preparationProfiles = [
  {
    tags: ["idli", "sambar"],
    title: "Idli sambar plate",
    summary:
      "Steam soft idlis, simmer a tangy sambar, and plate it fresh with chutney.",
    prepTime: "35 min",
    servings: 2,
    ingredients: [
      "Idli batter",
      "Toor dal",
      "Mixed vegetables",
      "Tamarind",
      "Sambar powder",
      "Mustard seeds",
      "Curry leaves",
      "Oil",
    ],
    steps: [
      "Soak and ferment the idli batter if it is not already prepared.",
      "Cook toor dal until soft, then mash it lightly.",
      "Boil vegetables with tamarind water, sambar powder, salt, and the mashed dal.",
      "Temper mustard seeds and curry leaves in a small pan with a little oil, then add it to the sambar.",
      "Steam the idlis for 10 to 12 minutes until fluffy.",
      "Serve the idlis hot with sambar and chutney on the side.",
    ],
    tips: [
      "Keep the sambar slightly thin so it soaks into the idli nicely.",
      "Add more vegetables if you want a higher-fibre plate.",
    ],
  },
  {
    tags: ["poha"],
    title: "Poha plate",
    summary:
      "Quick breakfast poha with mild spices, vegetables, and peanuts for crunch.",
    prepTime: "20 min",
    servings: 2,
    ingredients: [
      "Poha",
      "Onion",
      "Potato",
      "Green chilli",
      "Mustard seeds",
      "Curry leaves",
      "Turmeric",
      "Peanuts",
      "Lemon",
    ],
    steps: [
      "Rinse the poha gently and let it soften in a sieve for a few minutes.",
      "Heat a little oil, then add mustard seeds, curry leaves, peanuts, and green chilli.",
      "Add chopped onion and potato, then cook until the potato becomes soft.",
      "Stir in turmeric and salt, then fold in the softened poha.",
      "Finish with lemon juice and coriander before serving.",
    ],
    tips: [
      "Do not over-rinse the poha or it will turn mushy.",
      "Add peas or carrot for extra colour and fibre.",
    ],
  },
  {
    tags: ["oats"],
    title: "Oats bowl",
    summary:
      "Creamy oats with milk or water, finished with fruit, nuts, and seeds.",
    prepTime: "15 min",
    servings: 1,
    ingredients: [
      "Rolled oats",
      "Milk or water",
      "Banana or apple",
      "Nuts",
      "Chia seeds",
      "Cinnamon",
      "Honey (optional)",
    ],
    steps: [
      "Bring milk or water to a gentle boil in a pan.",
      "Add oats and stir for 4 to 6 minutes until the texture becomes creamy.",
      "Mix in cinnamon and a small amount of honey if you want sweetness.",
      "Top with chopped fruit, nuts, and seeds.",
      "Serve warm for breakfast or chill it slightly for a cold bowl.",
    ],
    tips: [
      "Add peanut butter or curd if you want more protein.",
      "Use water for a lighter bowl and milk for a richer bowl.",
    ],
  },
  {
    tags: ["roti", "dal"],
    title: "Roti and dal meal",
    summary:
      "A simple balanced Indian plate with soft roti, dal, and a light side.",
    prepTime: "40 min",
    servings: 2,
    ingredients: [
      "Whole wheat flour",
      "Water",
      "Dal",
      "Onion",
      "Tomato",
      "Turmeric",
      "Cumin",
      "Ghee or oil",
      "Coriander",
    ],
    steps: [
      "Knead the wheat flour with water and a pinch of salt into a soft dough.",
      "Cook the dal with turmeric until tender.",
      "Prepare a light tempering with cumin, onion, and tomato, then mix it into the dal.",
      "Roll the dough into rotis and cook them on a hot tawa until both sides puff lightly.",
      "Serve the rotis with dal and a fresh side salad or vegetable sabji.",
    ],
    tips: [
      "Brush only a little ghee if you want to keep the plate lighter.",
      "Add mixed vegetables into the dal to make it more filling.",
    ],
  },
  {
    tags: ["rice", "curry"],
    title: "Rice and curry plate",
    summary:
      "A homestyle rice plate paired with a flavourful curry and a simple side.",
    prepTime: "45 min",
    servings: 2,
    ingredients: [
      "Rice",
      "Vegetables or protein of choice",
      "Onion",
      "Tomato",
      "Ginger-garlic paste",
      "Curry spices",
      "Oil",
      "Salt",
    ],
    steps: [
      "Rinse the rice well and cook it until fluffy.",
      "Sauté onion and ginger-garlic paste in a little oil.",
      "Add tomato, spices, vegetables, or protein, then cook until the curry thickens.",
      "Adjust salt and consistency with water if needed.",
      "Plate the rice and curry together, then add salad or curd on the side.",
    ],
    tips: [
      "Use more vegetables if you want a lighter plate.",
      "Keep the curry moderately thick so it stays balanced on the plate.",
    ],
  },
  {
    tags: ["fruit"],
    title: "Fruit bowl",
    summary:
      "Fresh chopped fruit with a simple garnish for a quick healthy snack.",
    prepTime: "10 min",
    servings: 1,
    ingredients: [
      "Seasonal fruit",
      "Lemon juice",
      "Chaat masala or black salt",
      "Mint leaves",
      "Seeds (optional)",
    ],
    steps: [
      "Wash the fruit thoroughly under clean water.",
      "Peel and chop it into bite-size pieces.",
      "Mix the fruit in a bowl and add a few drops of lemon juice.",
      "Sprinkle a little chaat masala or black salt if desired.",
      "Serve chilled or at room temperature.",
    ],
    tips: [
      "Mix at least two colours of fruit for a better nutrient spread.",
      "Add a few seeds or nuts if you want more satiety.",
    ],
  },
  {
    tags: ["paneer", "salad"],
    title: "Paneer salad",
    summary:
      "Protein-rich paneer with crisp vegetables and a light dressing.",
    prepTime: "20 min",
    servings: 1,
    ingredients: [
      "Paneer",
      "Cucumber",
      "Tomato",
      "Lettuce or greens",
      "Lemon juice",
      "Black pepper",
      "Salt",
      "Olive oil or curd dressing",
    ],
    steps: [
      "Cube the paneer and lightly pan-sear it if you want extra flavour.",
      "Wash and chop the vegetables into a salad bowl.",
      "Add the paneer on top of the vegetables.",
      "Mix lemon juice, salt, pepper, and a small amount of oil or curd for dressing.",
      "Toss everything gently and serve fresh.",
    ],
    tips: [
      "Add chickpeas or sprouts if you want extra fibre and protein.",
      "Keep the dressing light so the plate stays easy to digest.",
    ],
  },
  {
    tags: ["smoothie", "milk"],
    title: "Smoothie",
    summary:
      "Blend fruit, milk, or curd into a smooth, drinkable meal or snack.",
    prepTime: "10 min",
    servings: 1,
    ingredients: [
      "Fruit",
      "Milk or curd",
      "Oats or seeds",
      "Ice cubes",
      "Honey (optional)",
    ],
    steps: [
      "Add fruit, milk or curd, and oats or seeds into a blender.",
      "Blend until smooth and creamy.",
      "Taste and add a small amount of honey if you want extra sweetness.",
      "Pour into a glass and top with a few seeds if you like texture.",
      "Serve immediately for the freshest flavour.",
    ],
    tips: [
      "Use curd for a thicker smoothie and milk for a lighter one.",
      "Add nuts or peanut butter if you want a higher-calorie version.",
    ],
  },
];

function normalizeQuery(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildGenericPreparationGuide(query) {
  const normalized = normalizeQuery(query);
  const title = query ? `AI prep guide for ${query}` : "AI plate supporter";

  if (normalized.includes("oats")) {
    return {
      title,
      summary: "A quick oats bowl with simple toppings and a balanced finish.",
      prepTime: "15 min",
      servings: 1,
      ingredients: ["Rolled oats", "Milk or water", "Fruit", "Seeds", "Nuts"],
      steps: [
        "Cook the oats in milk or water until creamy.",
        "Add fruit and seeds on top.",
        "Finish with nuts or a small spoon of peanut butter.",
        "Serve warm or chilled.",
      ],
      tips: [
        "Use milk for extra protein and water for a lighter bowl.",
        "Add cinnamon for flavour without adding sugar.",
      ],
      confidence: "medium",
    };
  }

  if (normalized.includes("rice")) {
    return {
      title,
      summary: "A simple rice plate with a protein-rich curry or dal.",
      prepTime: "35 min",
      servings: 2,
      ingredients: ["Rice", "Dal or curry", "Vegetables", "Spices", "Oil"],
      steps: [
        "Cook the rice until fluffy.",
        "Prepare dal or curry with vegetables and spices.",
        "Keep the gravy medium-thick so it plates well.",
        "Serve the rice with curry and a fresh side.",
      ],
      tips: [
        "Add more vegetables if you want a lighter plate.",
        "Keep oil moderate for a healthier result.",
      ],
      confidence: "medium",
    };
  }

  if (normalized.includes("roti") || normalized.includes("chapati")) {
    return {
      title,
      summary: "A soft roti plate with dal or a light vegetable side.",
      prepTime: "30 min",
      servings: 2,
      ingredients: ["Whole wheat flour", "Water", "Dal or sabji", "Salt"],
      steps: [
        "Knead the dough with water and a little salt.",
        "Rest the dough for 10 minutes.",
        "Roll and cook the rotis on a hot pan.",
        "Serve with dal or sabji while hot.",
      ],
      tips: [
        "Brush a little ghee only if you want more richness.",
        "Pair with salad for extra fibre.",
      ],
      confidence: "medium",
    };
  }

  if (normalized.includes("salad")) {
    return {
      title,
      summary: "A fresh salad bowl with protein and a light dressing.",
      prepTime: "15 min",
      servings: 1,
      ingredients: ["Leafy greens", "Cucumber", "Tomato", "Protein", "Dressing"],
      steps: [
        "Wash and chop the vegetables.",
        "Add a protein source like paneer, beans, or chickpeas.",
        "Mix lemon, salt, pepper, and a little oil or curd for dressing.",
        "Toss gently and serve fresh.",
      ],
      tips: [
        "Keep the dressing light so the salad stays refreshing.",
        "Add seeds for a small nutritional boost.",
      ],
      confidence: "medium",
    };
  }

  if (normalized.includes("fruit")) {
    return {
      title,
      summary: "A fruit bowl that is easy to assemble and easy to digest.",
      prepTime: "10 min",
      servings: 1,
      ingredients: ["Seasonal fruit", "Lemon", "Mint", "Seeds"],
      steps: [
        "Wash all fruit thoroughly.",
        "Chop into bite-size pieces.",
        "Mix with a little lemon and mint.",
        "Serve chilled if you want a fresher taste.",
      ],
      tips: [
        "Mix two or more fruits for better variety.",
        "Add nuts or seeds if you want it to keep you full longer.",
      ],
      confidence: "medium",
    };
  }

  return {
    title,
    summary:
      "I could not match the dish confidently, so here is a safe plate-building guide you can refine with the dish name or ingredients.",
    prepTime: "20 to 40 min",
    servings: 1,
    ingredients: [
      "Main base: rice, roti, oats, or bread",
      "Protein: dal, paneer, eggs, or beans",
      "Vegetables: any seasonal vegetables",
      "Seasoning: salt, spices, herbs, and lemon",
    ],
    steps: [
      "Start with the main base you have available.",
      "Cook a protein source so the plate feels complete.",
      "Add vegetables for colour, fibre, and volume.",
      "Season lightly and keep oil under control.",
      "Plate everything neatly and taste before serving.",
    ],
    tips: [
      "If you tell me the dish name or share ingredients, I can make this much more precise.",
      "Build the plate with one-quarter protein, one-quarter grains, and half vegetables where possible.",
    ],
    confidence: "low",
  };
}

function findPreparationProfile(query) {
  const normalized = normalizeQuery(query);

  return preparationProfiles.find((entry) =>
    entry.tags.every((tag) => normalized.includes(tag)),
  );
}

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

export function loadFoodScans() {
  return loadJson(WELLNESS_KEYS.foodScans, []);
}

export function saveFoodScans(scans) {
  saveJson(WELLNESS_KEYS.foodScans, scans);
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

  return profile
    ? { ...profile, matched: true, source: "known-profile" }
    : { ...genericEstimate, matched: false, source: "fallback" };
}

export function generatePlateSupportGuide(fileName, hint = "", scanResult = null) {
  const query = `${fileName || ""} ${hint || ""} ${scanResult?.label || ""}`.trim();
  const matchedProfile = findPreparationProfile(query);

  if (matchedProfile) {
    return {
      ...matchedProfile,
      matched: true,
      source: "known-profile",
      headline: "Step-by-step preparation guide",
      confidence: "high",
    };
  }

  const fallback = buildGenericPreparationGuide(
    scanResult?.matched === false ? hint || fileName || scanResult?.label : query,
  );

  return {
    ...fallback,
    matched: false,
    source: "ai-fallback",
    headline: "AI-supported preparation guide",
  };
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
