import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Signup from "../pages/Signup";

const mockNavigate = vi.fn();
const mockSignUp = vi.fn();

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
  signUp: (...args) => mockSignUp(...args),
  signInWithGoogle: vi.fn(),
}));

describe("Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    Storage.prototype.setItem = vi.fn();
  });

  test("renders signup form", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Create account/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /CREATE ACCOUNT/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Sign up with Google/i })
    ).toBeInTheDocument();
  });

  test("shows validation error when email or password is missing", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /CREATE ACCOUNT/i }));

    expect(
      screen.getByText(/Please enter your email and password/i)
    ).toBeInTheDocument();

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test("calls signUp and navigates to dashboard on success", async () => {
    mockSignUp.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /CREATE ACCOUNT/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith("new@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("shows auth error when signUp fails", async () => {
    mockSignUp.mockRejectedValueOnce(new Error("Firebase: Email already in use"));

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "used@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /CREATE ACCOUNT/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already in use/i)).toBeInTheDocument();
    });
  });
});
