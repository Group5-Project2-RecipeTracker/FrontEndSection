import { useState } from "react";
import "../styles/FoodCatalog.css";

export default function FoodCatalog() {
    const [search, setSearch] = useState("");

    const [foods] = useState([
        { id: 1, name: "Chicken Breast", cal: 200, protein: 38, carbs: 0, fats: 4, category: "Protein" },
        { id: 2, name: "Brown Rice", cal: 215, protein: 5, carbs: 45, fats: 2, category: "Carb" },
        { id: 3, name: "Scrambled Eggs", cal: 180, protein: 12, carbs: 2, fats: 13, category: "Protein" },
        { id: 4, name: "Oatmeal", cal: 150, protein: 5, carbs: 27, fats: 3, category: "Carb" },
        { id: 5, name: "Greek Yogurt", cal: 100, protein: 17, carbs: 6, fats: 1, category: "Dairy" },
        { id: 6, name: "Banana", cal: 89, protein: 1, carbs: 23, fats: 0, category: "Fruit" },
        { id: 7, name: "Salmon Fillet", cal: 350, protein: 40, carbs: 0, fats: 20, category: "Protein" },
        { id: 8, name: "Sweet Potato", cal: 180, protein: 4, carbs: 41, fats: 0, category: "Carb" },
    ]);

    const filteredFoods = foods.filter(
        (f) =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="catalog-page">
            <div className="catalog-container">
                <h2 className="catalog-title">Food Catalog</h2>
                <p className="catalog-subtitle">Browse foods and add them to your log</p>

                <input
                    className="catalog-input"
                    placeholder="Search by food or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {filteredFoods.map((food) => (
                    <div key={food.id} className="catalog-card">
                        <div>
                            <p className="catalog-food-name">{food.name}</p>
                            <p className="catalog-food-category">{food.category}</p>
                            <p className="catalog-food-stats">
                                {food.cal} cal · P {food.protein}g · C {food.carbs}g · F {food.fats}g
                            </p>
                        </div>

                        <button
                            className="catalog-add-btn"
                            onClick={() => alert(`${food.name} added`)}
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}