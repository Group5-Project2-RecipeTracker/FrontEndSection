import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { api } from "../lib/api.jsx";
import { auth } from "../firebase";
import "../styles/Admin.css";

export default function Admin() {
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(
        auth.currentUser?.email === "admin@email.com"
    );
    const [activeTab, setActiveTab] = useState("foods");
    const [foods, setFoods] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(true);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [foodSearch, setFoodSearch] = useState("");
    const [recipeSearch, setRecipeSearch] = useState("");

    const [foodForm, setFoodForm] = useState({
        name: "",
        index: "",
        category: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        pictureURL: "",
    });

    const [recipeForm, setRecipeForm] = useState({
        name: "",
        category: "",
        description: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
    });

    useEffect(() => {
        let mounted = true;

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
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    function loadFoods() {
        setLoadingFoods(true);
        api
            .getFoods()
            .then((data) => {
                setFoods(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                setError(`Failed to load foods: ${err.message}`);
            })
            .finally(() => {
                setLoadingFoods(false);
            });
    }

    function loadRecipes() {
        setLoadingRecipes(true);
        api
            .getRecipes()
            .then((data) => {
                setRecipes(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                setError(`Failed to load recipes: ${err.message}`);
            })
            .finally(() => {
                setLoadingRecipes(false);
            });
    }

    function handleFoodSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            name: foodForm.name,
            index: Number(foodForm.index || 0),
            category: foodForm.category,
            calories: Number(foodForm.calories || 0),
            protein: Number(foodForm.protein || 0),
            carbs: Number(foodForm.carbs || 0),
            fat: Number(foodForm.fat || 0),
            pictureURL: foodForm.pictureURL,
        };

        api
            .createFood(payload)
            .then(() => {
                setMessage("Food created successfully.");
                setFoodForm({
                    name: "",
                    index: "",
                    category: "",
                    calories: "",
                    protein: "",
                    carbs: "",
                    fat: "",
                    pictureURL: "",
                });
                loadFoods();
            })
            .catch((err) => {
                setError(`Failed to create food: ${err.message}`);
            });
    }

    function handleRecipeSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            name: recipeForm.name,
            category: recipeForm.category,
            description: recipeForm.description,
            calories: Number(recipeForm.calories || 0),
            protein: Number(recipeForm.protein || 0),
            carbs: Number(recipeForm.carbs || 0),
            fat: Number(recipeForm.fat || 0),
        };

        api
            .createRecipe(payload)
            .then(() => {
                setMessage("Recipe created successfully.");
                setRecipeForm({
                    name: "",
                    category: "",
                    description: "",
                    calories: "",
                    protein: "",
                    carbs: "",
                    fat: "",
                });
                loadRecipes();
            })
            .catch((err) => {
                setError(`Failed to create recipe: ${err.message}`);
            });
    }

    function handleFoodDelete(id) {
        setError("");
        setMessage("");

        api
            .deleteFood(id)
            .then(() => {
                setMessage("Food deleted successfully.");
                loadFoods();
            })
            .catch((err) => {
                setError(`Failed to delete food: ${err.message}`);
            });
    }

    function handleRecipeDelete(id) {
        setError("");
        setMessage("");

        api
            .deleteRecipe(id)
            .then(() => {
                setMessage("Recipe deleted successfully.");
                loadRecipes();
            })
            .catch((err) => {
                setError(`Failed to delete recipe: ${err.message}`);
            });
    }

    const filteredFoods = useMemo(() => {
        const q = foodSearch.trim().toLowerCase();
        if (!q) return foods;

        return foods.filter((food) => {
            const name = (food.name || "").toLowerCase();
            const category = (food.category || "").toLowerCase();
            return name.includes(q) || category.includes(q);
        });
    }, [foods, foodSearch]);

    const filteredRecipes = useMemo(() => {
        const q = recipeSearch.trim().toLowerCase();
        if (!q) return recipes;

        return recipes.filter((recipe) => {
            const name = (recipe.name || "").toLowerCase();
            const category = (recipe.category || "").toLowerCase();
            const description = (recipe.description || "").toLowerCase();
            return name.includes(q) || category.includes(q) || description.includes(q);
        });
    }, [recipes, recipeSearch]);

    return (
        <div className="admin-page">
            <div className="admin-topbar">
                <h1>Admin</h1>
                {isAdmin && (
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="admin-button admin-button-primary"
                    >
                        Dashboard
                    </button>
                )}
            </div>

            {message && <div className="admin-alert admin-alert-success">{message}</div>}
            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            <div className="admin-tabs">
                <button
                    type="button"
                    className={`admin-tab ${activeTab === "foods" ? "active" : ""}`}
                    onClick={() => setActiveTab("foods")}
                >
                    Foods
                </button>
                <button
                    type="button"
                    className={`admin-tab ${activeTab === "recipes" ? "active" : ""}`}
                    onClick={() => setActiveTab("recipes")}
                >
                    Recipes
                </button>
            </div>

            {activeTab === "foods" && (
                <>
                    <div className="admin-section">
                        <h2 className="admin-section-title">Create Food</h2>

                        <form onSubmit={handleFoodSubmit} className="admin-form">
                            <input
                                className="admin-input"
                                placeholder="Name"
                                value={foodForm.name}
                                onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                                required
                            />
                            <input
                                className="admin-input"
                                placeholder="Index"
                                type="number"
                                value={foodForm.index}
                                onChange={(e) => setFoodForm({ ...foodForm, index: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Category"
                                value={foodForm.category}
                                onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Calories"
                                type="number"
                                value={foodForm.calories}
                                onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Protein"
                                type="number"
                                value={foodForm.protein}
                                onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Carbs"
                                type="number"
                                value={foodForm.carbs}
                                onChange={(e) => setFoodForm({ ...foodForm, carbs: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Fat"
                                type="number"
                                value={foodForm.fat}
                                onChange={(e) => setFoodForm({ ...foodForm, fat: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Picture URL"
                                value={foodForm.pictureURL}
                                onChange={(e) => setFoodForm({ ...foodForm, pictureURL: e.target.value })}
                            />

                            <div className="admin-form-actions">
                                <button type="submit" className="admin-button admin-button-primary">
                                    Create Food
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2 className="admin-section-title">Current Foods</h2>
                            <input
                                className="admin-search"
                                placeholder="Search foods..."
                                value={foodSearch}
                                onChange={(e) => setFoodSearch(e.target.value)}
                            />
                        </div>

                        {loadingFoods ? (
                            <p>Loading foods...</p>
                        ) : filteredFoods.length === 0 ? (
                            <p>No matching foods found.</p>
                        ) : (
                            <div className="admin-list">
                                {filteredFoods.map((food) => (
                                    <div key={food.id || food.index} className="admin-card">
                                        <div>
                                            <strong>{food.name}</strong>
                                            <div className="admin-meta">
                                                {food.category} | {food.calories || food.cal || 0} cal | P{" "}
                                                {food.protein || food.protein_g || 0} | C {food.carbs || food.carbs_g || 0} | F{" "}
                                                {food.fat || food.fat_g || 0}
                                            </div>
                                            <div className="admin-id">{food.id}</div>
                                        </div>

                                        <button
                                            onClick={() => handleFoodDelete(food.id)}
                                            className="admin-button admin-button-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTab === "recipes" && (
                <>
                    <div className="admin-section">
                        <h2 className="admin-section-title">Create Recipe</h2>

                        <form onSubmit={handleRecipeSubmit} className="admin-form">
                            <input
                                className="admin-input"
                                placeholder="Recipe Name"
                                value={recipeForm.name}
                                onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                                required
                            />
                            <input
                                className="admin-input"
                                placeholder="Category"
                                value={recipeForm.category}
                                onChange={(e) => setRecipeForm({ ...recipeForm, category: e.target.value })}
                            />
                            <input
                                className="admin-input admin-input-full"
                                placeholder="Description"
                                value={recipeForm.description}
                                onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Calories"
                                type="number"
                                value={recipeForm.calories}
                                onChange={(e) => setRecipeForm({ ...recipeForm, calories: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Protein"
                                type="number"
                                value={recipeForm.protein}
                                onChange={(e) => setRecipeForm({ ...recipeForm, protein: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Carbs"
                                type="number"
                                value={recipeForm.carbs}
                                onChange={(e) => setRecipeForm({ ...recipeForm, carbs: e.target.value })}
                            />
                            <input
                                className="admin-input"
                                placeholder="Fat"
                                type="number"
                                value={recipeForm.fat}
                                onChange={(e) => setRecipeForm({ ...recipeForm, fat: e.target.value })}
                            />

                            <div className="admin-form-actions">
                                <button type="submit" className="admin-button admin-button-primary">
                                    Create Recipe
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2 className="admin-section-title">Current Recipes</h2>
                            <input
                                className="admin-search"
                                placeholder="Search recipes..."
                                value={recipeSearch}
                                onChange={(e) => setRecipeSearch(e.target.value)}
                            />
                        </div>

                        {loadingRecipes ? (
                            <p>Loading recipes...</p>
                        ) : filteredRecipes.length === 0 ? (
                            <p>No matching recipes found.</p>
                        ) : (
                            <div className="admin-list">
                                {filteredRecipes.map((recipe) => (
                                    <div key={recipe.id || recipe.name} className="admin-card">
                                        <div>
                                            <strong>{recipe.name}</strong>
                                            <div className="admin-meta">
                                                {recipe.category} | {recipe.calories || 0} cal | P {recipe.protein || 0} | C{" "}
                                                {recipe.carbs || 0} | F {recipe.fat || recipe.fats || 0}
                                            </div>
                                            <div className="admin-description">{recipe.description}</div>
                                            <div className="admin-id">{recipe.id}</div>
                                        </div>

                                        <button
                                            onClick={() => handleRecipeDelete(recipe.id)}
                                            className="admin-button admin-button-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}