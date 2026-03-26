import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { api } from "../lib/api.jsx";
import { auth } from "../firebase";
import "../styles/Dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(
        auth.currentUser?.email === "admin@email.com"
    );

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        goal: "",
    });
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState("");
    const [profileError, setProfileError] = useState("");

    const [page, setPage] = useState("dashboard");
    const [date, setDate] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedMeal, setSelectedMeal] = useState("lunch");
    const [selectedRecipeMeal, setSelectedRecipeMeal] = useState("lunch");
    const [mealPlanSaving, setMealPlanSaving] = useState(false);
    const [mealPlanMsg, setMealPlanMsg] = useState("");

    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    });

    const [form, setForm] = useState({
        meal: "breakfast",
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
    });

    const [foods, setFoods] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(true);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadMealPlan() {
            try {
                const data = await api.getMealPlan();
                if (mounted && data?.meals) {
                    setMeals((prev) => ({ ...prev, ...data.meals }));
                }
            } catch (err) {
                if (mounted && auth.currentUser) {
                    setError(`Failed to load meal plan: ${err.message}`);
                }
            }
        }

        const currentUser = auth.currentUser;
        if (currentUser && mounted) {
            setProfile({
                name: currentUser.displayName || "",
                email: currentUser.email || "",
                goal: localStorage.getItem("userGoal") || "",
            });
            loadMealPlan();
        }

        api
            .getFoods()
            .then((data) => {
                if (mounted) {
                    setFoods(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                if (mounted) {
                    setError(`Failed to load foods: ${err.message}`);
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoadingFoods(false);
                }
            });

        api
            .getRecipes()
            .then((data) => {
                if (mounted) {
                    setRecipes(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                if (mounted) {
                    setError(`Failed to load recipes: ${err.message}`);
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoadingRecipes(false);
                }
            });

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (mounted) {
                setIsAdmin(user?.email === "admin@email.com");
                setProfile({
                    name: user?.displayName || "",
                    email: user?.email || "",
                    goal: localStorage.getItem("userGoal") || "",
                });
                if (user) {
                    loadMealPlan();
                }
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    async function saveProfile() {
        setProfileSaving(true);
        setProfileMsg("");
        setProfileError("");

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Not logged in.");

            await updateProfile(user, { displayName: profile.name });
            localStorage.setItem("userGoal", profile.goal);

            setProfileMsg("Profile saved successfully!");
        } catch (err) {
            setProfileError("Failed to save: " + err.message);
        } finally {
            setProfileSaving(false);
        }
    }

    async function saveMealPlanToDatabase() {
        if (!auth.currentUser) {
            setError("You must be logged in to save your meal plan.");
            return;
        }

        setMealPlanSaving(true);
        setMealPlanMsg("");
        setError("");

        try {
            await api.saveMealPlan(meals);
            setMealPlanMsg("Meal plan saved successfully!");
        } catch (err) {
            setError(`Failed to save meal plan: ${err.message}`);
        } finally {
            setMealPlanSaving(false);
        }
    }

    function addCatalogFood(food, meal) {
        const targetMeal = meal || selectedMeal;

        const newFood = {
            name: food.name,
            cal: Number(food.calories || food.cal || 0),
            protein: Number(food.protein_g || food.protein || 0),
            carbs: Number(food.carbs_g || food.carbs || 0),
            fats: Number(food.fat_g || food.fat || food.fats || 0),
            category: food.category || "",
        };

        const updatedMeals = {
            ...meals,
            [targetMeal]: [...meals[targetMeal], newFood],
        };

        setMeals(updatedMeals);
        setMealPlanMsg("");
    }

    function addRecipeToMeal(recipe, meal) {
        const targetMeal = meal || selectedRecipeMeal;

        const recipeAsMeal = {
            name: recipe.name,
            cal: Number(recipe.calories || recipe.cal || 0),
            protein: Number(recipe.protein || recipe.protein_g || 0),
            carbs: Number(recipe.carbs || recipe.carbs_g || 0),
            fats: Number(recipe.fat || recipe.fat_g || recipe.fats || 0),
            category: recipe.category || "Recipe",
        };

        const updatedMeals = {
            ...meals,
            [targetMeal]: [...meals[targetMeal], recipeAsMeal],
        };

        setMeals(updatedMeals);
        setMealPlanMsg("");
    }

    const filteredFoods = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return foods;

        return foods.filter((food) => {
            const name = (food.name || "").toLowerCase();
            const category = (food.category || "").toLowerCase();
            return name.includes(q) || category.includes(q);
        });
    }, [foods, search]);

    const allFoods = [
        ...meals.breakfast,
        ...meals.lunch,
        ...meals.dinner,
        ...meals.snack,
    ];

    const totalCal = allFoods.reduce((a, b) => a + b.cal, 0);
    const totalProtein = allFoods.reduce((a, b) => a + b.protein, 0);
    const totalCarbs = allFoods.reduce((a, b) => a + b.carbs, 0);
    const totalFats = allFoods.reduce((a, b) => a + b.fats, 0);

    function saveFood() {
        if (!form.name || !form.calories) {
            alert("Name and calories are required.");
            return;
        }

        const newFood = {
            name: form.name,
            cal: Number(form.calories),
            protein: Number(form.protein) || 0,
            carbs: Number(form.carbs) || 0,
            fats: Number(form.fats) || 0,
        };

        const updatedMeals = {
            ...meals,
            [form.meal]: [...meals[form.meal], newFood],
        };

        setMeals(updatedMeals);

        setForm({
            ...form,
            name: "",
            calories: "",
            protein: "",
            carbs: "",
            fats: "",
        });

        setShowForm(false);
        setMealPlanMsg("");
    }

    function removeFood(meal, index) {
        const updated = meals[meal].filter((_, i) => i !== index);
        const updatedMeals = { ...meals, [meal]: updated };
        setMeals(updatedMeals);
        setMealPlanMsg("");
    }

    function getRecs() {
        const recs = [];
        const proteinFoods = [
            "grilled chicken",
            "scrambled eggs",
            "Greek yogurt",
            "tuna sandwich",
            "beans or lentils",
        ];
        const carbFoods = [
            "brown rice",
            "oatmeal",
            "whole grain toast",
            "banana",
            "sweet potatoes",
        ];
        const fatFoods = [
            "avocado",
            "almonds or walnuts",
            "peanut butter",
            "olive oil",
            "chia seeds",
        ];
        const balancedMeals = [
            "chicken with rice and vegetables",
            "salmon with quinoa",
            "turkey sandwich with avocado",
            "tofu stir fry with rice",
            "egg scramble with toast",
        ];

        function random(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        if (totalCal < 1000) {
            recs.push(
                "You're under your calorie goal. Try something like " +
                    random(balancedMeals) +
                    "."
            );
        }

        if (totalCal > 2000) {
            recs.push(
                "You've gone over your calorie goal today. Consider lighter meals like grilled chicken salad or vegetables with lean protein."
            );
        }

        if (totalProtein < 75) {
            recs.push("Protein is low. Try adding " + random(proteinFoods) + ".");
        }

        if (totalCarbs < 100) {
            recs.push("Carbs are low. A good option could be " + random(carbFoods) + ".");
        }

        if (totalFats < 30) {
            recs.push("Healthy fats are low. Try adding " + random(fatFoods) + ".");
        }

        if (totalProtein >= 150) {
            recs.push("Protein goal reached! Great job hitting your target.");
        }

        return recs;
    }

    return (
        <div className="dashboard-shell">
            <div className="dashboard-nav">
                {["dashboard", "catalog", "recipes", "profile"].map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`dashboard-nav-button ${page === p ? "active" : ""}`}
                    >
                        {p === "catalog"
                            ? "Food Catalog"
                            : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>

            {error && <div className="dashboard-error-banner">{error}</div>}
            {mealPlanMsg && <div className="dashboard-success-banner">{mealPlanMsg}</div>}

            {page === "dashboard" && (
                <div className="dashboard-layout">
                    <div className="dashboard-sidebar left">
                        <div className="dashboard-sidebar-header">
                            <h2 className="dashboard-sidebar-title">Food Log</h2>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="dashboard-btn dashboard-btn-primary dashboard-btn-small"
                            >
                                + Add
                            </button>
                        </div>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="dashboard-form-control dashboard-date-input"
                        />

                        {showForm && (
                            <div className="dashboard-food-form-card">
                                <select
                                    value={form.meal}
                                    onChange={(e) => setForm({ ...form, meal: e.target.value })}
                                    className="dashboard-form-control"
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>

                                <input
                                    placeholder="Food name *"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="dashboard-form-control"
                                />

                                <input
                                    placeholder="Calories *"
                                    type="number"
                                    value={form.calories}
                                    onChange={(e) =>
                                        setForm({ ...form, calories: e.target.value })
                                    }
                                    className="dashboard-form-control"
                                />

                                <input
                                    placeholder="Protein (g)"
                                    type="number"
                                    value={form.protein}
                                    onChange={(e) =>
                                        setForm({ ...form, protein: e.target.value })
                                    }
                                    className="dashboard-form-control"
                                />

                                <input
                                    placeholder="Carbs (g)"
                                    type="number"
                                    value={form.carbs}
                                    onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                                    className="dashboard-form-control"
                                />

                                <input
                                    placeholder="Fats (g)"
                                    type="number"
                                    value={form.fats}
                                    onChange={(e) => setForm({ ...form, fats: e.target.value })}
                                    className="dashboard-form-control"
                                />

                                <div className="dashboard-form-actions">
                                    <button
                                        onClick={saveFood}
                                        className="dashboard-btn dashboard-btn-primary dashboard-btn-flex"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="dashboard-btn dashboard-btn-secondary dashboard-btn-flex"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="dashboard-form-actions">
                            <button
                                onClick={saveMealPlanToDatabase}
                                disabled={mealPlanSaving}
                                className="dashboard-btn dashboard-btn-primary dashboard-btn-flex"
                            >
                                {mealPlanSaving ? "Saving..." : "Save Meal Plan"}
                            </button>
                        </div>

                        {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
                            <div key={meal} className="dashboard-meal-card">
                                <div className="dashboard-meal-card-header">
                                    <b className="dashboard-meal-name">{meal}</b>
                                    <span className="dashboard-meal-calories">
                                        {meals[meal].reduce((a, b) => a + b.cal, 0)} kcal
                                    </span>
                                </div>

                                {meals[meal].length === 0 && (
                                    <p className="dashboard-meal-empty">Nothing logged</p>
                                )}

                                {meals[meal].map((f, i) => (
                                    <div key={i} className="dashboard-meal-item">
                                        <span>{f.name}</span>
                                        <span className="dashboard-meal-item-calories">
                                            {f.cal} cal
                                            <button
                                                onClick={() => removeFood(meal, i)}
                                                className="dashboard-meal-remove-button"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="dashboard-main">
                        <div className="dashboard-overview-header">
                            <div>
                                <h2 className="dashboard-overview-title">Today's Overview</h2>
                                <p className="dashboard-overview-date">
                                    {date || "No date selected"}
                                </p>
                            </div>

                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin")}
                                    className="dashboard-btn dashboard-btn-primary"
                                >
                                    Admin
                                </button>
                            )}
                        </div>

                        <div className="dashboard-stats-grid">
                            {[
                                { label: "Calories", value: totalCal, goal: 2000, unit: "" },
                                { label: "Protein", value: totalProtein, goal: 150, unit: "g" },
                                { label: "Carbs", value: totalCarbs, goal: 225, unit: "g" },
                                { label: "Fats", value: totalFats, goal: 65, unit: "g" },
                            ].map(({ label, value, goal, unit }) => (
                                <div key={label} className="dashboard-stat-card">
                                    <p className="dashboard-stat-label">{label}</p>
                                    <p className="dashboard-stat-value">
                                        {value}
                                        {unit}{" "}
                                        <span className="dashboard-stat-goal">
                                            / {goal}
                                            {unit}
                                        </span>
                                    </p>
                                    <div className="dashboard-progress-bar">
                                        <div
                                            className="dashboard-progress-fill"
                                            style={{
                                                width:
                                                    Math.min((value / goal) * 100, 100) + "%",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {allFoods.length === 0 ? (
                            <div className="dashboard-empty-state-card">
                                <p className="dashboard-empty-state-text">No meals logged yet</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="dashboard-btn dashboard-btn-primary"
                                >
                                    Log Your First Meal
                                </button>
                            </div>
                        ) : (
                            <div className="dashboard-breakdown-card">
                                <h3 className="dashboard-breakdown-title">Meal Breakdown</h3>

                                {["breakfast", "lunch", "dinner", "snack"].map((meal) => {
                                    if (meals[meal].length === 0) return null;

                                    return (
                                        <div key={meal} className="dashboard-breakdown-section">
                                            <p className="dashboard-breakdown-meal-title">
                                                {meal}
                                            </p>

                                            {meals[meal].map((f, i) => (
                                                <div
                                                    key={i}
                                                    className="dashboard-breakdown-item"
                                                >
                                                    <span>{f.name}</span>
                                                    <span>
                                                        {f.cal} cal · P {f.protein}g · C {f.carbs}g
                                                        · F {f.fats}g
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="dashboard-sidebar right">
                        <h2 className="dashboard-sidebar-title dashboard-sidebar-title-margin">
                            Recommendations
                        </h2>
                        <p className="dashboard-sidebar-subtitle">
                            Based on what you've logged
                        </p>

                        {allFoods.length === 0 && (
                            <p className="dashboard-recommendation-empty">
                                Log food first to see recommendations.
                            </p>
                        )}

                        {allFoods.length > 0 && getRecs().length === 0 && (
                            <div className="dashboard-recommendation-card">
                                <p className="dashboard-recommendation-text">
                                    You're on track with all your goals!
                                </p>
                            </div>
                        )}

                        {allFoods.length > 0 &&
                            getRecs().map((rec, i) => (
                                <div key={i} className="dashboard-recommendation-card">
                                    <p className="dashboard-recommendation-text">{rec}</p>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {page === "catalog" && (
                <div className="dashboard-page-container dashboard-page-container-wide">
                    <h2 className="dashboard-page-title">Food Catalog</h2>
                    <p className="dashboard-page-subtitle">
                        Browse foods and add them to your log
                    </p>

                    <div className="dashboard-catalog-toolbar">
                        <input
                            placeholder="Search by food or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="dashboard-form-control dashboard-search-input"
                        />

                        <div className="dashboard-catalog-toolbar-group">
                            <label className="dashboard-toolbar-label">Add to:</label>
                            <select
                                value={selectedMeal}
                                onChange={(e) => setSelectedMeal(e.target.value)}
                                className="dashboard-meal-select"
                            >
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>
                    </div>

                    {loadingFoods ? (
                        <p className="dashboard-status-text">Loading foods...</p>
                    ) : filteredFoods.length === 0 ? (
                        <p className="dashboard-status-text dashboard-status-text-empty">
                            No matching foods found.
                        </p>
                    ) : (
                        <div className="dashboard-list-grid">
                            {filteredFoods.map((food) => (
                                <div
                                    key={food.id || food.name}
                                    className="dashboard-list-card"
                                >
                                    <div>
                                        <p className="dashboard-list-card-title">{food.name}</p>
                                        <p className="dashboard-list-card-category">
                                            {food.category || "Uncategorized"}
                                        </p>
                                        <p className="dashboard-list-card-meta">
                                            {food.calories || food.cal || 0} cal · P{" "}
                                            {food.protein || food.protein_g || 0}g · C{" "}
                                            {food.carbs || food.carbs_g || 0}g · F{" "}
                                            {food.fat || food.fat_g || food.fats || 0}g
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => addCatalogFood(food)}
                                        className="dashboard-btn dashboard-btn-primary dashboard-btn-small"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {page === "recipes" && (
                <div className="dashboard-page-container dashboard-page-container-wide">
                    <h2 className="dashboard-page-title">Recipes</h2>
                    <p className="dashboard-page-subtitle">Browse available recipes</p>

                    <div className="dashboard-catalog-toolbar">
                        <div className="dashboard-catalog-toolbar-group">
                            <label className="dashboard-toolbar-label">Add to:</label>
                            <select
                                value={selectedRecipeMeal}
                                onChange={(e) => setSelectedRecipeMeal(e.target.value)}
                                className="dashboard-meal-select"
                            >
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>

                        <button
                            onClick={saveMealPlanToDatabase}
                            disabled={mealPlanSaving}
                            className="dashboard-btn dashboard-btn-primary"
                        >
                            {mealPlanSaving ? "Saving..." : "Save Meal Plan"}
                        </button>
                    </div>

                    {loadingRecipes ? (
                        <p className="dashboard-status-text">Loading recipes...</p>
                    ) : recipes.length === 0 ? (
                        <p className="dashboard-status-text dashboard-status-text-empty">
                            No recipes found.
                        </p>
                    ) : (
                        <div className="dashboard-list-grid">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe.id || recipe.name}
                                    className="dashboard-recipe-card"
                                >
                                    <p className="dashboard-list-card-title">{recipe.name}</p>
                                    <p className="dashboard-list-card-category">
                                        {recipe.category}
                                    </p>
                                    <p className="dashboard-recipe-description">
                                        {recipe.description}
                                    </p>
                                    <p className="dashboard-list-card-meta">
                                        {recipe.calories} cal · P {recipe.protein}g · C{" "}
                                        {recipe.carbs}g · F {recipe.fat || recipe.fats}g
                                    </p>

                                    <button
                                        onClick={() => addRecipeToMeal(recipe)}
                                        className="dashboard-btn dashboard-btn-primary dashboard-btn-small"
                                    >
                                        Add Recipe
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {page === "profile" && (
                <div className="dashboard-page-container dashboard-page-container-narrow">
                    <h2 className="dashboard-page-title">Profile</h2>
                    <p className="dashboard-page-subtitle">Manage your account</p>

                    {profileMsg && (
                        <div className="dashboard-success-banner">{profileMsg}</div>
                    )}
                    {profileError && (
                        <div className="dashboard-error-banner">{profileError}</div>
                    )}

                    <div className="dashboard-profile-card">
                        <p className="dashboard-profile-section-label">Account Info</p>

                        <label className="dashboard-profile-label">Email</label>
                        <input
                            type="email"
                            placeholder="you@email.com"
                            value={profile.email}
                            disabled
                            className="dashboard-form-control"
                        />
                        <p className="dashboard-page-subtitle">
                            Email cannot be changed here.
                        </p>

                        <label className="dashboard-profile-label">Full Name</label>
                        <input
                            placeholder="Your name"
                            value={profile.name}
                            onChange={(e) =>
                                setProfile({ ...profile, name: e.target.value })
                            }
                            className="dashboard-form-control"
                        />

                        <label className="dashboard-profile-label">Goal</label>
                        <select
                            value={profile.goal}
                            onChange={(e) =>
                                setProfile({ ...profile, goal: e.target.value })
                            }
                            className="dashboard-form-control"
                        >
                            <option value="">Select a goal</option>
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain">Gain Muscle</option>
                        </select>

                        <div className="dashboard-profile-actions">
                            <button
                                onClick={saveProfile}
                                disabled={profileSaving}
                                className="dashboard-btn dashboard-btn-primary"
                            >
                                {profileSaving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={() => alert("Delete account coming soon.")}
                                className="dashboard-btn dashboard-btn-outline"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>

                    <div className="dashboard-profile-card">
                        <p className="dashboard-profile-section-label">Account Stats</p>

                        <div className="dashboard-account-stats-grid">
                            {[
                                { label: "Meals Logged", value: allFoods.length },
                                { label: "Days Tracked", value: date ? 1 : 0 },
                                { label: "Total Calories", value: totalCal },
                                {
                                    label: "Goal",
                                    value: profile.goal
                                        ? profile.goal.charAt(0).toUpperCase() +
                                          profile.goal.slice(1)
                                        : "Not set",
                                },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="dashboard-account-stat-card"
                                >
                                    <p className="dashboard-account-stat-label">{label}</p>
                                    <p className="dashboard-account-stat-value">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}