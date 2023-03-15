import Register from "./Register";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppContext} from "../context/appContext";
import user from "@testing-library/user-event";
import { AllContext } from "../context/appContext";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { mock } from "jest-mock-extended";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderRegister(prop:any) {
  const mockedProps = mock<AllContext>(prop);

    render(
      <AppContext.Provider value={mockedProps}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AppContext.Provider>
    );
  // }
}

test("Register heading is rendered on screen", () => {
  renderRegister({});

  const headingElement = screen.getByText("Register");

  expect(headingElement).toBeInTheDocument();
});

test("Page toggles 'Login' and 'Register' heading if the button for the member is clicked", () => {
  renderRegister({});

  const headingElement = screen.getByRole("heading");
  const toggleButton = screen.getByRole("button", { name: "Login" });
  expect(headingElement).toBeInTheDocument();

  userEvent.click(toggleButton);
  const RegisterHeadingElement = screen.getByRole("heading", {
    name: "Login",
  });

  expect(RegisterHeadingElement).toBeInTheDocument();
});

test("Alert with danger class is shown if form is submitted is with fields empty", () => {
  const alertType = "danger"
  const props = {alertType}

  renderRegister(props);
  

  const submitButton = screen.getByRole("button", { name: "Submit" });
  userEvent.click(submitButton);

  const AlertDiv = screen.getByRole("alert");

  expect(AlertDiv).toBeInTheDocument()
  expect(AlertDiv).toHaveAttribute("class", "alert alert-danger")
});



describe("when user clicks Sign in button", () => {
  const handlers = [
    rest.post("/api/v1/auth/register", (req, res, ctx) => {
      return res(ctx.json({}));
    }),
  ];

  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test("setUpUser function should be called and succes Alert displays", async () => {
    const setUpUser = jest.fn();
    const showAlert = true;
    const alertType = "success";
    const props = { setUpUser, showAlert, alertType };

    renderRegister(props);

    const submitButton = screen.getByRole("button", { name: /submit/i });

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
    const passwordInput = screen.getByLabelText(/password/i);

    const name = "owner";
    const email = "owner@test.com";
    const password = "apassword";

    user.click(nameInput);
    user.keyboard(name);

    user.click(emailInput);
    user.keyboard(email);

    user.click(passwordInput);
    user.keyboard(password);

    userEvent.click(submitButton);

    const alertElement = await screen.findByRole("alert");

    const currentUser = setUpUser.mock.calls[0][0].currentUser;
    const expectedCurrentUser = { name, email, password };

    expect(currentUser).toEqual(expectedCurrentUser);
    expect(setUpUser).toHaveBeenCalled();

    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveAttribute("class", "alert alert-success");
  });
  test("should redirect to '/' if theres a user", async() => {
    jest.useFakeTimers();

    const user = {
      name: "name",
      lastName: "lastName",
      location: "location",
      email: "email",
      password: "password",
    };
    const props = {user}

    renderRegister(props);
    expect(mockedUsedNavigate).not.toBeCalled()
    
    jest.advanceTimersByTime(2000)
    
    expect(mockedUsedNavigate).toBeCalled()
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/")
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1)
  });
});
