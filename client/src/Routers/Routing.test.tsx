import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Routing from "./Routing";

const renderRoutes = (initialEntries: string[] | undefined) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routing />
    </MemoryRouter>
  );
};


describe("App Routes", () => {
  test("should render the register page", () => {
    renderRoutes(["/register"]);

    const registerHeading = screen.getByRole("heading", { name: /register/i });

    expect(registerHeading).toBeInTheDocument();
  });

  test("should render the landing page", () => {
    renderRoutes(["/landing"]);

    const mainHeading = screen.getByRole("heading", {
      name: /job tracking app/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });

  test("should render the error page if route is unrecognized", () => {
    renderRoutes(["/some/bad/route"]);

    const errorImg = screen.getByAltText(/page not found/i);

    expect(errorImg).toBeInTheDocument();
  });

  test("should route back to '/' if on Error page once link is clicked", ()=>{

    renderRoutes(["/some/bad/route"]);

    const link = screen.getByRole("link", {name: /home/i});

    userEvent.click(link);

    const registerBtn = screen.getByRole("link", {name: /login\/register/i})

    expect(registerBtn).toBeInTheDocument()
    expect(link).not.toBeInTheDocument()
    

  })
  

});

