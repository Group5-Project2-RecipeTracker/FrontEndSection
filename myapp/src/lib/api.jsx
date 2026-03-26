import { auth } from "../firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

async function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : localStorage.getItem("token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(await getAuthHeaders()),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getFoods: () => request("/api/foods"),
  getFood: (id) => request(`/api/foods/${id}`),
  createFood: (food) =>
    request("/api/foods", {
      method: "POST",
      body: JSON.stringify(food),
    }),
  updateFood: (id, food) =>
    request(`/api/foods/${id}`, {
      method: "PUT",
      body: JSON.stringify(food),
    }),
  deleteFood: (id) =>
    request(`/api/foods/${id}`, {
      method: "DELETE",
    }),

  getRecipes: () => request("/api/recipes"),
  getRecipe: (id) => request(`/api/recipes/${id}`),
  createRecipe: (recipe) =>
    request("/api/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
    }),
  updateRecipe: (id, recipe) =>
    request(`/api/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(recipe),
    }),
  deleteRecipe: (id) =>
    request(`/api/recipes/${id}`, {
      method: "DELETE",
    }),

  getMealPlan: () => request("/api/meal-plans"),
  saveMealPlan: (meals) =>
    request("/api/meal-plans", {
      method: "POST",
      body: JSON.stringify({
        meals,
        updatedAt: new Date().toISOString(),
      }),
    }),

  health: () => request("/api/health"),
};