import { useState } from "react";
import "../styles/dashboard.css";

export default function Dashboard() {
    const [date, setDate] = useState("");
    const [showForm, setShowForm] = useState(false);

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

    const [toast, setToast] = useState("");

    const allFoods = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snack];
    const totalCal = allFoods.reduce((a, b) => a + b.cal, 0);
    const totalProtein = allFoods.reduce((a, b) => a + b.protein, 0);
    const totalCarbs = allFoods.reduce((a, b) => a + b.carbs, 0);
    const totalFats = allFoods.reduce((a, b) => a + b.fats, 0);

    function saveFood() {
        if (!form.name || !form.calories) {
            alert("Name and calories are required.");
            return;
        }

        const entry = {
            name: form.name,
            cal: Number(form.calories),
            protein: Number(form.protein) || 0,
            carbs: Number(form.carbs) || 0,
            fats: Number(form.fats) || 0,
        };

        setMeals({
            ...meals,
            [form.meal]: [...meals[form.meal], entry],
        });

        setForm({
            ...form,
            name: "",
            calories: "",
            protein: "",
            carbs: "",
            fats: "",
        });

        setShowForm(false);
        flash("Meal added.");
    }

    function flash(msg) {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    }

    function getRecs() {
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const recs = [];

        if (totalCal < 1000) {
            recs.push(
                "You're under your calorie goal. Try " +
                pick(["chicken with rice", "salmon with quinoa", "egg scramble with toast"]) +
                "."
            );
        }
        if (totalCal > 2000) recs.push("You've gone over your calorie goal. Consider lighter meals.");
        if (totalProtein < 75) {
            recs.push(
                "Protein is low. Try adding " +
                pick(["grilled chicken", "scrambled eggs", "Greek yogurt"]) +
                "."
            );
        }
        if (totalCarbs < 100) {
            recs.push("Carbs are low. Try " + pick(["brown rice", "oatmeal", "whole grain toast"]) + ".");
        }
        if (totalFats < 30) {
            recs.push("Healthy fats are low. Try " + pick(["avocado", "almonds", "peanut butter"]) + ".");
        }
        if (totalProtein >= 150) recs.push("Protein goal reached! Great job.");

        return recs;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-sidebar left">
                <div className="section-header">
                    <h2>Food Log</h2>
                    <button className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
                        + Add
                    </button>
                </div>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input"
                />

                {showForm && (
                    <div className="form-card">
                        <select
                            value={form.meal}
                            onChange={(e) => setForm({ ...form, meal: e.target.value })}
                            className="input"
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>

                        <input
                            className="input"
                            placeholder="Food name *"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <input
                            className="input"
                            placeholder="Calories *"
                            type="number"
                            value={form.calories}
                            onChange={(e) => setForm({ ...form, calories: e.target.value })}
                        />

                        <input
                            className="input"
                            placeholder="Protein (g)"
                            type="number"
                            value={form.protein}
                            onChange={(e) => setForm({ ...form, protein: e.target.value })}
                        />

                        <input
                            className="input"
                            placeholder="Carbs (g)"
                            type="number"
                            value={form.carbs}
                            onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                        />

                        <input
                            className="input"
                            placeholder="Fats (g)"
                            type="number"
                            value={form.fats}
                            onChange={(e) => setForm({ ...form, fats: e.target.value })}
                        />

                        <div className="button-row">
                            <button className="btn btn-dark full" onClick={saveFood}>
                                Save
                            </button>
                            <button className="btn btn-light full" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
                    <div key={meal} className="meal-card">
                        <div className="meal-card-header">
                            <b className="meal-title">{meal}</b>
                            <span className="muted-small">
                {meals[meal].reduce((a, b) => a + b.cal, 0)} kcal
              </span>
                        </div>

                        {meals[meal].length === 0 && <p className="empty-text">Nothing logged</p>}

                        {meals[meal].map((f, i) => (
                            <div key={i} className="meal-row">
                                <span>{f.name}</span>
                                <span className="muted-small">
                  {f.cal} cal
                  <button
                      className="icon-btn"
                      onClick={() =>
                          setMeals({
                              ...meals,
                              [meal]: meals[meal].filter((_, idx) => idx !== i),
                          })
                      }
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
                <h2>Today's Overview</h2>
                <p className="muted">{date || "No date selected"}</p>

                <div className="stats-grid">
                    {[
                        { label: "Calories", val: totalCal, unit: "", goal: 2000 },
                        { label: "Protein", val: totalProtein, unit: "g", goal: 150 },
                        { label: "Carbs", val: totalCarbs, unit: "g", goal: 225 },
                        { label: "Fats", val: totalFats, unit: "g", goal: 65 },
                    ].map((item) => (
                        <div key={item.label} className="stat-card">
                            <p className="stat-label">{item.label}</p>
                            <p className="stat-value">
                                {item.val}
                                {item.unit}
                                <span className="stat-goal">
                  {" "}
                                    / {item.goal}
                                    {item.unit}
                </span>
                            </p>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${Math.min((item.val / item.goal) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dashboard-sidebar right">
                <h2>Recommendations</h2>
                <p className="muted-small">Based on what you've logged</p>

                {allFoods.length === 0 && (
                    <p className="empty-message">Log food first to see recommendations.</p>
                )}

                {allFoods.length > 0 &&
                    getRecs().map((rec, i) => (
                        <div key={i} className="recommendation-card">
                            <p>{rec}</p>
                        </div>
                    ))}
            </div>

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}