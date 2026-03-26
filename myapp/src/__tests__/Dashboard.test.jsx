import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Dashboard from "../pages/Dashboard";

const mockNavigate = vi.fn();
const mockUpdateProfile = vi.fn();
const mockOnAuthStateChanged = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../lib/api.jsx", () => ({
  api: {
    getMealPlan: vi.fn(),
    getFoods: vi.fn(),
    getRecipes: vi.fn(),
    saveMealPlan: vi.fn(),
  },
}));

vi.mock("../firebase", () => ({
  auth: {
    currentUser: {
      email: "user@example.com",
      displayName: "Test User",
    },
  },
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
  updateProfile: (...args) => mockUpdateProfile(...args),
}));

import { api } from "../lib/api.jsx";

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    api.getMealPlan.mockResolvedValue({
      meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
    });

    api.getFoods.mockResolvedValue([
      { id: 1, name: "Apple", category: "Fruit", calories: 95, protein: 0, carbs: 25, fat: 0 },
    ]);

    api.getRecipes.mockResolvedValue([
      { id: 1, name: "Chicken Bowl", category: "Lunch", description: "High protein", calories: 500, protein: 40, carbs: 45, fat: 12 },
    ]);

    api.saveMealPlan.mockResolvedValue({ success: true });

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({
        email: "user@example.com",
        displayName: "Test User",
      });
      return vi.fn();
    });

    Storage.prototype.getItem = vi.fn(() => "maintain");
    Storage.prototype.setItem = vi.fn();
    window.alert = vi.fn();
  });

  test("renders dashboard overview", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.getFoods).toHaveBeenCalled();
      expect(api.getRecipes).toHaveBeenCalled();
      expect(api.getMealPlan).toHaveBeenCalled();
    });
  });
});
