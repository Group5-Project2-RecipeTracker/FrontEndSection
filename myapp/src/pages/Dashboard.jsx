import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.jsx";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";

export default function Dashboard() {
    const [profile, setProfile] = useState({ name: "", email: "", goal: "" });
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState("");
    const [profileError, setProfileError] = useState("");



    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setProfile({
                name: user.displayName || "",
                email: user.email || "",
                goal: localStorage.getItem("userGoal") || ""
            });
        }
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


    const [page, setPage] = useState("dashboard");
    const [date, setDate] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedMeal, setSelectedMeal] = useState("lunch");

    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
    });

    const [form, setForm] = useState({
        meal: "breakfast",
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
    });

    const [foods, setFoods] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(true);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadFoods();
        loadRecipes();
    }, []);

    async function loadFoods() {
        try {
            setLoadingFoods(true);
            const data = await api.getFoods();
            setFoods(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(`Failed to load foods: ${err.message}`);
        } finally {
            setLoadingFoods(false);
        }
    }

    async function loadRecipes() {
        try {
            setLoadingRecipes(true);
            const data = await api.getRecipes();
            setRecipes(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(`Failed to load recipes: ${err.message}`);
        } finally {
            setLoadingRecipes(false);
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
            category: food.category || ""
        };
        setMeals(prev => ({
            ...prev,
            [targetMeal]: [...prev[targetMeal], newFood]
        }));
    }

    const filteredFoods = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return foods;
        return foods.filter(food => {
            const name = (food.name || "").toLowerCase();
            const category = (food.category || "").toLowerCase();
            return name.includes(q) || category.includes(q);
        });
    }, [foods, search]);

    const allFoods = [
        ...meals.breakfast,
        ...meals.lunch,
        ...meals.dinner,
        ...meals.snack
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
            fats: Number(form.fats) || 0
        };
        setMeals({
            ...meals,
            [form.meal]: [...meals[form.meal], newFood]
        });
        setForm({ ...form, name: "", calories: "", protein: "", carbs: "", fats: "" });
        setShowForm(false);
    }

    function removeFood(meal, index) {
        const updated = meals[meal].filter((_, i) => i !== index);
        setMeals({ ...meals, [meal]: updated });
    }

    function getRecs() {
        const recs = [];
        const proteinFoods = ["grilled chicken", "scrambled eggs", "Greek yogurt", "tuna sandwich", "beans or lentils"];
        const carbFoods = ["brown rice", "oatmeal", "whole grain toast", "banana", "sweet potatoes"];
        const fatFoods = ["avocado", "almonds or walnuts", "peanut butter", "olive oil", "chia seeds"];
        const balancedMeals = ["chicken with rice and vegetables", "salmon with quinoa", "turkey sandwich with avocado", "tofu stir fry with rice", "egg scramble with toast"];
        function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
        if (totalCal < 1000) recs.push("You're under your calorie goal. Try something like " + random(balancedMeals) + ".");
        if (totalCal > 2000) recs.push("You've gone over your calorie goal today. Consider lighter meals like grilled chicken salad or vegetables with lean protein.");
        if (totalProtein < 75) recs.push("Protein is low. Try adding " + random(proteinFoods) + ".");
        if (totalCarbs < 100) recs.push("Carbs are low. A good option could be " + random(carbFoods) + ".");
        if (totalFats < 30) recs.push("Healthy fats are low. Try adding " + random(fatFoods) + ".");
        if (totalProtein >= 150) recs.push("Protein goal reached! Great job hitting your target.");
        return recs;
    }

    const inputStyle = {
        display: "block",
        width: "100%",
        padding: "8px 10px",
        marginBottom: 10,
        border: "1px solid #ddd",
        borderRadius: 6,
        fontSize: 13,
        boxSizing: "border-box"
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
            {/* Nav */}
            <div style={{ background: "white", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", padding: "0 20px", height: 52 }}>
                {["dashboard", "catalog", "recipes", "profile"].map(p => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{
                            background: "none",
                            border: "none",
                            borderBottom: page === p ? "2px solid #333" : "2px solid transparent",
                            cursor: "pointer",
                            fontSize: 14,
                            padding: "0 12px",
                            height: 52,
                            color: page === p ? "#111" : "#888",
                            textTransform: "capitalize"
                        }}
                    >
                        {p === "catalog" ? "Food Catalog" : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>

            {error && (
                <div style={{ background: "#fff4f4", border: "1px solid #e5bcbc", color: "#8a1f1f", padding: 12, margin: 16, borderRadius: 8 }}>
                    {error}
                </div>
            )}

            {/* Dashboard */}
            {page === "dashboard" && (
                <div style={{ display: "flex", height: "calc(100vh - 52px)" }}>
                    {/* Left - Food Log */}
                    <div style={{ width: 280, background: "white", borderRight: "1px solid #ddd", padding: 18, overflowY: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                            <h2 style={{ margin: 0, fontSize: 16 }}>Food Log</h2>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
                            >
                                + Add
                            </button>
                        </div>

                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            style={{ ...inputStyle, marginBottom: 14 }}
                        />

                        {showForm && (
                            <div style={{ background: "#f9f9f9", border: "1px solid #ddd", borderRadius: 8, padding: 14, marginBottom: 14 }}>
                                <select value={form.meal} onChange={e => setForm({ ...form, meal: e.target.value })} style={inputStyle}>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>
                                <input placeholder="Food name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                                <input placeholder="Calories *" type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} style={inputStyle} />
                                <input placeholder="Protein (g)" type="number" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} style={inputStyle} />
                                <input placeholder="Carbs (g)" type="number" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} style={inputStyle} />
                                <input placeholder="Fats (g)" type="number" value={form.fats} onChange={e => setForm({ ...form, fats: e.target.value })} style={inputStyle} />
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={saveFood} style={{ flex: 1, background: "#333", color: "white", border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>Save</button>
                                    <button onClick={() => setShowForm(false)} style={{ flex: 1, background: "#eee", border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>Cancel</button>
                                </div>
                            </div>
                        )}

                        {["breakfast", "lunch", "dinner", "snack"].map(meal => (
                            <div key={meal} style={{ background: "#f9f9f9", border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                    <b style={{ fontSize: 13, textTransform: "capitalize" }}>{meal}</b>
                                    <span style={{ fontSize: 12, color: "#999" }}>{meals[meal].reduce((a, b) => a + b.cal, 0)} kcal</span>
                                </div>
                                {meals[meal].length === 0 && (
                                    <p style={{ fontSize: 12, color: "#ccc", margin: 0, textAlign: "center" }}>Nothing logged</p>
                                )}
                                {meals[meal].map((f, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderTop: "1px solid #eee", padding: "4px 0" }}>
                                        <span>{f.name}</span>
                                        <span style={{ color: "#999" }}>
                                            {f.cal} cal
                                            <button onClick={() => removeFood(meal, i)} style={{ background: "none", border: "none", color: "#bbb", cursor: "pointer", marginLeft: 4 }}>×</button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Center - Overview */}
                    <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
                        <h2 style={{ margin: "0 0 4px" }}>Today's Overview</h2>
                        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#999" }}>{date || "No date selected"}</p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                            {[
                                { label: "Calories", value: totalCal, goal: 2000, unit: "" },
                                { label: "Protein", value: totalProtein, goal: 150, unit: "g" },
                                { label: "Carbs", value: totalCarbs, goal: 225, unit: "g" },
                                { label: "Fats", value: totalFats, goal: 65, unit: "g" }
                            ].map(({ label, value, goal, unit }) => (
                                <div key={label} style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 14 }}>
                                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>{label}</p>
                                    <p style={{ margin: "0 0 8px", fontSize: 20, fontWeight: "bold" }}>
                                        {value}{unit} <span style={{ fontSize: 13, color: "#aaa", fontWeight: "normal" }}>/ {goal}{unit}</span>
                                    </p>
                                    <div style={{ height: 4, background: "#eee", borderRadius: 99 }}>
                                        <div style={{ width: Math.min((value / goal) * 100, 100) + "%", height: "100%", background: "#555", borderRadius: 99 }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {allFoods.length === 0 ? (
                            <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 40, textAlign: "center" }}>
                                <p style={{ color: "#bbb", marginBottom: 12 }}>No meals logged yet</p>
                                <button onClick={() => setShowForm(true)} style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: "9px 18px", cursor: "pointer" }}>
                                    Log Your First Meal
                                </button>
                            </div>
                        ) : (
                            <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 20 }}>
                                <h3 style={{ margin: "0 0 14px", fontSize: 14 }}>Meal Breakdown</h3>
                                {["breakfast", "lunch", "dinner", "snack"].map(meal => {
                                    if (meals[meal].length === 0) return null;
                                    return (
                                        <div key={meal} style={{ marginBottom: 12 }}>
                                            <p style={{ margin: "0 0 4px", fontWeight: "bold", fontSize: 13, textTransform: "capitalize" }}>{meal}</p>
                                            {meals[meal].map((f, i) => (
                                                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", padding: "2px 0" }}>
                                                    <span>{f.name}</span>
                                                    <span>{f.cal} cal · P {f.protein}g · C {f.carbs}g · F {f.fats}g</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right - Recommendations */}
                    <div style={{ width: 280, background: "white", borderLeft: "1px solid #ddd", padding: 18, overflowY: "auto" }}>
                        <h2 style={{ margin: "0 0 4px", fontSize: 16 }}>Recommendations</h2>
                        <p style={{ margin: "0 0 16px", fontSize: 12, color: "#999" }}>Based on what you've logged</p>
                        {allFoods.length === 0 && (
                            <p style={{ color: "#bbb", fontSize: 13, textAlign: "center", marginTop: 40 }}>Log food first to see recommendations.</p>
                        )}
                        {allFoods.length > 0 && getRecs().length === 0 && (
                            <div style={{ background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 8, padding: 14 }}>
                                <p style={{ margin: 0, fontSize: 13, color: "#555" }}>You're on track with all your goals!</p>
                            </div>
                        )}
                        {allFoods.length > 0 && getRecs().map((rec, i) => (
                            <div key={i} style={{ background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                                <p style={{ margin: 0, fontSize: 12, color: "#444", lineHeight: 1.5 }}>{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Food Catalog - live from API */}
            {page === "catalog" && (
                <div style={{ maxWidth: 880, margin: "0 auto", padding: 24 }}>
                    <h2 style={{ margin: "0 0 4px" }}>Food Catalog</h2>
                    <p style={{ margin: "0 0 16px", fontSize: 13, color: "#999" }}>Browse foods and add them to your log</p>

                    <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
                        <input
                            placeholder="Search by food or category..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ ...inputStyle, maxWidth: 300, marginBottom: 0 }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <label style={{ fontSize: 13 }}>Add to:</label>
                            <select value={selectedMeal} onChange={e => setSelectedMeal(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>
                    </div>

                    {loadingFoods ? (
                        <p style={{ color: "#999" }}>Loading foods...</p>
                    ) : filteredFoods.length === 0 ? (
                        <p style={{ color: "#bbb", fontSize: 13 }}>No matching foods found.</p>
                    ) : (
                        <div style={{ display: "grid", gap: 12 }}>
                            {filteredFoods.map(food => (
                                <div key={food.id || food.name} style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <p style={{ margin: "0 0 4px", fontWeight: "bold", fontSize: 14 }}>{food.name}</p>
                                        <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888" }}>{food.category || "Uncategorized"}</p>
                                        <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
                                            {food.calories || food.cal || 0} cal · P {food.protein || 0}g · C {food.carbs || 0}g · F {food.fat || food.fats || 0}g
                                        </p>
                                    </div>
                                    <button onClick={() => addCatalogFood(food)} style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer" }}>
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Recipes - live from API */}
            {page === "recipes" && (
                <div style={{ maxWidth: 880, margin: "0 auto", padding: 24 }}>
                    <h2 style={{ margin: "0 0 4px" }}>Recipes</h2>
                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "#999" }}>Browse available recipes</p>
                    {loadingRecipes ? (
                        <p style={{ color: "#999" }}>Loading recipes...</p>
                    ) : recipes.length === 0 ? (
                        <p style={{ color: "#bbb", fontSize: 13 }}>No recipes found.</p>
                    ) : (
                        <div style={{ display: "grid", gap: 12 }}>
                            {recipes.map(recipe => (
                                <div key={recipe.id || recipe.name} style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
                                    <p style={{ margin: "0 0 4px", fontWeight: "bold", fontSize: 14 }}>{recipe.name}</p>
                                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888" }}>{recipe.category}</p>
                                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>{recipe.description}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
                                        {recipe.calories} cal · P {recipe.protein}g · C {recipe.carbs}g · F {recipe.fat || recipe.fats}g
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Profile */}
            {page === "profile" && (
                <div style={{ maxWidth: 460, margin: "0 auto", padding: 24 }}>
                    <h2 style={{ margin: "0 0 4px" }}>Profile</h2>
                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "#999" }}>Manage your account</p>

                    {profileMsg && (
                        <div style={{ background: "#f3fff3", border: "1px solid #bdddbd", color: "#1e5d1e", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                            {profileMsg}
                        </div>
                    )}
                    {profileError && (
                        <div style={{ background: "#fff4f4", border: "1px solid #e5bcbc", color: "#8a1f1f", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                            {profileError}
                        </div>
                    )}

                    <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 20, marginBottom: 16 }}>
                        <p style={{ margin: "0 0 12px", fontSize: 12, color: "#999", textTransform: "uppercase" }}>Account Info</p>

                        <label style={{ fontSize: 13, fontWeight: "bold" }}>Email</label>
                        <input
                            type="email"
                            placeholder="you@email.com"
                            value={profile.email}
                            disabled
                            style={{ ...inputStyle, color: "#999", background: "#f9f9f9", cursor: "not-allowed" }}
                        />
                        <p style={{ fontSize: 11, color: "#bbb", marginTop: -6, marginBottom: 12 }}>Email cannot be changed here.</p>

                        <label style={{ fontSize: 13, fontWeight: "bold" }}>Full Name</label>
                        <input
                            placeholder="Your name"
                            value={profile.name}
                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={{ fontSize: 13, fontWeight: "bold" }}>Goal</label>
                        <select
                            value={profile.goal}
                            onChange={e => setProfile({ ...profile, goal: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Select a goal</option>
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain">Gain Muscle</option>
                        </select>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                            <button
                                onClick={saveProfile}
                                disabled={profileSaving}
                                style={{
                                    background: profileSaving ? "#888" : "#333",
                                    color: "white", border: "none", borderRadius: 6,
                                    padding: "8px 16px", fontSize: 13,
                                    cursor: profileSaving ? "not-allowed" : "pointer"
                                }}
                            >
                                {profileSaving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={() => alert("Delete account coming soon.")}
                                style={{ background: "none", border: "1px solid #ddd", color: "#999", borderRadius: 6, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>

                    <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 20 }}>
                        <p style={{ margin: "0 0 14px", fontSize: 12, color: "#999", textTransform: "uppercase" }}>Account Stats</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {[
                                { label: "Meals Logged", value: allFoods.length },
                                { label: "Days Tracked", value: date ? 1 : 0 },
                                { label: "Total Calories", value: totalCal },
                                { label: "Goal", value: profile.goal ? profile.goal.charAt(0).toUpperCase() + profile.goal.slice(1) : "Not set" }
                            ].map(({ label, value }) => (
                                <div key={label} style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>{label}</p>
                                    <p style={{ margin: 0, fontSize: 18, fontWeight: "bold" }}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}