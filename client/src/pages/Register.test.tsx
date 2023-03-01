import Register from "./Register";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppProvider } from "../context/appContext";
import user from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";

interface IRenderRegister {
  prop?: jest.Mock<any, any> | (()=>{});
}

function renderRegister(prop?: IRenderRegister) {
  render(
    <AppProvider value={prop}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </AppProvider>
  );

  // afterEach(()=>{
  //   cleanup()
  // })
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
        ctx.json({
          user: {
            name: "someTest",
            email: "please@test.com",
            lastName: "Tester",
            location: "some location",
          },
          token: "tokenString",
          location: "some location",
        })
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
  test("setUpUser function should be called", async () => {
    const testUser = {
      name: "someTest",
      email: "please@test.com",
      password: "apassword",
    };
    const setUpUser = jest.fn();
    renderRegister(setUpUser(testUser));

    const submitButton = screen.getByRole("button", { name: "Submit" });

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
    const passwordInput = screen.getByLabelText(/password/i);

    user.click(nameInput);
    user.keyboard("owner");

    user.click(emailInput);
    user.keyboard("please@test.com");

    user.click(passwordInput);
    user.keyboard("apassword");

    // screen.debug();
    userEvent.click(submitButton);

    // screen.debug();
    // pause();
    
    const alertElement = await screen.findByRole("alert")
    // screen.debug();
    // const testUser = {
    //   name: "owner",
    //   email: "please@test.com",
    //   password: "apassword",
    // };

    expect(setUpUser).toHaveBeenCalled();
    expect(setUpUser).toHaveBeenCalledWith({name: "someTest",email:"please@test.com", password: "apassword"});




    expect(alertElement).toBeInTheDocument()
    expect(alertElement).toHaveAttribute("class", "alert alert-success")
  });
});

// const pause = () => {
//   new Promise((resolve) => {
//     setTimeout(() => {
//       return resolve;
//     }, 500);
//   });
// };
