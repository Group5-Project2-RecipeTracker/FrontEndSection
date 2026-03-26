import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "../pages/Login";

const mockNavigate = vi.fn();
const mockSignIn = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../firebase", () => ({
  auth: {},
  provider: {},
}));

vi.mock("firebase/auth", () => ({
  signInWithPopup: vi.fn(),
}));

vi.mock("../services/authService", () => ({
  signIn: (...args) => mockSignIn(...args),
  signInWithGoogle: vi.fn(),
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    Storage.prototype.setItem = vi.fn();
  });

  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Log In/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Welcome back to Recipe Tracker/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /LOG IN/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Continue with Google/i })
    ).toBeInTheDocument();
  });

  test("shows validation error when email or password is missing", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /LOG IN/i }));

    expect(
      screen.getByText(/Please enter your email and password/i)
    ).toBeInTheDocument();

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  test("calls signIn and navigates to dashboard on success", async () => {
    mockSignIn.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("@email");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /LOG IN/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("shows auth error when signIn fails", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("Firebase: Invalid credentials"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("@email"), {
      target: { value: "bad@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /LOG IN/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
