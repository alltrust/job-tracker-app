import { render, screen } from "@testing-library/react";
import { AllContext, AppContext, initialState } from "../context/appContext";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { mock } from "jest-mock-extended";
import userEvent from "@testing-library/user-event";

const renderNavbar = (props?: any) => {
  const mockedProps = mock<AllContext>(props);

  render(
    <AppContext.Provider value={mockedProps}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AppContext.Provider>
  );
  const btns = screen.getAllByRole('button');
return{btns}
  
};

describe("navbar component", () => {
  test("it should display with funtionality and users name", ()=>{

    const toggleShowLogout = jest.fn()
    const user = {name: "USER TEST"}
    const props = {...initialState, user, toggleShowLogout}

    const {btns} = renderNavbar(props);

    const usersName = screen.getByText(user.name)

    expect(usersName).toBeInTheDocument()
    expect(usersName.textContent).toEqual(user.name)
    expect(btns).toHaveLength(2)

    const showLogoutBtn = btns[1];

    userEvent.click(showLogoutBtn)

    const logoutBtn = screen.getByRole("button", {name: /logout/i})
    expect(logoutBtn).toBeInTheDocument();

  });
  test("logout to have been called", ()=>{
    const logoutUser = jest.fn()
    
    const props = {...initialState, logoutUser}
    const {btns} = renderNavbar(props);

    const showLogoutBtn = btns[1];
    userEvent.click(showLogoutBtn);

    const logoutBtn = screen.getByRole("button", {name: /logout/i})
    userEvent.click(logoutBtn)

    expect(logoutUser).toHaveBeenCalled()
  })
});
