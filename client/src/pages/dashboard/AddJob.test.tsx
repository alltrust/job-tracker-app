import {
  screen,
  render,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mock } from "jest-mock-extended";
import { MemoryRouter } from "react-router-dom";
import {
  AppProvider,
  AppContext,
  initialState,
  AllContext,
} from "../../context/appContext";
import AddJob from "./AddJob";
import toContainRole from "../../test/helpers/toContainRole";
import toContainRoleNames from "../../test/helpers/toContainerRoleNames";

const inputTextNames = ["Position", "Company", "Location"];
const inputSelectNames = ["Status", "Job Type"];
const buttonNames = ["submit", "clear"];



expect.extend({ toContainRole, toContainRoleNames });

const renderAddJob = () => {
  render(
    <AppProvider>
      <MemoryRouter>
        <AddJob />
      </MemoryRouter>
    </AppProvider>
  );
};

const renderAddJobWithProps = (props: any) => {
  const mockedProps = mock<AllContext>(props);

  render(
    <AppContext.Provider value={mockedProps}>
      <MemoryRouter>
        <AddJob />
      </MemoryRouter>
    </AppContext.Provider>
  );
};

describe("Add Job Page", () => {
  test("should render the form with all its displayed functionality", () => {

    renderAddJob();

    const addJobHeader = screen.getByRole("heading", { name: /add job/i });
    const form = screen.getByRole("form");

    expect(form).toContainRole("textbox", 3);
    expect(form).toContainRole("combobox", 2);
    expect(form).toContainRole("button", 2);

    expect(form).toContainRoleNames("textbox", inputTextNames);
    expect(form).toContainRoleNames("combobox", inputSelectNames);
    expect(form).toContainRoleNames("button", buttonNames);

    expect(addJobHeader).toBeInTheDocument();

  });
  test("it should test for values on user keyboard input", async () => {

    renderAddJob();

    const positionInput = screen.getByRole("textbox", { name: /position/i });
    const companyInput = screen.getByRole("textbox", { name: /company/i });
    const locationInput = screen.getByRole("textbox", { name: /location/i });

    userEvent.click(positionInput);
    userEvent.keyboard("value");

    userEvent.click(companyInput);
    userEvent.keyboard("test");

    userEvent.click(locationInput);
    userEvent.keyboard("location");

    expect(positionInput).toHaveValue("value");
    expect(companyInput).toHaveValue("test");
    expect(locationInput).toHaveValue("location");

    const clearBtn = screen.getByRole("button", { name: /clear/i });

    userEvent.click(clearBtn);
    expect(positionInput).toHaveValue("");
    expect(companyInput).toHaveValue("");

  });

  test("heading is edit job if isEditing is true", () => {

    const props = { ...initialState, isEditing: true };

    renderAddJobWithProps(props);

    const editJobHeader = screen.getByRole("heading", { name: /edit job/i });

    expect(editJobHeader).toBeInTheDocument();

  });

  test("alert is displayed in form is submitted with empty values", () => {

    renderAddJob();

    const alertDiv = screen.queryByRole("alert");
    expect(alertDiv).not.toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    userEvent.click(submitBtn);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();

  });
});

describe("on adding job", () => {

  test("should call createJob if user is not editing", async () => {

    const createJob = jest.fn();

    const position = "testing";
    const company = "testing co";
    const jobLocation = "location";

    const props = {
      ...initialState,
      position,
      company,
      jobLocation,
      createJob,
    };

    renderAddJobWithProps(props);

    const submitBtn = screen.getByRole("button", { name: /submit/i });

    userEvent.click(submitBtn);

    expect(createJob).toHaveBeenCalled();

  });
});

// describe("on editing Job", () => {
//   const handlers = [
//     rest.post("/api/v1/jobs/1", (req, res, ctx) => {
//       return res(ctx.status(200));
//     }),
//   ];

//   const server = setupServer(...handlers);

//   beforeAll(() => {
//     server.listen();
//   });

//   afterEach(() => {
//     server.resetHandlers();
//   });

//   afterAll(() => {
//     server.close();
//   });

//   test("should edit a current job", () => {

// renderAddJobWithProps()

//   });
// });
