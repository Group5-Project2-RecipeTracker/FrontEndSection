import { useState } from "react";

export default function App() {
    const [page, setPage] = useState("dashboard");
    const [date, setDate] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");

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

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        goal: ""
    });

    function addCatalogFood(food, meal = "lunch") {
        const newFood = {
            name: food.name,
            cal: food.calories || food.cal,
            protein: food.protein_g || food.protein || 0,
            carbs: food.carbs_g || food.carbs || 0,
            fats: food.fat_g || food.fats || 0
        };

        setMeals(prev => ({
            ...prev,
            [meal]: [...prev[meal], newFood]
        }));
    }

    const foodCatalog = [
        { id: 1, name: "Chicken Breast", cal: 200, protein: 38, carbs: 0, fats: 4, category: "Protein" },
        { id: 2, name: "Brown Rice", cal: 215, protein: 5, carbs: 45, fats: 2, category: "Carb" },
        { id: 3, name: "Scrambled Eggs", cal: 180, protein: 12, carbs: 2, fats: 13, category: "Protein" },
        { id: 4, name: "Oatmeal", cal: 150, protein: 5, carbs: 27, fats: 3, category: "Carb" },
        { id: 5, name: "Greek Yogurt", cal: 100, protein: 17, carbs: 6, fats: 1, category: "Dairy" },
        { id: 6, name: "Banana", cal: 89, protein: 1, carbs: 23, fats: 0, category: "Fruit" },
        { id: 7, name: "Salmon Fillet", cal: 350, protein: 40, carbs: 0, fats: 20, category: "Protein" },
        { id: 8, name: "Sweet Potato", cal: 180, protein: 4, carbs: 41, fats: 0, category: "Carb" }
    ];

    const allFoods = [
        ...meals.breakfast,
        ...meals.lunch,
        ...meals.dinner,
        ...meals.snack
    ];

    const filteredFoods = foodCatalog.filter(food =>
        food.name.toLowerCase().includes(search.toLowerCase()) ||
        food.category.toLowerCase().includes(search.toLowerCase())
    );

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

        setForm({
            ...form,
            name: "",
            calories: "",
            protein: "",
            carbs: "",
            fats: ""
        });

        setShowForm(false);
    }

    function removeFood(meal, index) {
        const updated = meals[meal].filter((_, i) => i !== index);
        setMeals({ ...meals, [meal]: updated });
    }

    function getRecs() {
        const recs = [];

        const proteinFoods = [
            "grilled chicken",
            "scrambled eggs",
            "Greek yogurt",
            "tuna sandwich",
            "beans or lentils"
        ];

        const carbFoods = [
            "brown rice",
            "oatmeal",
            "whole grain toast",
            "banana",
            "sweet potatoes"
        ];

        const fatFoods = [
            "avocado",
            "almonds or walnuts",
            "peanut butter",
            "olive oil",
            "chia seeds"
        ];

        const balancedMeals = [
            "chicken with rice and vegetables",
            "salmon with quinoa",
            "turkey sandwich with avocado",
            "tofu stir fry with rice",
            "egg scramble with toast"
        ];

        function random(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        if (totalCal < 1000) {
            recs.push("You're under your calorie goal. Try something like " + random(balancedMeals) + ".");
        }

        if (totalCal > 2000) {
            recs.push("You've gone over your calorie goal today. Consider lighter meals like grilled chicken salad or vegetables with lean protein.");
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
            <div style={{ background: "white", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", padding: "0 20px", height: 52 }}>
                <button
                    onClick={() => setPage("dashboard")}
                    style={{
                        background: "none",
                        border: "none",
                        borderBottom: page === "dashboard" ? "2px solid #333" : "2px solid transparent",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "0 12px",
                        height: 52,
                        color: page === "dashboard" ? "#111" : "#888"
                    }}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setPage("catalog")}
                    style={{
                        background: "none",
                        border: "none",
                        borderBottom: page === "catalog" ? "2px solid #333" : "2px solid transparent",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "0 12px",
                        height: 52,
                        color: page === "catalog" ? "#111" : "#888"
                    }}
                >
                    Food Catalog
                </button>
                <button
                    onClick={() => setPage("profile")}
                    style={{
                        background: "none",
                        border: "none",
                        borderBottom: page === "profile" ? "2px solid #333" : "2px solid transparent",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "0 12px",
                        height: 52,
                        color: page === "profile" ? "#111" : "#888"
                    }}
                >
                    Profile
                </button>
            </div>

            {page === "dashboard" && (
                <div style={{ display: "flex", height: "calc(100vh - 52px)" }}>
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

                                <input
                                    placeholder="Food name *"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="Calories *"
                                    type="number"
                                    value={form.calories}
                                    onChange={e => setForm({ ...form, calories: e.target.value })}
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="Protein (g)"
                                    type="number"
                                    value={form.protein}
                                    onChange={e => setForm({ ...form, protein: e.target.value })}
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="Carbs (g)"
                                    type="number"
                                    value={form.carbs}
                                    onChange={e => setForm({ ...form, carbs: e.target.value })}
                                    style={inputStyle}
                                />
                                <input
                                    placeholder="Fats (g)"
                                    type="number"
                                    value={form.fats}
                                    onChange={e => setForm({ ...form, fats: e.target.value })}
                                    style={inputStyle}
                                />

                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={saveFood} style={{ flex: 1, background: "#333", color: "white", border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>
                                        Save
                                    </button>
                                    <button onClick={() => setShowForm(false)} style={{ flex: 1, background: "#eee", border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            {["breakfast", "lunch", "dinner", "snack"].map(meal => (
                                <div key={meal} style={{ background: "#f9f9f9", border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <b style={{ fontSize: 13, textTransform: "capitalize" }}>{meal}</b>
                                        <span style={{ fontSize: 12, color: "#999" }}>
                                            {meals[meal].reduce((a, b) => a + b.cal, 0)} kcal
                                        </span>
                                    </div>

                                    {meals[meal].length === 0 && (
                                        <p style={{ fontSize: 12, color: "#ccc", margin: 0, textAlign: "center" }}>Nothing logged</p>
                                    )}

                                    {meals[meal].map((f, i) => (
                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderTop: "1px solid #eee", padding: "4px 0" }}>
                                            <span>{f.name}</span>
                                            <span style={{ color: "#999" }}>
                                                {f.cal} cal
                                                <button
                                                    onClick={() => removeFood(meal, i)}
                                                    style={{ background: "none", border: "none", color: "#bbb", cursor: "pointer", marginLeft: 4 }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
                        <h2 style={{ margin: "0 0 4px" }}>Today's Overview</h2>
                        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#999" }}>{date || "No date selected"}</p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                            <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 14 }}>
                                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>Calories</p>
                                <p style={{ margin: "0 0 8px", fontSize: 20, fontWeight: "bold" }}>
                                    {totalCal} <span style={{ fontSize: 13, color: "#aaa", fontWeight: "normal" }}>/ 2000</span>
                                </p>
                                <div style={{ height: 4, background: "#eee", borderRadius: 99 }}>
                                    <div style={{ width: Math.min((totalCal / 2000) * 100, 100) + "%", height: "100%", background: "#555", borderRadius: 99 }} />
                                </div>
                            </div>

                            <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 14 }}>
                                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>Protein</p>
                                <p style={{ margin: "0 0 8px", fontSize: 20, fontWeight: "bold" }}>
                                    {totalProtein}g <span style={{ fontSize: 13, color: "#aaa", fontWeight: "normal" }}>/ 150g</span>
                                </p>
                                <div style={{ height: 4, background: "#eee", borderRadius: 99 }}>
                                    <div style={{ width: Math.min((totalProtein / 150) * 100, 100) + "%", height: "100%", background: "#555", borderRadius: 99 }} />
                                </div>
                            </div>

                            <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 14 }}>
                                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>Carbs</p>
                                <p style={{ margin: "0 0 8px", fontSize: 20, fontWeight: "bold" }}>
                                    {totalCarbs}g <span style={{ fontSize: 13, color: "#aaa", fontWeight: "normal" }}>/ 225g</span>
                                </p>
                                <div style={{ height: 4, background: "#eee", borderRadius: 99 }}>
                                    <div style={{ width: Math.min((totalCarbs / 225) * 100, 100) + "%", height: "100%", background: "#555", borderRadius: 99 }} />
                                </div>
                            </div>

                            <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 14 }}>
                                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>Fats</p>
                                <p style={{ margin: "0 0 8px", fontSize: 20, fontWeight: "bold" }}>
                                    {totalFats}g <span style={{ fontSize: 13, color: "#aaa", fontWeight: "normal" }}>/ 65g</span>
                                </p>
                                <div style={{ height: 4, background: "#eee", borderRadius: 99 }}>
                                    <div style={{ width: Math.min((totalFats / 65) * 100, 100) + "%", height: "100%", background: "#555", borderRadius: 99 }} />
                                </div>
                            </div>
                        </div>

                        {allFoods.length === 0 ? (
                            <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 40, textAlign: "center" }}>
                                <p style={{ color: "#bbb", marginBottom: 12 }}>No meals logged yet</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: "9px 18px", cursor: "pointer" }}
                                >
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

                    <div style={{ width: 280, background: "white", borderLeft: "1px solid #ddd", padding: 18, overflowY: "auto" }}>
                        <h2 style={{ margin: "0 0 4px", fontSize: 16 }}>Recommendations</h2>
                        <p style={{ margin: "0 0 16px", fontSize: 12, color: "#999" }}>Based on what you've logged</p>

                        {allFoods.length === 0 && (
                            <p style={{ color: "#bbb", fontSize: 13, textAlign: "center", marginTop: 40 }}>
                                Log food first to see recommendations.
                            </p>
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

            {page === "catalog" && (
                <div style={{ maxWidth: 880, margin: "0 auto", padding: 24 }}>
                    <h2 style={{ margin: "0 0 4px" }}>Food Catalog</h2>
                    <p style={{ margin: "0 0 16px", fontSize: 13, color: "#999" }}>
                        Browse foods and add them to your log
                    </p>

                    <input
                        placeholder="Search by food or category..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ ...inputStyle, maxWidth: 300, marginBottom: 20 }}
                    />

                    {filteredFoods.length === 0 ? (
                        <p style={{ color: "#bbb", fontSize: 13 }}>No matching foods found.</p>
                    ) : (
                        <div style={{ display: "grid", gap: 12 }}>
                            {filteredFoods.map(food => (
                                <div
                                    key={food.id}
                                    style={{
                                        background: "white",
                                        border: "1px solid #eee",
                                        borderRadius: 10,
                                        padding: 16,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div>
                                        <p style={{ margin: "0 0 4px", fontWeight: "bold", fontSize: 14 }}>
                                            {food.name}
                                        </p>
                                        <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888" }}>
                                            {food.category}
                                        </p>
                                        <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
                                            {food.cal} cal · P {food.protein}g · C {food.carbs}g · F {food.fats}g
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => addCatalogFood(food)}
                                        style={{
                                            background: "#333",
                                            color: "white",
                                            border: "none",
                                            borderRadius: 6,
                                            padding: "8px 14px",
                                            fontSize: 12,
                                            cursor: "pointer"
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {page === "profile" && (
                <div style={{ maxWidth: 460, margin: "0 auto", padding: 24 }}>
                    <h2 style={{ margin: "0 0 4px" }}>Profile</h2>
                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "#999" }}>Manage your account</p>

                    <div style={{ background: "white", border: "1px solid #eee", borderRadius: 10, padding: 20, marginBottom: 16 }}>
                        <p style={{ margin: "0 0 12px", fontSize: 12, color: "#999", textTransform: "uppercase" }}>Account Info</p>

                        <label style={{ fontSize: 13, fontWeight: "bold" }}>Email</label>
                        <input
                            type="email"
                            placeholder="you@email.com"
                            value={profile.email}
                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={{ fontSize: 13, fontWeight: "bold" }}>Full Name</label>
                        <input
                            placeholder="Your name"
                            value={profile.name}
                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={{ fontSize: 13, fontWeight: "bold" }}>Goal</label>
                        <select value={profile.goal} onChange={e => setProfile({ ...profile, goal: e.target.value })} style={inputStyle}>
                            <option value="">Select a goal</option>
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain">Gain Muscle</option>
                        </select>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                            <button
                                onClick={() => alert("Saved!")}
                                style={{ background: "#333", color: "white", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}
                            >
                                Save Changes
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
                            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>Meals Logged</p>
                                <p style={{ margin: 0, fontSize: 18, fontWeight: "bold" }}>{allFoods.length}</p>
                            </div>
                            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>Days Tracked</p>
                                <p style={{ margin: 0, fontSize: 18, fontWeight: "bold" }}>{date ? 1 : 0}</p>
                            </div>
                            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>Total Calories</p>
                                <p style={{ margin: 0, fontSize: 18, fontWeight: "bold" }}>{totalCal}</p>
                            </div>
                            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 14 }}>
                                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#999" }}>Goal</p>
                                <p style={{ margin: 0, fontSize: 18, fontWeight: "bold", textTransform: "capitalize" }}>{profile.goal || "Not set"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}