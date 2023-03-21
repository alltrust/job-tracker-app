import {render, screen } from "@testing-library/react"
import { mock } from "jest-mock-extended";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AllContext, AppContext } from "../context/appContext";
import { SharedLayout } from "./dashboard";
import ProtectedRoute from "./ProtectedRoute";


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
              <Route path="all-jobs" element={<div>All Jobs</div>} />
            </Route>
            <Route path="/landing" element={<div>Landing</div>}/>
          </Routes>
        </MemoryRouter>
      </AppContext.Provider>
    );
  };

  const navLinks = ["all-jobs", "add-job", "Profile", "stats"]

  

describe("protected route", ()=>{
    test("should display nav-links if a user in the context", ()=>{

        const user = {
            name: "test",
            id: "1"
        }

        renderProtectedRoutes({user})

        for(let link of navLinks){
           const navLink =  screen.getByRole("link", { name: new RegExp(`${link}`) })
           expect(navLink).toBeInTheDocument()
        }

    });
    test("should not display navlinks but should display landing page if no user in the context", ()=>{

        const user = null;

        renderProtectedRoutes({user})

        for(let link of navLinks){
            const navLink =  screen.queryByRole("link", { name: new RegExp(`${link}`) })
            expect(navLink).not.toBeInTheDocument()
        }

        const landingHeading = screen.getByText(/landing/i)

        expect(landingHeading).toBeInTheDocument()
    })
})

