import Register from "./Register";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppContext, AppProvider } from "../context/appContext";
import user from "@testing-library/user-event";
import { AllContext } from "../context/appContext";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { mock } from "jest-mock-extended";

function renderRegister(prop?:{}) {
  const props = mock<AllContext>(prop);
  
  if (!prop) {
    render(
      <AppProvider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AppProvider>
    );
  } else {
    render(
      <AppContext.Provider value={props}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AppContext.Provider>
    );
  }
}

test("Register heading is rendered on screen", () => {
  renderRegister();

  const headingElement = screen.getByText("Register");

  expect(headingElement).toBeInTheDocument();
});

test("Page toggles 'Login' and 'Register' heading if the button for the member is clicked", () => {
  renderRegister();

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
  renderRegister();

  const submitButton = screen.getByRole("button", { name: "Submit" });
  userEvent.click(submitButton);

  const AlertDiv = screen.getByRole("alert");
  expect(AlertDiv.getAttribute("class")).toBe("alert alert-danger");
});

test("Alert should not be in form on page render", () => {
  renderRegister();

  const alertElement = screen.queryByRole("alert");
  expect(alertElement).not.toBeInTheDocument();
});

describe("when user clicks Sign in button", () => {
  const handlers = [
    rest.post("/api/v1/auth/register", (req, res, ctx) => {
      return res(
        ctx.json({})
      );
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
    const setUpUser = jest.fn()
    const showAlert = true;
    const alertType = "success"
    const props = {setUpUser, showAlert, alertType}

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

    const alertElement = await screen.findByRole("alert")


    const currentUser = setUpUser.mock.calls[0][0].currentUser;
    const expectedCurrentUser = { name, email, password };

    expect(currentUser).toEqual(expectedCurrentUser);
    expect(setUpUser).toHaveBeenCalled();

    expect(alertElement).toBeInTheDocument()
    expect(alertElement).toHaveAttribute("class", "alert alert-success")
  });
 
});
