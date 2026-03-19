import { useState } from "react";

export default function App() {
    const [page, setPage] = useState("dashboard");
    const [adminTab, setAdminTab] = useState("users");
    const [date, setDate] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showAddFood, setShowAddFood] = useState(false);
    const [search, setSearch] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [catalogSearch, setCatalogSearch] = useState("");
    const [deleteModal, setDeleteModal] = useState(null);
    const [toast, setToast] = useState("");

    const [meals, setMeals] = useState({breakfast: [], lunch: [], dinner: [], snack: []});
    const [form, setForm] = useState({meal: "breakfast", name: "", calories: "", protein: "", carbs: "", fats: ""});
    const [profile, setProfile] = useState({name: "", email: "", goal: ""});
    const [users, setUsers] = useState([]);

    const [foods, setFoods] = useState([
        {id: 1, name: "Chicken Breast", cal: 200, protein: 38, carbs: 0, fats: 4, category: "Protein"},
        {id: 2, name: "Brown Rice", cal: 215, protein: 5, carbs: 45, fats: 2, category: "Carb"},
        {id: 3, name: "Scrambled Eggs", cal: 180, protein: 12, carbs: 2, fats: 13, category: "Protein"},
        {id: 4, name: "Oatmeal", cal: 150, protein: 5, carbs: 27, fats: 3, category: "Carb"},
        {id: 5, name: "Greek Yogurt", cal: 100, protein: 17, carbs: 6, fats: 1, category: "Dairy"},
        {id: 6, name: "Banana", cal: 89, protein: 1, carbs: 23, fats: 0, category: "Fruit"},
        {id: 7, name: "Salmon Fillet", cal: 350, protein: 40, carbs: 0, fats: 20, category: "Protein"},
        {id: 8, name: "Sweet Potato", cal: 180, protein: 4, carbs: 41, fats: 0, category: "Carb"},
    ]);

    const [newFood, setNewFood] = useState({name: "", cal: "", protein: "", carbs: "", fats: "", category: ""});

// Shared styles defined inside the component
    const inputStyle = {
        display: "block", width: "100%", padding: "8px 10px", marginBottom: 10,
        border: "1px solid #ddd", borderRadius: 6, fontSize: 13, boxSizing: "border-box"
    };

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
            fats: Number(form.fats) || 0
        };
        setMeals({...meals, [form.meal]: [...meals[form.meal], entry]});
        setForm({...form, name: "", calories: "", protein: "", carbs: "", fats: ""});
        setShowForm(false);
    }

    function saveNewFood() {
        if (!newFood.name || !newFood.cal) {
            alert("Name and calories are required.");
            return;
        }
        const entry = {
            id: foods.length + 1,
            name: newFood.name,
            cal: Number(newFood.cal),
            protein: Number(newFood.protein) || 0,
            carbs: Number(newFood.carbs) || 0,
            fats: Number(newFood.fats) || 0,
            category: newFood.category || "Other"
        };
        setFoods([...foods, entry]);
        setNewFood({name: "", cal: "", protein: "", carbs: "", fats: "", category: ""});
        setShowAddFood(false);
        flash('"' + newFood.name + '" added to catalog.');
    }

    function flash(msg) {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    }

    function getRecs() {
        const pick = function (arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        };
        const recs = [];
        if (totalCal < 1000) recs.push("You're under your calorie goal. Try " + pick(["chicken with rice", "salmon with quinoa", "egg scramble with toast"]) + ".");
        if (totalCal > 2000) recs.push("You've gone over your calorie goal. Consider lighter meals.");
        if (totalProtein < 75) recs.push("Protein is low. Try adding " + pick(["grilled chicken", "scrambled eggs", "Greek yogurt"]) + ".");
        if (totalCarbs < 100) recs.push("Carbs are low. Try " + pick(["brown rice", "oatmeal", "whole grain toast"]) + ".");
        if (totalFats < 30) recs.push("Healthy fats are low. Try " + pick(["avocado", "almonds", "peanut butter"]) + ".");
        if (totalProtein >= 150) recs.push("Protein goal reached! Great job.");
        return recs;
    }

    return (
        <div style={{fontFamily: "Arial, sans-serif", background: "#f5f5f5", minHeight: "100vh"}}>

            {/* Nav */}
            <div style={{
                background: "white",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                height: 52
            }}>
                <button onClick={() => setPage("dashboard")} style={{
                    background: "none",
                    border: "none",
                    borderBottom: page === "dashboard" ? "2px solid #333" : "2px solid transparent",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 12px",
                    height: 52,
                    color: page === "dashboard" ? "#111" : "#888"
                }}>Dashboard
                </button>
                <button onClick={() => setPage("catalog")} style={{
                    background: "none",
                    border: "none",
                    borderBottom: page === "catalog" ? "2px solid #333" : "2px solid transparent",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 12px",
                    height: 52,
                    color: page === "catalog" ? "#111" : "#888"
                }}>Food Catalog
                </button>
                <button onClick={() => setPage("profile")} style={{
                    background: "none",
                    border: "none",
                    borderBottom: page === "profile" ? "2px solid #333" : "2px solid transparent",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 12px",
                    height: 52,
                    color: page === "profile" ? "#111" : "#888"
                }}>Profile
                </button>
                <div style={{width: 1, height: 24, background: "#ddd", margin: "0 8px"}}/>
                <button onClick={() => setPage("admin")} style={{
                    background: page === "admin" ? "#333" : "none",
                    border: page === "admin" ? "none" : "1px solid #ddd",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    padding: "5px 14px",
                    color: page === "admin" ? "white" : "#555",
                    fontWeight: page === "admin" ? "bold" : "normal"
                }}>Admin
                </button>
            </div>

            {/* Dashboard */}
            {page === "dashboard" && (
                <div style={{display: "flex", height: "calc(100vh - 52px)"}}>

                    {/* Left: Food Log */}
                    <div style={{
                        width: 280,
                        background: "white",
                        borderRight: "1px solid #ddd",
                        padding: 18,
                        overflowY: "auto"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 14
                        }}>
                            <h2 style={{margin: 0, fontSize: 16}}>Food Log</h2>
                            <button onClick={() => setShowForm(!showForm)} style={{
                                background: "#333",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 12px",
                                fontSize: 12,
                                cursor: "pointer"
                            }}>+ Add
                            </button>
                        </div>

                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                               style={{...inputStyle, marginBottom: 14}}/>

                        {showForm && (
                            <div style={{
                                background: "#f9f9f9",
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                padding: 14,
                                marginBottom: 14
                            }}>
                                <select value={form.meal} onChange={e => setForm({...form, meal: e.target.value})}
                                        style={inputStyle}>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>
                                <input placeholder="Food name *" value={form.name}
                                       onChange={e => setForm({...form, name: e.target.value})} style={inputStyle}/>
                                <input placeholder="Calories *" type="number" value={form.calories}
                                       onChange={e => setForm({...form, calories: e.target.value})} style={inputStyle}/>
                                <input placeholder="Protein (g)" type="number" value={form.protein}
                                       onChange={e => setForm({...form, protein: e.target.value})} style={inputStyle}/>
                                <input placeholder="Carbs (g)" type="number" value={form.carbs}
                                       onChange={e => setForm({...form, carbs: e.target.value})} style={inputStyle}/>
                                <input placeholder="Fats (g)" type="number" value={form.fats}
                                       onChange={e => setForm({...form, fats: e.target.value})} style={inputStyle}/>
                                <div style={{display: "flex", gap: 8}}>
                                    <button onClick={saveFood} style={{
                                        flex: 1,
                                        background: "#333",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: 8,
                                        cursor: "pointer"
                                    }}>Save
                                    </button>
                                    <button onClick={() => setShowForm(false)} style={{
                                        flex: 1,
                                        background: "#eee",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: 8,
                                        cursor: "pointer"
                                    }}>Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {["breakfast", "lunch", "dinner", "snack"].map(meal => (
                            <div key={meal} style={{
                                background: "#f9f9f9",
                                border: "1px solid #eee",
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 10
                            }}>
                                <div style={{display: "flex", justifyContent: "space-between", marginBottom: 6}}>
                                    <b style={{fontSize: 13, textTransform: "capitalize"}}>{meal}</b>
                                    <span style={{
                                        fontSize: 12,
                                        color: "#999"
                                    }}>{meals[meal].reduce((a, b) => a + b.cal, 0)} kcal</span>
                                </div>
                                {meals[meal].length === 0 &&
                                    <p style={{fontSize: 12, color: "#ccc", margin: 0, textAlign: "center"}}>Nothing
                                        logged</p>}
                                {meals[meal].map((f, i) => (
                                    <div key={i} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: 12,
                                        borderTop: "1px solid #eee",
                                        padding: "4px 0"
                                    }}>
                                        <span>{f.name}</span>
                                        <span style={{color: "#999"}}>
                                            {f.cal} cal
                                            <button onClick={() => setMeals({
                                                ...meals,
                                                [meal]: meals[meal].filter((_, idx) => idx !== i)
                                            })} style={{
                                                background: "none",
                                                border: "none",
                                                color: "#bbb",
                                                cursor: "pointer",
                                                marginLeft: 4
                                            }}>×</button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Center: Overview */}
                    <div style={{flex: 1, padding: 24, overflowY: "auto"}}>
                        <h2 style={{margin: "0 0 4px"}}>Today's Overview</h2>
                        <p style={{margin: "0 0 20px", fontSize: 13, color: "#999"}}>{date || "No date selected"}</p>

                        <div
                            style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20}}>
                            {[
                                {label: "Calories", val: totalCal, unit: "", goal: 2000},
                                {label: "Protein", val: totalProtein, unit: "g", goal: 150},
                                {label: "Carbs", val: totalCarbs, unit: "g", goal: 225},
                                {label: "Fats", val: totalFats, unit: "g", goal: 65},
                            ].map(function (item) {
                                return (
                                    <div key={item.label} style={{
                                        background: "white",
                                        border: "1px solid #eee",
                                        borderRadius: 10,
                                        padding: 14
                                    }}>
                                        <p style={{margin: "0 0 4px", fontSize: 11, color: "#999"}}>{item.label}</p>
                                        <p style={{margin: "0 0 8px", fontSize: 20, fontWeight: "bold"}}>
                                            {item.val}{item.unit} <span style={{
                                            fontSize: 13,
                                            color: "#aaa",
                                            fontWeight: "normal"
                                        }}>/ {item.goal}{item.unit}</span>
                                        </p>
                                        <div style={{height: 4, background: "#eee", borderRadius: 99}}>
                                            <div style={{
                                                width: Math.min((item.val / item.goal) * 100, 100) + "%",
                                                height: "100%",
                                                background: "#555",
                                                borderRadius: 99
                                            }}/>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {allFoods.length === 0 ? (
                            <div style={{
                                background: "white",
                                border: "1px solid #eee",
                                borderRadius: 10,
                                padding: 40,
                                textAlign: "center"
                            }}>
                                <p style={{color: "#bbb", marginBottom: 12}}>No meals logged yet</p>
                                <button onClick={() => setShowForm(true)} style={{
                                    background: "#333",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "9px 18px",
                                    cursor: "pointer"
                                }}>Log Your First Meal
                                </button>
                            </div>
                        ) : (
                            <div style={{background: "white", border: "1px solid #eee", borderRadius: 10, padding: 20}}>
                                <h3 style={{margin: "0 0 14px", fontSize: 14}}>Meal Breakdown</h3>
                                {["breakfast", "lunch", "dinner", "snack"].map(meal => {
                                    if (!meals[meal].length) return null;
                                    return (
                                        <div key={meal} style={{marginBottom: 12}}>
                                            <p style={{
                                                margin: "0 0 4px",
                                                fontWeight: "bold",
                                                fontSize: 13,
                                                textTransform: "capitalize"
                                            }}>{meal}</p>
                                            {meals[meal].map((f, i) => (
                                                <div key={i} style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    fontSize: 12,
                                                    color: "#555",
                                                    padding: "2px 0"
                                                }}>
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

                    {/* Right: Recommendations */}
                    <div style={{
                        width: 280,
                        background: "white",
                        borderLeft: "1px solid #ddd",
                        padding: 18,
                        overflowY: "auto"
                    }}>
                        <h2 style={{margin: "0 0 4px", fontSize: 16}}>Recommendations</h2>
                        <p style={{margin: "0 0 16px", fontSize: 12, color: "#999"}}>Based on what you've logged</p>
                        {allFoods.length === 0 &&
                            <p style={{color: "#bbb", fontSize: 13, textAlign: "center", marginTop: 40}}>Log food first
                                to see recommendations.</p>}
                        {allFoods.length > 0 && getRecs().length === 0 && (
                            <div
                                style={{background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 8, padding: 14}}>
                                <p style={{margin: 0, fontSize: 13, color: "#555"}}>You're on track with all your
                                    goals!</p>
                            </div>
                        )}
                        {allFoods.length > 0 && getRecs().map((rec, i) => (
                            <div key={i} style={{
                                background: "#f5f5f5",
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 8
                            }}>
                                <p style={{margin: 0, fontSize: 12, color: "#444", lineHeight: 1.5}}>{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Food Catalog */}
            {page === "catalog" && (
                <div style={{maxWidth: 880, margin: "0 auto", padding: 24}}>
                    <h2 style={{margin: "0 0 4px"}}>Food Catalog</h2>
                    <p style={{margin: "0 0 16px", fontSize: 13, color: "#999"}}>Browse foods and add them to your
                        log</p>
                    <input placeholder="Search by food or category..." value={search}
                           onChange={e => setSearch(e.target.value)}
                           style={{...inputStyle, maxWidth: 300, marginBottom: 20}}/>
                    {foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase())).map(food => (
                        <div key={food.id} style={{
                            background: "white",
                            border: "1px solid #eee",
                            borderRadius: 10,
                            padding: 16,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12
                        }}>
                            <div>
                                <p style={{margin: "0 0 4px", fontWeight: "bold", fontSize: 14}}>{food.name}</p>
                                <p style={{margin: "0 0 4px", fontSize: 12, color: "#888"}}>{food.category}</p>
                                <p style={{margin: 0, fontSize: 12, color: "#555"}}>{food.cal} cal · P {food.protein}g ·
                                    C {food.carbs}g · F {food.fats}g</p>
                            </div>
                            <button onClick={() => setMeals(function (prev) {
                                return {
                                    ...prev,
                                    lunch: [...prev.lunch, {
                                        name: food.name,
                                        cal: food.cal,
                                        protein: food.protein,
                                        carbs: food.carbs,
                                        fats: food.fats
                                    }]
                                };
                            })} style={{
                                background: "#333",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                padding: "8px 14px",
                                fontSize: 12,
                                cursor: "pointer"
                            }}>Add
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Profile */}
            {page === "profile" && (
                <div style={{maxWidth: 460, margin: "0 auto", padding: 24}}>
                    <h2 style={{margin: "0 0 4px"}}>Profile</h2>
                    <p style={{margin: "0 0 20px", fontSize: 13, color: "#999"}}>Manage your account</p>
                    <div style={{
                        background: "white",
                        border: "1px solid #eee",
                        borderRadius: 10,
                        padding: 20,
                        marginBottom: 16
                    }}>
                        <p style={{margin: "0 0 12px", fontSize: 12, color: "#999", textTransform: "uppercase"}}>Account
                            Info</p>
                        <label style={{fontSize: 13, fontWeight: "bold"}}>Email</label>
                        <input type="email" placeholder="you@email.com" value={profile.email}
                               onChange={e => setProfile({...profile, email: e.target.value})} style={inputStyle}/>
                        <label style={{fontSize: 13, fontWeight: "bold"}}>Full Name</label>
                        <input placeholder="Your name" value={profile.name}
                               onChange={e => setProfile({...profile, name: e.target.value})} style={inputStyle}/>
                        <label style={{fontSize: 13, fontWeight: "bold"}}>Goal</label>
                        <select value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value})}
                                style={inputStyle}>
                            <option value="">Select a goal</option>
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain">Gain Muscle</option>
                        </select>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 4
                        }}>
                            <button onClick={() => alert("Saved!")} style={{
                                background: "#333",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                padding: "8px 16px",
                                fontSize: 13,
                                cursor: "pointer"
                            }}>Save Changes
                            </button>
                            <button onClick={() => alert("Delete account coming soon.")} style={{
                                background: "none",
                                border: "1px solid #ddd",
                                color: "#999",
                                borderRadius: 6,
                                padding: "8px 16px",
                                fontSize: 13,
                                cursor: "pointer"
                            }}>Delete Account
                            </button>
                        </div>
                    </div>
                    <div style={{background: "white", border: "1px solid #eee", borderRadius: 10, padding: 20}}>
                        <p style={{margin: "0 0 14px", fontSize: 12, color: "#999", textTransform: "uppercase"}}>Account
                            Stats</p>
                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10}}>
                            <div style={{background: "#f9f9f9", borderRadius: 8, padding: 14}}>
                                <p style={{margin: "0 0 4px", fontSize: 11, color: "#999"}}>Meals Logged</p>
                                <p style={{margin: 0, fontSize: 18, fontWeight: "bold"}}>{allFoods.length}</p>
                            </div>
                            <div style={{background: "#f9f9f9", borderRadius: 8, padding: 14}}>
                                <p style={{margin: "0 0 4px", fontSize: 11, color: "#999"}}>Days Tracked</p>
                                <p style={{margin: 0, fontSize: 18, fontWeight: "bold"}}>{date ? 1 : 0}</p>
                            </div>
                            <div style={{background: "#f9f9f9", borderRadius: 8, padding: 14}}>
                                <p style={{margin: "0 0 4px", fontSize: 11, color: "#999"}}>Total Calories</p>
                                <p style={{margin: 0, fontSize: 18, fontWeight: "bold"}}>{totalCal}</p>
                            </div>
                            <div style={{background: "#f9f9f9", borderRadius: 8, padding: 14}}>
                                <p style={{margin: "0 0 4px", fontSize: 11, color: "#999"}}>Goal</p>
                                <p style={{
                                    margin: 0,
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    textTransform: "capitalize"
                                }}>{profile.goal || "Not set"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Dashboard */}
            {page === "admin" && (
                <div style={{maxWidth: 900, margin: "0 auto", padding: 24}}>
                    <h2 style={{margin: "0 0 4px"}}>Admin Dashboard</h2>
                    <p style={{margin: "0 0 20px", fontSize: 13, color: "#999"}}>Manage users and food catalog
                        entries</p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 24,
                        maxWidth: 320
                    }}>
                        <div style={{background: "white", border: "1px solid #eee", borderRadius: 10, padding: 14}}>
                            <p style={{margin: "0 0 4px", fontSize: 11, color: "#999"}}>Total Users</p>
                            <p style={{margin: 0, fontSize: 22, fontWeight: "bold"}}>{users.length}</p>
                        </div>
                        <div style={{background: "white", border: "1px solid #eee", borderRadius: 10, padding: 14}}>
                            <p style={{margin: "0 0 4px", fontSize: 11, color: "#999"}}>Food Entries</p>
                            <p style={{margin: 0, fontSize: 22, fontWeight: "bold"}}>{foods.length}</p>
                        </div>
                    </div>

                    {/* Sub tabs */}
                    <div style={{display: "flex", borderBottom: "1px solid #ddd", marginBottom: 20}}>
                        <button onClick={() => setAdminTab("users")} style={{
                            background: "none",
                            border: "none",
                            borderBottom: adminTab === "users" ? "2px solid #333" : "2px solid transparent",
                            cursor: "pointer",
                            fontSize: 14,
                            padding: "0 16px",
                            height: 40,
                            color: adminTab === "users" ? "#111" : "#888",
                            marginBottom: -1
                        }}>Users
                        </button>
                        <button onClick={() => setAdminTab("foods")} style={{
                            background: "none",
                            border: "none",
                            borderBottom: adminTab === "foods" ? "2px solid #333" : "2px solid transparent",
                            cursor: "pointer",
                            fontSize: 14,
                            padding: "0 16px",
                            height: 40,
                            color: adminTab === "foods" ? "#111" : "#888",
                            marginBottom: -1
                        }}>Food Catalog
                        </button>
                    </div>

                    {/* Users */}
                    {adminTab === "users" && (
                        <div>
                            <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 14}}>
                                <input placeholder="Search by name or email..." value={userSearch}
                                       onChange={e => setUserSearch(e.target.value)}
                                       style={{...inputStyle, maxWidth: 280, marginBottom: 0}}/>
                                <span style={{
                                    fontSize: 13,
                                    color: "#999"
                                }}>{users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).length} users</span>
                            </div>
                            <div style={{
                                background: "white",
                                border: "1px solid #eee",
                                borderRadius: 10,
                                overflow: "hidden"
                            }}>
                                <table style={{width: "100%", borderCollapse: "collapse", fontSize: 13}}>
                                    <thead>
                                    <tr style={{background: "#f9f9f9", borderBottom: "1px solid #eee"}}>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Name
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Email
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Joined
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                                        <tr key={u.id} style={{borderBottom: "1px solid #f3f3f3"}}>
                                            <td style={{padding: "11px 14px", fontWeight: "bold"}}>{u.name}</td>
                                            <td style={{padding: "11px 14px", color: "#555"}}>{u.email}</td>
                                            <td style={{padding: "11px 14px", color: "#999"}}>{u.joined}</td>
                                            <td style={{padding: "11px 14px"}}>
                                                <button onClick={() => setDeleteModal({
                                                    type: "user",
                                                    id: u.id,
                                                    name: u.name
                                                })} style={{
                                                    background: "none",
                                                    border: "1px solid #fca5a5",
                                                    borderRadius: 5,
                                                    padding: "4px 11px",
                                                    fontSize: 12,
                                                    cursor: "pointer",
                                                    color: "#dc2626"
                                                }}>Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Foods */}
                    {adminTab === "foods" && (
                        <div>
                            <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 14}}>
                                <input placeholder="Search by name or category..." value={catalogSearch}
                                       onChange={e => setCatalogSearch(e.target.value)}
                                       style={{...inputStyle, maxWidth: 280, marginBottom: 0}}/>
                                <span style={{
                                    fontSize: 13,
                                    color: "#999"
                                }}>{foods.filter(f => f.name.toLowerCase().includes(catalogSearch.toLowerCase()) || f.category.toLowerCase().includes(catalogSearch.toLowerCase())).length} entries</span>
                                <button onClick={() => setShowAddFood(!showAddFood)} style={{
                                    background: "#333",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "7px 14px",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    marginLeft: "auto"
                                }}>+ Add Food
                                </button>
                            </div>

                            {showAddFood && (
                                <div style={{
                                    background: "white",
                                    border: "1px solid #ddd",
                                    borderRadius: 10,
                                    padding: 18,
                                    marginBottom: 14
                                }}>
                                    <p style={{margin: "0 0 12px", fontSize: 13, fontWeight: "bold"}}>New Food Entry</p>
                                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10}}>
                                        <div>
                                            <label style={{fontSize: 12, color: "#666"}}>Food Name *</label>
                                            <input value={newFood.name}
                                                   onChange={e => setNewFood({...newFood, name: e.target.value})}
                                                   placeholder="e.g. Avocado"
                                                   style={{...inputStyle, marginBottom: 0, marginTop: 4}}/>
                                        </div>
                                        <div>
                                            <label style={{fontSize: 12, color: "#666"}}>Category</label>
                                            <select value={newFood.category}
                                                    onChange={e => setNewFood({...newFood, category: e.target.value})}
                                                    style={{...inputStyle, marginBottom: 0, marginTop: 4}}>
                                                <option value="">Select...</option>
                                                <option>Protein</option>
                                                <option>Carb</option>
                                                <option>Dairy</option>
                                                <option>Fruit</option>
                                                <option>Vegetable</option>
                                                <option>Fat</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{fontSize: 12, color: "#666"}}>Calories *</label>
                                            <input type="number" value={newFood.cal}
                                                   onChange={e => setNewFood({...newFood, cal: e.target.value})}
                                                   placeholder="kcal"
                                                   style={{...inputStyle, marginBottom: 0, marginTop: 4}}/>
                                        </div>
                                        <div>
                                            <label style={{fontSize: 12, color: "#666"}}>Protein (g)</label>
                                            <input type="number" value={newFood.protein}
                                                   onChange={e => setNewFood({...newFood, protein: e.target.value})}
                                                   style={{...inputStyle, marginBottom: 0, marginTop: 4}}/>
                                        </div>
                                        <div>
                                            <label style={{fontSize: 12, color: "#666"}}>Carbs (g)</label>
                                            <input type="number" value={newFood.carbs}
                                                   onChange={e => setNewFood({...newFood, carbs: e.target.value})}
                                                   style={{...inputStyle, marginBottom: 0, marginTop: 4}}/>
                                        </div>
                                        <div>
                                            <label style={{fontSize: 12, color: "#666"}}>Fats (g)</label>
                                            <input type="number" value={newFood.fats}
                                                   onChange={e => setNewFood({...newFood, fats: e.target.value})}
                                                   style={{...inputStyle, marginBottom: 0, marginTop: 4}}/>
                                        </div>
                                    </div>
                                    <div style={{display: "flex", gap: 8, marginTop: 14}}>
                                        <button onClick={saveNewFood} style={{
                                            background: "#333",
                                            color: "white",
                                            border: "none",
                                            borderRadius: 6,
                                            padding: "8px 18px",
                                            fontSize: 13,
                                            cursor: "pointer"
                                        }}>Save
                                        </button>
                                        <button onClick={() => {
                                            setShowAddFood(false);
                                            setNewFood({
                                                name: "",
                                                cal: "",
                                                protein: "",
                                                carbs: "",
                                                fats: "",
                                                category: ""
                                            });
                                        }} style={{
                                            background: "#eee",
                                            border: "none",
                                            borderRadius: 6,
                                            padding: "8px 16px",
                                            fontSize: 13,
                                            cursor: "pointer"
                                        }}>Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div style={{
                                background: "white",
                                border: "1px solid #eee",
                                borderRadius: 10,
                                overflow: "hidden"
                            }}>
                                <table style={{width: "100%", borderCollapse: "collapse", fontSize: 13}}>
                                    <thead>
                                    <tr style={{background: "#f9f9f9", borderBottom: "1px solid #eee"}}>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Name
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Category
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Calories
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Protein
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Carbs
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Fats
                                        </th>
                                        <th style={{
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 11,
                                            color: "#999",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}>Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {foods.filter(f => f.name.toLowerCase().includes(catalogSearch.toLowerCase()) || f.category.toLowerCase().includes(catalogSearch.toLowerCase())).map(f => (
                                        <tr key={f.id} style={{borderBottom: "1px solid #f3f3f3"}}>
                                            <td style={{padding: "11px 14px", fontWeight: "bold"}}>{f.name}</td>
                                            <td style={{padding: "11px 14px", color: "#555"}}>{f.category}</td>
                                            <td style={{padding: "11px 14px", color: "#555"}}>{f.cal}</td>
                                            <td style={{padding: "11px 14px", color: "#555"}}>{f.protein}g</td>
                                            <td style={{padding: "11px 14px", color: "#555"}}>{f.carbs}g</td>
                                            <td style={{padding: "11px 14px", color: "#555"}}>{f.fats}g</td>
                                            <td style={{padding: "11px 14px"}}>
                                                <button onClick={() => setDeleteModal({
                                                    type: "food",
                                                    id: f.id,
                                                    name: f.name
                                                })} style={{
                                                    background: "none",
                                                    border: "1px solid #fca5a5",
                                                    borderRadius: 5,
                                                    padding: "4px 11px",
                                                    fontSize: 12,
                                                    cursor: "pointer",
                                                    color: "#dc2626"
                                                }}>Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div onClick={e => {
                    if (e.target === e.currentTarget) setDeleteModal(null);
                }} style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 200
                }}>
                    <div style={{background: "white", borderRadius: 10, padding: 24, width: 340}}>
                        <p style={{
                            margin: "0 0 8px",
                            fontSize: 15,
                            fontWeight: "bold"
                        }}>Delete {deleteModal.type === "user" ? "User" : "Food"}?</p>
                        <p style={{margin: "0 0 20px", fontSize: 13, color: "#666"}}>"{deleteModal.name}" will be
                            permanently deleted.</p>
                        <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
                            <button onClick={() => setDeleteModal(null)} style={{
                                border: "1px solid #ddd",
                                background: "white",
                                color: "#555",
                                borderRadius: 6,
                                padding: "7px 14px",
                                fontSize: 13,
                                cursor: "pointer"
                            }}>Cancel
                            </button>
                            <button onClick={() => {
                                if (deleteModal.type === "user") setUsers(function (prev) {
                                    return prev.filter(function (u) {
                                        return u.id !== deleteModal.id;
                                    });
                                });
                                if (deleteModal.type === "food") setFoods(function (prev) {
                                    return prev.filter(function (f) {
                                        return f.id !== deleteModal.id;
                                    });
                                });
                                flash('"' + deleteModal.name + '" deleted.');
                                setDeleteModal(null);
                            }} style={{
                                background: "#dc2626",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                padding: "7px 14px",
                                fontSize: 13,
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}>Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    background: "#333",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: 8,
                    fontSize: 13,
                    zIndex: 300
                }}>
                    {toast}
                </div>
            )}

        </div>
    );
}