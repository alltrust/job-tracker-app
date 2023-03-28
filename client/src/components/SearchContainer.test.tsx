import { render, screen } from "@testing-library/react";
import { AppProvider } from "../context/appContext";
import { MemoryRouter } from "react-router-dom";
import toContainRole from "../test/helpers/toContainRole";
import toContainRoleNames from "../test/helpers/toContainerRoleNames";
import SearchContainer from "./SearchContainer";
import userEvent from "@testing-library/user-event";

const renderSearchContainer = () => {
  render(
    <AppProvider>
      <MemoryRouter>
        <SearchContainer />
      </MemoryRouter>
    </AppProvider>
  );

  const searchInput = screen.getByRole("textbox", { name: /search/i });
  const searchForm = screen.getByTestId("test-search-form");
  const jobStatusSelect = screen.getByRole("combobox", { name: /job status/i });
  const jobTypeSelect = screen.getByRole("combobox", { name: /job type/i });
  const sortSelect = screen.getByRole("combobox", { name: /sort/i });

  return {
    searchInput,
    searchForm,
    jobStatusSelect,
    jobTypeSelect,
    sortSelect,
  };
};

const sortOptions = ["latest", "oldest", "a-z", "z-a"];
const jobTypeOptions = [
  "all",
  "full-time",
  "part-time",
  "remote",
  "internship",
];
const jobStatusOptions = ["all", "pending", "interview", "declined"];

expect.extend({ toContainRole, toContainRoleNames });

describe("search Container", () => {
  test("it should have default values with inputs and options", () => {
    const {
      searchForm,
      searchInput,
      jobStatusSelect,
      jobTypeSelect,
      sortSelect,
    } = renderSearchContainer();

    expect(searchForm).toBeInTheDocument();

    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("");

    expect(jobStatusSelect).toBeInTheDocument();
    expect(jobStatusSelect).toHaveValue("all");
    expect(jobStatusSelect).toContainRole("option", 4);
    expect(jobStatusSelect).toContainRoleNames("option", jobStatusOptions);

    expect(jobTypeSelect).toBeInTheDocument();
    expect(jobTypeSelect).toHaveValue("all");
    expect(jobTypeSelect).toContainRole("option", 5);
    expect(jobTypeSelect).toContainRoleNames("option", jobTypeOptions);

    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveValue("latest");
    expect(sortSelect).toContainRole("option", 4);
    expect(sortSelect).toContainRoleNames("option", sortOptions);
  });
  test("should change values on user input, and clear on button click", () => {
    const { searchInput, jobStatusSelect, jobTypeSelect, sortSelect } =
      renderSearchContainer();

    userEvent.click(searchInput);
    userEvent.keyboard("test");
    expect(searchInput).toHaveValue("test");

    userEvent.selectOptions(jobStatusSelect, "interview");
    expect(jobStatusSelect).toHaveValue("interview");

    userEvent.selectOptions(jobTypeSelect, "remote");
    expect(jobTypeSelect).toHaveValue("remote");

    userEvent.selectOptions(sortSelect, "oldest");
    expect(sortSelect).toHaveValue("oldest");

    const clearBtn = screen.getByRole("button", { name: /clear filters/i });
    expect(clearBtn).toBeInTheDocument();

    userEvent.click(clearBtn);
    expect(searchInput).toHaveValue("")
    expect(jobStatusSelect).toHaveValue("all");
    expect(sortSelect).toHaveValue("latest");
    expect(jobStatusSelect).toHaveValue("all");
  });
});
