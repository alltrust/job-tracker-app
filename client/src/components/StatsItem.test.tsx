import { screen, render } from "@testing-library/react";
import StatsItem from "./StatsItem";
import { FaSuitcaseRolling } from "react-icons/fa";

describe("stat item lone component", () => {
  test("it should render with props", () => {
    const iconTest: JSX.Element = <FaSuitcaseRolling title="suitcase-icon" />;
    const title = "TEST ITEM";
    const count = 5;
    const bcg = "rgb(252, 239, 199)";
    const color = "rgb(233,185,73)";
    const icon = iconTest;
    const props = { iconTest, title, count, bcg, color, icon };

    render(<StatsItem {...props} />);

    const titleHeader = screen.getByRole("heading", { name: title });
    const article = screen.getByRole("article");
    const iconDiv = screen.getByTestId("icon-wrapper");

    const iconStyle = window.getComputedStyle(iconDiv);

    const articleStyle = window.getComputedStyle(article);
    const borderBottomColor = articleStyle.borderBottomColor;
    const borderBottomStyle = articleStyle.borderBottomStyle;
    const borderBottomWidth = articleStyle.borderBottomWidth;

    expect(borderBottomColor).toBe(color);
    expect(articleStyle.borderBottom).toBe(
      `${borderBottomWidth} ${borderBottomStyle} ${color}`
    );
    expect(iconStyle.background).toBe(bcg);

    expect(titleHeader).toBeInTheDocument();
    expect(article).toHaveAttribute("color", color);
  });
});
