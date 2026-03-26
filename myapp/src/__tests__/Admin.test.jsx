import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Admin from "../pages/Admin";

const mockNavigate = vi.fn();
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
    getFoods: vi.fn(),
    getRecipes: vi.fn(),
    createFood: vi.fn(),
    createRecipe: vi.fn(),
    deleteFood: vi.fn(),
    deleteRecipe: vi.fn(),
  },
}));

vi.mock("../firebase", () => ({
  auth: {
    currentUser: {
      email: "admin@email.com",
    },
  },
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
}));

import { api } from "../lib/api.jsx";

describe("Admin", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    api.getFoods.mockResolvedValue([
      { id: 1, name: "Banana", category: "Fruit", calories: 100, protein: 1, carbs: 27, fat: 0 },
    ]);

    api.getRecipes.mockResolvedValue([
      { id: 10, name: "Pasta", category: "Dinner", description: "Classic pasta", calories: 550, protein: 18, carbs: 70, fat: 14 },
    ]);

    api.createFood.mockResolvedValue({});
    api.createRecipe.mockResolvedValue({});
    api.deleteFood.mockResolvedValue({});
    api.deleteRecipe.mockResolvedValue({});

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: "admin@email.com" });
      return vi.fn();
    });
  });

  test("renders admin page and dashboard button for admin", async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();

    await waitFor(() => {
      expect(api.getFoods).toHaveBeenCalled();
      expect(api.getRecipes).toHaveBeenCalled();
    });
  });
});
