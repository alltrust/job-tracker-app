import { screen, render } from "@testing-library/react";
import { AppProvider } from "../context/appContext";
import { createServer } from "../test/server";
import { MemoryRouter } from "react-router-dom";
import JobsContainer from "./JobsContainer";

const renderJobsContainer = () => {
  render(
    <AppProvider>
      <MemoryRouter>
        <JobsContainer />
      </MemoryRouter>
    </AppProvider>
  );
};

describe("Jobs container with no jobs", () => {

  createServer([
    {
      path: "http://localhost:4000/api/v1/jobs",
      res: () => {
        return {
          numOfPages: 1,
          totalJobs: 0,
          jobs: [],
        };
      },
    },
  ]);

  test("should contain no jobs with header displaying no jobs", async () => {
    renderJobsContainer();

    const noJobsHeader = await screen.findByRole("heading", {
      name: /no jobs to load yet.../i,
    });

    expect(noJobsHeader).toBeInTheDocument();
  });
});
