import { render, screen } from "@testing-library/react";
import NotFound from "../pages/NotFound";

describe("NotFound", () => {
  test("renders 404 text", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
