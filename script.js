const mealLibrary = [
  {
    name: "Sunny Tomato Pasta",
    ingredients: ["pasta", "tomato", "garlic", "olive oil"],
    description: "A fast and cozy pasta that feels like a little kitchen celebration.",
    serves: "1–2 people",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=80",
    steps: [
      "Boil a small portion of pasta in salted water until tender.",
      "Cook chopped tomato and garlic in olive oil for a few minutes.",
      "Mix everything together, add pepper and a little cheese, and serve warm."
    ],
    songs: ["The Beatles - Here Comes the Sun", "Lizzo - Good as Hell", "Daft Punk - Around the World"]
  },
  {
    name: "Egg Fried Rice",
    ingredients: ["rice", "egg", "onion", "soy sauce"],
    description: "A simple skillet meal that turns everyday staples into something satisfying.",
    serves: "1–2 people",
    image: "https://images.unsplash.com/photo-1512058564366-c9e3a6d55393?auto=format&fit=crop&w=1000&q=80",
    steps: [
      "Warm a pan and lightly scramble the egg.",
      "Add chopped onion and cooked rice, then stir in a splash of soy sauce.",
      "Cook until everything is hot and lightly crisp, then serve."
    ],
    songs: ["Jack Johnson - Better Together", "Beyoncé - Crazy in Love", "SZA - The Weekend"]
  },
  {
    name: "Cheesy Veggie Toast",
    ingredients: ["bread", "cheese", "tomato", "spinach"],
    description: "Crisp, melty, and perfect when you want a quick bite with a warm feel.",
    serves: "1–2 people",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80",
    steps: [
      "Toast bread until golden.",
      "Layer cheese, tomato slices, and spinach on top.",
      "Bake or broil until the cheese melts and the edges are crisp."
    ],
    songs: ["Bill Withers - Lovely Day", "Bruno Mars - Uptown Funk", "Adele - Make You Feel My Love"]
  },
  {
    name: "Taco Bowl",
    ingredients: ["rice", "beans", "avocado", "corn", "lime"],
    description: "A fresh bowl with lots of texture and bold flavor.",
    serves: "1–2 people",
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1000&q=80",
    steps: [
      "Warm the rice and beans in a pan.",
      "Add corn and avocado on top for a fresh finish.",
      "Squeeze lime over everything and serve with a little seasoning."
    ],
    songs: ["Shakira - Hips Don't Lie", "Luis Fonsi - Despacito", "The Weeknd - Blinding Lights"]
  },
  {
    name: "Garden Omelet",
    ingredients: ["egg", "onion", "spinach", "cheese"],
    description: "A fluffy omelet that works for breakfast, lunch, or a late-night snack.",
    serves: "1–2 people",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
    steps: [
      "Beat a couple of eggs with a pinch of salt and pepper.",
      "Cook onion and spinach in a pan, then pour in the eggs.",
      "Add cheese, fold the omelet, and cook until soft and golden."
    ],
    songs: ["Norah Jones - Come Away With Me", "Fleetwood Mac - Dreams", "John Mayer - Gravity"]
  }
];

const dailyQuotes = [
  { text: "Cooking is like love; it should be entered into with abandon or not at all.", author: "Harriet van Horne" },
  { text: "Good food is the foundation of genuine happiness.", author: "Auguste Escoffier" },
  { text: "The only thing I like better than talking about food is eating.", author: "John Walters" },
  { text: "Food is symbolic of love when words are inadequate.", author: "Alan D. Wolfelt" },
  { text: "A recipe has no soul. You, as the cook, must bring soul to the recipe.", author: "Thomas Keller" }
];

const pluralMap = {
  tomatoes: "tomato",
  potatoes: "potato",
  onions: "onion",
  eggs: "egg",
  beans: "bean",
  avocados: "avocado",
  cheeses: "cheese",
  breads: "bread",
  peppers: "pepper",
  carrots: "carrot",
  berries: "berry",
  mushrooms: "mushroom",
  limes: "lime",
  olives: "olive"
};

function normalizeIngredient(ingredient) {
  const normalized = ingredient
    .trim()
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ");

  if (!normalized) return "";

  const exactMap = {
    "olive oil": "olive oil",
    "soy sauce": "soy sauce",
    "garlic cloves": "garlic",
    "garlic clove": "garlic",
    "tomato slices": "tomato",
    "spinach leaves": "spinach",
    "cheese slices": "cheese",
    "eggs": "egg",
    "beans": "bean"
  };

  if (exactMap[normalized]) {
    return exactMap[normalized];
  }

  if (pluralMap[normalized]) {
    return pluralMap[normalized];
  }

  if (normalized.endsWith("ies") && normalized.length > 3) {
    return `${normalized.slice(0, -3)}y`;
  }

  if (normalized.endsWith("s") && normalized.length > 2 && !normalized.endsWith("ss")) {
    return normalized.slice(0, -1);
  }

  return normalized;
}

function normalizeIngredients(input) {
  return input
    .split(/[;,\n]+/)
    .map((item) => normalizeIngredient(item))
    .filter(Boolean);
}

function pickMeal(ingredientsInput) {
  const availableIngredients = normalizeIngredients(ingredientsInput);

  if (!availableIngredients.length) {
    return mealLibrary[Math.floor(Math.random() * mealLibrary.length)];
  }

  const availableSet = new Set(availableIngredients);

  const scoredMeals = mealLibrary.map((meal) => {
    const normalizedMealIngredients = meal.ingredients.map((ingredient) => normalizeIngredient(ingredient));
    const matchedIngredients = normalizedMealIngredients.filter((ingredient) => availableSet.has(ingredient));
    const missingIngredients = normalizedMealIngredients.filter((ingredient) => !availableSet.has(ingredient));
    const matchCount = matchedIngredients.length;
    const matchRatio = matchCount / normalizedMealIngredients.length;
    const exactMatch = matchCount === normalizedMealIngredients.length;

    const score = matchCount * 100 + matchRatio * 50 + (exactMatch ? 25 : 0) - missingIngredients.length * 20;

    return {
      ...meal,
      matchCount,
      matchRatio,
      matchedIngredients,
      missingIngredients,
      score
    };
  });

  const validMeals = scoredMeals.filter((meal) => meal.matchCount > 0);

  if (!validMeals.length) {
    return mealLibrary[Math.floor(Math.random() * mealLibrary.length)];
  }

  const bestScore = Math.max(...validMeals.map((meal) => meal.score));
  const eligibleMeals = validMeals.filter((meal) => meal.score === bestScore);

  return eligibleMeals[Math.floor(Math.random() * eligibleMeals.length)];
}

function renderMeal(meal, availableIngredients) {
  const resultBox = document.getElementById("meal-result");
  const matchedIngredients = meal.ingredients.filter((ingredient) => availableIngredients.includes(ingredient));
  const missingIngredients = meal.ingredients.filter((ingredient) => !availableIngredients.includes(ingredient));
  const instructions = meal.steps.map((step) => `<li>${step}</li>`).join("");

  resultBox.innerHTML = `
    <img src="${meal.image}" alt="${meal.name}" class="meal-image" />
    <h3>${meal.name}</h3>
    <p>${meal.description}</p>
    <p><strong>Ingredients that fit:</strong> ${matchedIngredients.length ? matchedIngredients.join(", ") : "a few pantry staples"}</p>
    <p><strong>Missing ingredients:</strong> ${missingIngredients.length ? missingIngredients.join(", ") : "none"}</p>
    <div class="instructions">
      <p><strong>How to cook for ${meal.serves}:</strong></p>
      <ol>${instructions}</ol>
    </div>
  `;
}

function renderQuote() {
  const quoteIndex = new Date().getDate() % dailyQuotes.length;
  const todayQuote = dailyQuotes[quoteIndex];
  document.getElementById("quote-text").textContent = `“${todayQuote.text}”`;
  document.getElementById("quote-author").textContent = `— ${todayQuote.author}`;
}

const songVideoIds = {
  "The Beatles - Here Comes the Sun": "KQetemT1sWc",
  "Lizzo - Good as Hell": "vb2aJ7B7No8",
  "Daft Punk - Around the World": "dwD3T9xv1B0",
  "Jack Johnson - Better Together": "dJcL8trgGVk",
  "Beyoncé - Crazy in Love": "ViwtNLUqkMY",
  "SZA - The Weekend": "U3ASj1L6_sY",
  "Bill Withers - Lovely Day": "EwTZ2xpQwpA",
  "Bruno Mars - Uptown Funk": "OPf0YbXqDm0",
  "Adele - Make You Feel My Love": "0put0_a--Ng",
  "Shakira - Hips Don't Lie": "DUT5rEU6pqM",
  "Luis Fonsi - Despacito": "kJQP7kiw5Fk",
  "The Weeknd - Blinding Lights": "4NRXx6U8ABQ",
  "Norah Jones - Come Away With Me": "UYFGV4Ezv18",
  "Fleetwood Mac - Dreams": "mrZRURcb1cM",
  "John Mayer - Gravity": "H1mOQHYQ6Xo"
};

function renderSongs(meal) {
  const songIntro = document.getElementById("song-intro");
  const songList = document.getElementById("song-list");
  const songPlayerGrid = document.getElementById("song-player-grid");

  songIntro.textContent = `For ${meal.name}, try this cozy kitchen playlist:`;
  songList.innerHTML = meal.songs.map((song) => `<li>${song}</li>`).join("");

  songPlayerGrid.innerHTML = meal.songs
    .map((song) => {
      const videoId = songVideoIds[song];
      if (!videoId) {
        return `<div class="song-card"><h3>${song}</h3><p>Video not available yet.</p></div>`;
      }
      return `
        <div class="song-card">
          <h3>${song}</h3>
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/${videoId}?rel=0&controls=1&modestbranding=1"
              title="${song}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
          <a class="play-link" href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">
            Open on YouTube
          </a>
        </div>
      `;
    })
    .join("");
}

function initializePage() {
  const defaultMeal = mealLibrary[Math.floor(Math.random() * mealLibrary.length)];
  renderMeal(defaultMeal, []);
  renderQuote();
  renderSongs(defaultMeal);
}

const form = document.getElementById("ingredient-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("ingredients").value;
  const selectedMeal = pickMeal(input);
  const availableIngredients = normalizeIngredients(input);
  renderMeal(selectedMeal, availableIngredients);
  renderSongs(selectedMeal);
});

initializePage();
