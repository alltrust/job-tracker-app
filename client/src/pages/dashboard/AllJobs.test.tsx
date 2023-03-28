import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppProvider } from "../../context/appContext";
import AllJobs from "./AllJobs";
import toContainRole from "../../test/helpers/toContainRole";
import { createServer } from "../../test/server";
import { jobs } from "../../test/mockedJobs";
import userEvent from "@testing-library/user-event";

expect.extend({ toContainRole });

const renderAllJobs = () => {
  render(
    <AppProvider>
      <MemoryRouter>
        <AllJobs />
      </MemoryRouter>
    </AppProvider>
  );

};

describe("All jobs page appearance", () => {
  test("should have a search form on render", async () => {
    renderAllJobs();

    const loadingSpinner = screen.getByTestId("loading-spinner");

    const form = screen.getByTestId("test-search-form");
    const searchHeading = screen.getByRole("heading", { name: /search form/i });
    const clearBtn = screen.getByRole("button", { name: /clear filters/i });

    expect(form).toContainRole("textbox", 1);
    expect(form).toContainRole("combobox", 3);


    expect(loadingSpinner).toBeInTheDocument();
    expect(searchHeading).toBeInTheDocument();
    expect(clearBtn).toBeInTheDocument();
    expect(form).toBeInTheDocument();
  });
});

describe("All Jobs page", () => {
  const jobsPerPage = 4

  createServer([
    {
      path: "http://localhost:4000/api/v1/jobs",
      res: (req) => {

        const searchQ = req.url.searchParams.get("search");

        const filteredViaSearch = jobs.filter(
          (job) =>
            job.position[0].toLocaleLowerCase() === searchQ?.toLowerCase()
        );

        const responseJobs =
          filteredViaSearch.length > 0 ? filteredViaSearch : jobs;


        const pageNums = Math.ceil(responseJobs.length/ jobsPerPage)

        return {
          numOfPages: pageNums,
          totalJobs: responseJobs.length,
          jobs: responseJobs,
        };
      },
    },
  ]);

  test("it should display users jobs on init", async () => {
    renderAllJobs();

    const variableHeader = `${jobs.length} job${jobs.length > 1 && "s"} found`;
    const numOfJobsHeading = await screen.findByRole("heading", {
      name: variableHeader,
    });

    const paginatedBtnContainer = screen.queryByTestId(
      "paginated-btn-container"
    );

    expect(paginatedBtnContainer).not.toBeInTheDocument()

    const jobsContainer = await screen.findByTestId("jobs-container");

    expect(numOfJobsHeading).toBeInTheDocument();
    expect(jobsContainer).toContainRole("article", jobs.length);
  });
  
  test("it should filter jobs to display based on user input in search form", async () => {
  renderAllJobs();

    await screen.findByTestId("jobs-container");

    const searchInput = screen.getByRole("textbox", { name: /search/i });

    const input = "B";

    userEvent.click(searchInput);
    userEvent.keyboard(input);

    const jobsContainer = await screen.findByTestId("jobs-container");
    const articlesDivs = await screen.findAllByRole("article")

    const variableHeader = `${articlesDivs.length} job${articlesDivs.length > 1 && "s"} found`
    const numOfJobsHeader = await screen.findByRole("heading", {name: variableHeader});

    expect(jobsContainer).toContainRole("article", articlesDivs.length);
    expect(numOfJobsHeader).toBeInTheDocument();
  });
});

