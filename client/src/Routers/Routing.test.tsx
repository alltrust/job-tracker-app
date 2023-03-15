import { screen, render } from "@testing-library/react";
import { mock } from "jest-mock-extended";
import { MemoryRouter } from "react-router-dom";
import { AllContext, AppContext } from "../context/appContext";
import { SharedLayout } from "../pages/dashboard/index";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../pages/ProtectedRoute";
import Routing from "./Routing";

const renderRoutes = (initialEntries: string[] | undefined) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routing />
    </MemoryRouter>
  );
};

const renderProtectedRoutes = (props: any) => {
  const mockedProps = mock<AllContext>(props);
  render(
    <AppContext.Provider value={mockedProps}>
      <MemoryRouter initialEntries={["/all-jobs"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<div>Stats</div>} />
            <Route path="all-jobs" element={<div>All Jobs</div>} />
            <Route path="add-job" element={<div>Add Jobs</div>} />
            <Route path="profile" element={<div>Profile</div>} />
          </Route>
          <Route path="/landing" element={<div>Landing</div>}/>
        </Routes>
      </MemoryRouter>
    </AppContext.Provider>
  );
};

const linkNames = ["stats", "all-jobs", "add-jobs", "Profile"];

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
  
  test("should display dashboard with nav links if user is in context", async () => {
    const user = {
      name: "name",
      lastName: "lastName",
      location: "location",
      email: "email",
      password: "password",
    };

    renderProtectedRoutes({ user });

    for (let link of linkNames) {
      const links = screen.getByRole("link", { name: new RegExp(`${link}`) });
      expect(links).toBeInTheDocument();
    }
  });
  test("should not display dashboard and go to Landing page if no user in the context", () => {
    const user = null;

    renderProtectedRoutes({ user });

    const landingHeading = screen.getByText(/landing/i)

    expect(landingHeading).toBeInTheDocument()
  });
});
