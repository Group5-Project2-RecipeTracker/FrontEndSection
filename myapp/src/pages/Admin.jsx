import { useEffect, useState } from "react";
import { api } from "../lib/api.jsx";

export default function Admin() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    index: "",
    category: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    pictureURL: "",
  });

  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    try {
      setLoading(true);
      const data = await api.getFoods();
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Failed to load foods: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        name: form.name,
        index: Number(form.index || 0),
        category: form.category,
        calories: Number(form.calories || 0),
        protein: Number(form.protein || 0),
        carbs: Number(form.carbs || 0),
        fat: Number(form.fat || 0),
        pictureURL: form.pictureURL,
      };

      await api.createFood(payload);
      setMessage("Food created successfully.");
      setForm({
        name: "",
        index: "",
        category: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        pictureURL: "",
      });
      await loadFoods();
    } catch (err) {
      setError(`Failed to create food: ${err.message}`);
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      setMessage("");
      await api.deleteFood(id);
      setMessage("Food deleted successfully.");
      await loadFoods();
    } catch (err) {
      setError(`Failed to delete food: ${err.message}`);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const sectionStyle = {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Admin</h1>
      <p style={{ color: "#555" }}>Manage foods in the live Firestore database.</p>

      {message && (
        <div
          style={{
            background: "#f3fff3",
            border: "1px solid #bdddbd",
            color: "#1e5d1e",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fff4f4",
            border: "1px solid #e5bcbc",
            color: "#8a1f1f",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>Create Food</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <input
            style={inputStyle}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            style={inputStyle}
            placeholder="Index"
            type="number"
            value={form.index}
            onChange={(e) => setForm({ ...form, index: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Calories"
            type="number"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Protein"
            type="number"
            value={form.protein}
            onChange={(e) => setForm({ ...form, protein: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Carbs"
            type="number"
            value={form.carbs}
            onChange={(e) => setForm({ ...form, carbs: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Fat"
            type="number"
            value={form.fat}
            onChange={(e) => setForm({ ...form, fat: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Picture URL"
            value={form.pictureURL}
            onChange={(e) => setForm({ ...form, pictureURL: e.target.value })}
          />

          <div style={{ gridColumn: "1 / -1" }}>
            <button
              type="submit"
              style={{
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              Create Food
            </button>
          </div>
        </form>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>Current Foods</h2>

        {loading ? (
          <p>Loading foods...</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {foods.map((food) => (
              <div
                key={food.id || food.index}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <strong>{food.name}</strong>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    {food.category} | {food.calories} cal | P {food.protein} | C {food.carbs} | F {food.fat}
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>{food.id}</div>
                </div>

                <button
                  onClick={() => handleDelete(food.id)}
                  style={{
                    background: "#fff",
                    color: "#8a1f1f",
                    border: "1px solid #d7a8a8",
                    borderRadius: 6,
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}