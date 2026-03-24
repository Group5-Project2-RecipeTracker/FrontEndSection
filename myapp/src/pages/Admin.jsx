import { useState } from "react";
import "../styles/admin.css";

export default function Admin() {
    const [adminTab, setAdminTab] = useState("users");
    const [userSearch, setUserSearch] = useState("");
    const [catalogSearch, setCatalogSearch] = useState("");
    const [showAddFood, setShowAddFood] = useState(false);

    const [users, setUsers] = useState([]);

    const [foods, setFoods] = useState([
        { id: 1, name: "Chicken Breast", cal: 200, protein: 38, carbs: 0, fats: 4, category: "Protein" },
        { id: 2, name: "Brown Rice", cal: 215, protein: 5, carbs: 45, fats: 2, category: "Carb" },
    ]);

    const [newFood, setNewFood] = useState({
        name: "",
        cal: "",
        protein: "",
        carbs: "",
        fats: "",
        category: "",
    });

    function saveNewFood() {
        if (!newFood.name || !newFood.cal) return;

        const entry = {
            id: foods.length + 1,
            name: newFood.name,
            cal: Number(newFood.cal),
            protein: Number(newFood.protein) || 0,
            carbs: Number(newFood.carbs) || 0,
            fats: Number(newFood.fats) || 0,
            category: newFood.category || "Other",
        };

        setFoods([...foods, entry]);
        setNewFood({ name: "", cal: "", protein: "", carbs: "", fats: "", category: "" });
        setShowAddFood(false);
    }

    return (
        <div className="admin-container">
            <h2>Admin Dashboard</h2>
            <p className="muted">Manage users and food catalog</p>

            <div className="admin-stats">
                <div className="card">
                    <p>Total Users</p>
                    <h3>{users.length}</h3>
                </div>

                <div className="card">
                    <p>Food Entries</p>
                    <h3>{foods.length}</h3>
                </div>
            </div>

            <div className="admin-tabs">
                <button
                    className={adminTab === "users" ? "active" : ""}
                    onClick={() => setAdminTab("users")}
                >
                    Users
                </button>

                <button
                    className={adminTab === "foods" ? "active" : ""}
                    onClick={() => setAdminTab("foods")}
                >
                    Food Catalog
                </button>
            </div>

            {adminTab === "users" && (
                <div>
                    <input
                        className="input"
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                    />

                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                        </thead>

                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {adminTab === "foods" && (
                <div>
                    <div className="row">
                        <input
                            className="input"
                            placeholder="Search food..."
                            value={catalogSearch}
                            onChange={(e) => setCatalogSearch(e.target.value)}
                        />

                        <button className="button-dark" onClick={() => setShowAddFood(!showAddFood)}>
                            + Add Food
                        </button>
                    </div>

                    {showAddFood && (
                        <div className="card">
                            <input
                                className="input"
                                placeholder="Food name"
                                value={newFood.name}
                                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                            />

                            <input
                                className="input"
                                placeholder="Calories"
                                type="number"
                                value={newFood.cal}
                                onChange={(e) => setNewFood({ ...newFood, cal: e.target.value })}
                            />

                            <button className="button-dark" onClick={saveNewFood}>
                                Save
                            </button>
                        </div>
                    )}

                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Calories</th>
                        </tr>
                        </thead>

                        <tbody>
                        {foods.map((f) => (
                            <tr key={f.id}>
                                <td>{f.name}</td>
                                <td>{f.cal}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}