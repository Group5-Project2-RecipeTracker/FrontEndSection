import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Projects from "../pages/Projects";

describe("Projects", () => {
  test("renders project list and back link", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
    expect(screen.getByText("Project Gamma")).toBeInTheDocument();
    expect(screen.getByText(/Back to Dashboard/i)).toBeInTheDocument();
  });

  test("renders links to project overview pages", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    expect(screen.getByText("Project Alpha").closest("a")).toHaveAttribute(
      "href",
      "/projects/alpha/overview"
    );
    expect(screen.getByText("Project Beta").closest("a")).toHaveAttribute(
      "href",
      "/projects/beta/overview"
    );
    expect(screen.getByText("Project Gamma").closest("a")).toHaveAttribute(
      "href",
      "/projects/gamma/overview"
    );
  });
});
