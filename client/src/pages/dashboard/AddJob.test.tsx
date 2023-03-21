import { screen, render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AllContext, AppContext } from "../../context/appContext";
import { mock } from "jest-mock-extended";
import { initialState } from "../../context/appContext";
import AddJob from "./AddJob";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";

const renderAddJob = (props?: any) => {
  const mockedProps = mock<AllContext>(props || initialState);

  render(
    <AppContext.Provider value={mockedProps}>
      <MemoryRouter>
        <AddJob />
      </MemoryRouter>
    </AppContext.Provider>
  );
};

const inputTextNames = ["Position", "Company", "Location"];
const inputSelectNames = ["Status", "Job Type"];
const buttonNames = ["submit", "clear"];

const toContainRole = (container: HTMLElement, role: string, quantity = 1) => {
  const elements = within(container).queryAllByRole(role);

  let isElementInForm = true;

  if (elements.length === quantity && isElementInForm) {
    return { pass: true, message: () => "success." };
  }

  return {
    pass: false,
    message: () =>
      `expected to find ${quantity} ${role} elements. Found ${elements.length}`,
  };
};

const toContainRoleNames = (
  container: HTMLElement,
  role: string,
  names: string[]
) => {
  let returnValue = {
    pass: true,
    message: () => "",
  };

  for (let name of names) {
    const element = within(container).queryByRole(role, {
      name: new RegExp(`${name}`),
    });

    if (!element) {
      returnValue = {
        pass: false,
        message: () => ` expected to find ${names} with role ${role}.`,
      };
    }
    return returnValue;
  }
  return returnValue;
};

expect.extend({ toContainRole, toContainRoleNames });

describe("Add Job page", () => {
  // test("should render the form with all its displayed functionality", () => {
  //   renderAddJob();

  //   const addJobHeader = screen.getByRole("heading", { name: /add job/i });
  //   const form = screen.getByRole("form");

  //   expect(form).toContainRole("textbox", 3);
  //   expect(form).toContainRole("combobox", 2);
  //   expect(form).toContainRole("button", 2);

  //   expect(form).toContainRoleNames("textbox", inputTextNames);
  //   expect(form).toContainRoleNames("combobox", inputSelectNames);
  //   expect(form).toContainRoleNames("button", buttonNames);

  //   expect(addJobHeader).toBeInTheDocument();
  // });

  //test the clear functionality
  test("inputs should clear when on clear button click", async() => {
    // const user = userEvent.setup()

    renderAddJob();

    const positionInput = screen.getByRole("textbox", { name: /position/i });
    const companyInput = screen.getByRole("textbox", { name: /company/i });
    const locationInput = screen.getByRole("textbox", { name: /location/i });

    const clearBtn = screen.getByRole("button", { name: /clear/i });

    userEvent.click(positionInput);
    userEvent.keyboard("software test");

    userEvent.click(companyInput);
    userEvent.keyboard("testing company");

    userEvent.click(locationInput);
    userEvent.keyboard("testing location");

    // userEvent.click(clearBtn);

    expect(positionInput).toHaveValue("");
    expect(companyInput).toHaveValue("");
    expect(locationInput).toHaveValue("");

    screen.debug()
  });
  // test("heading is edit job if isEditing is true", () => {
  //   const props = { ...initialState, isEditing: true };

  //   renderAddJob(props);

  //   const editJobHeader = screen.getByRole("heading", { name: /edit job/i });

  //   expect(editJobHeader).toBeInTheDocument();
  // });

  // //test alert
  // test("displayAlert is called if form is submitted with empty fields", () => {
  //   const displayAlert = jest.fn();
  //   const props = { ...initialState, displayAlert };

  //   renderAddJob(props);

  //   const submitBtn = screen.getByRole("button", { name: /submit/i });
  //   userEvent.click(submitBtn);

  //   expect(displayAlert).toHaveBeenCalled();
  // });
});

// describe("addJob page on submit", () => {
//   const handlers = [
//     rest.post("/api/v1/jobs", (req, res, ctx) => {
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

//   test("should call createJob if user is not editing", async () => {
//     const createJob = jest.fn();

//     const props = {
//       ...initialState,
//       createJob,
//     };

//     renderAddJob(props);

//     const position = "testing";
//     const company = "testing co";
//     const location = "location";

//     const positionInput = screen.getByRole("textbox", { name: /position/i });
//     const companyInput = screen.getByRole("textbox", { name: /company/i });
//     const locationInput = screen.getByRole("textbox", { name: /location/i });

//     const submitBtn = screen.getByRole("button", { name: /submit/i });

//     userEvent.click(positionInput);
//     userEvent.keyboard(position);

//     userEvent.click(companyInput);
//     userEvent.keyboard(company);

//     userEvent.click(locationInput);
//     userEvent.keyboard(location);

//     userEvent.click(submitBtn);

//     screen.debug()

//     expect(createJob).toHaveBeenCalled();
//   });
// });
