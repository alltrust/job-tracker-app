import { screen, render } from "@testing-library/react";
import App from "../App";

describe("App render", () => {
  test("it should display all content", () => {
    render(<App />);

    const logo = screen.getByAltText(/jobify/i);
    const heading = screen.getByRole("heading", { name: /job tracking app/i });
    const button = screen.getByRole("link", { name: /login\/register/i });

    expect(logo).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/register");
  });
});

