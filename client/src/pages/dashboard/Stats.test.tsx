import { screen, render, within } from "@testing-library/react";
import { AppProvider } from "../../context/appContext";
import Stats from "./Stats";
import { MemoryRouter } from "react-router-dom";
import toContainRole from "../../test/helpers/toContainRole";
import toContainRoleNames from "../../test/helpers/toContainerRoleNames";
import userEvent from "@testing-library/user-event";
import { createServer } from "../../test/server";

const renderStatsPage = () => {
  render(
    <AppProvider>
      <MemoryRouter>
        <Stats />
      </MemoryRouter>
    </AppProvider>
  );
};

expect.extend({ toContainRole, toContainRoleNames });

describe("empty Stats page", () => {
  createServer([
    {
      path: "http://localhost:4000/api/v1/jobs/stats",
      res: () => {
        return {
          defaultStats: { declined: 0, interview: 0, pending: 0 },
          monthlyApplications: [],
        };
      },
    },
  ]);

  test("should show loading spinner and stats containers on page render with no data", async () => {
    renderStatsPage();

    const loadingSpinner = screen.getByTestId("loading-spinner");
    expect(loadingSpinner).toBeInTheDocument();

    const chartsContainer = screen.queryByTestId("test-charts-container");

    const statsContainers = await screen.findAllByRole("article");

    expect(chartsContainer).not.toBeInTheDocument();
    expect(statsContainers).toHaveLength(3);
  });
});

describe("Stats page with data", () => {

  createServer([
    {
      path: "http://localhost:4000/api/v1/jobs/stats",
      res: () => {
        return {
          defaultStats: { declined: 2, interview: 10, pending: 2 },
          monthlyApplications: [{ date: "Mar 2023", count: 14 }],
        };
      },
    },
  ]);

  test("stats containers should display status quantities and charts container", async () => {
    renderStatsPage();

    const statsContainers = await screen.findAllByRole("article");
    const chartsContainer = await screen.findByTestId("test-charts-container");
    const monthlyAppsHeader = await screen.findByRole("heading", {
      name: /monthly applications/i,
    });
    const chartToggleBtn = await screen.findByRole("button", {
      name: /areachart/i,
    });

    expect(chartsContainer).toBeInTheDocument();
    expect(monthlyAppsHeader).toBeInTheDocument();
    expect(chartToggleBtn).toBeInTheDocument();

    expect(statsContainers[0]).toContainRole("heading", 1);
    expect(statsContainers[0]).toContainRoleNames("heading", [
      "pending applications",
    ]);
    const numOfjobsPendingCount = within(statsContainers[0]).getByText("2");
    expect(numOfjobsPendingCount).toHaveAttribute("class", "count");

    expect(statsContainers[1]).toContainRole("heading", 1);
    expect(statsContainers[1]).toContainRoleNames("heading", [
      "interviews scheduled",
    ]);
    const numOfInterviewsCount = within(statsContainers[1]).getByText("10");
    expect(numOfInterviewsCount).toHaveAttribute("class", "count");

    expect(statsContainers[2]).toContainRole("heading", 1);
    expect(statsContainers[2]).toContainRoleNames("heading", ["jobs declined"]);
    const numOfDeclinedCount = within(statsContainers[2]).getByText("2");
    expect(numOfDeclinedCount).toHaveAttribute("class", "count");
  });

  test("should have charts container toggle to area chart on click", async () => {
    renderStatsPage();

    const chartsContainer = await screen.findByTestId("test-charts-container");
    const chartToggleBtn = await screen.findByRole("button");

    expect(chartsContainer).toBeInTheDocument();
    expect(chartToggleBtn).toHaveAccessibleName(/areachart/i);

    userEvent.click(chartToggleBtn);

    expect(chartToggleBtn).toHaveAccessibleName(/barchart/i);
  });
});
