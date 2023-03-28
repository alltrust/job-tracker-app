import { render, screen } from "@testing-library/react";
import {
  AllContext,
  AppContext,
  initialState,
} from "../../context/appContext";
import { MemoryRouter } from "react-router-dom";
import Profile from "./Profile";
import { mock } from "jest-mock-extended";
import userEvent from "@testing-library/user-event";

const renderProfile = (props: any) => {
  const propsWithMockedUser = {
    ...props,
    user: {
      name: "test",
      lastName: "tester",
      email: "this",
      location: "someLocation",
    },
  };

  const mockedProps = mock<AllContext>(propsWithMockedUser);

  render(
    <AppContext.Provider value={mockedProps}>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </AppContext.Provider>
  );

  const nameInput = screen.getByRole("textbox", { name: "Name" });
  const lastNameInput = screen.getByRole("textbox", { name: /last name/i });
  const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
  const locationInput = screen.getByRole("textbox", { name: /location/i });
  const saveChangesBtn = screen.getByRole("button");

  return {
    nameInput,
    lastNameInput,
    emailInput,
    locationInput,
    saveChangesBtn,
  };
};

describe("Profile page on render", () => {
  test("should display profile elements", () => {
    const {
      nameInput,
      emailInput,
      lastNameInput,
      locationInput,
      saveChangesBtn,
    } = renderProfile({ ...initialState });

    const profileHeader = screen.getByRole("heading", { name: /profile/i });
    const alertDiv = screen.queryByRole("alert");

    expect(alertDiv).not.toBeInTheDocument();

    expect(profileHeader).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(locationInput).toBeInTheDocument();
    expect(saveChangesBtn).toBeInTheDocument();
  });
  test("should display profile form with initial Values", async () => {
    const updateUser = jest.fn();
    const props = {
      ...initialState,
      updateUser,
    };

    const {
      nameInput,
      lastNameInput,
      emailInput,
      locationInput,
      saveChangesBtn,
    } = renderProfile(props);

    const name = "NEW TEST";
    const lastName = " NEW TESTER";
    const email = "NEW@EMAIL";
    const location = "NEW LOCATION";

    userEvent.click(nameInput);
    userEvent.clear(nameInput);
    userEvent.keyboard(name);

    userEvent.click(lastNameInput);
    userEvent.clear(lastNameInput);
    userEvent.keyboard(lastName);

    userEvent.click(emailInput);
    userEvent.clear(emailInput);
    userEvent.keyboard(email);

    userEvent.click(locationInput);
    userEvent.clear(locationInput);
    userEvent.keyboard(location);

    expect(nameInput).toHaveValue(name);
    expect(lastNameInput).toHaveValue(lastName);
    expect(emailInput).toHaveValue(email);
    expect(locationInput).toHaveValue(location);

    userEvent.click(saveChangesBtn);

    const updatedUser = updateUser.mock.calls[0][0];
    const expectedUpdatedUser = { name, lastName, email, location };

    expect(updatedUser).toEqual(expectedUpdatedUser);
    expect(updateUser).toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalledWith(updatedUser);
  });

  test("to display alert if any input is empty and form is submitted", async () => {
    const displayAlert = jest.fn();
    const showAlert = true;
    const alertType = "danger";
    const alertText = "text";

    const { nameInput, saveChangesBtn } = renderProfile({
      ...initialState,
      displayAlert,
      showAlert,
      alertText,
      alertType,
    });

    userEvent.clear(nameInput);
    userEvent.click(saveChangesBtn);

    const alertDiv = screen.getByRole("alert");

    expect(alertDiv).toBeInTheDocument();
    expect(alertDiv).toHaveAttribute("class", "alert alert-danger");
    expect(displayAlert).toHaveBeenCalled();
    expect(displayAlert).toHaveBeenCalledTimes(1);
  });
  test("when state is loading, button is disabled with a loading text", () => {
    const { saveChangesBtn } = renderProfile({
      ...initialState,
      isLoading: true,
    });

    expect(saveChangesBtn).toBeDisabled()
    expect(saveChangesBtn).toHaveAccessibleName(/please wait .../i)
  });
});


