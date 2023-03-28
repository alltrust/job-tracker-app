import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppProvider } from "../../context/appContext";
import SharedLayout from "./SharedLayout";
import toContainRole from "../../test/helpers/toContainRole";
import Navbar from "../../components/Navbar";
import userEvent from "@testing-library/user-event";
import toContainRoleNames from "../../test/helpers/toContainerRoleNames";

expect.extend({ toContainRole, toContainRoleNames });

const renderSharedLayout = () => {
  render(
    <AppProvider>
      <MemoryRouter>
        <SharedLayout />
      </MemoryRouter>
    </AppProvider>
  );


};

describe("Shared layout for pages", () => {
  test("it should display the shared content", () => {

    renderSharedLayout();

    const navigation = screen.getByRole("navigation");
    const aside = screen.getByRole("complementary");
    const jobifyLogo= screen.getAllByAltText("jobify")


    expect(jobifyLogo).toHaveLength(3)
    expect(aside).toBeInTheDocument();
    expect(within(aside).getAllByRole("link")).toHaveLength(4);

    expect(navigation).toBeInTheDocument();
    expect(navigation).toContainRole("button", 2);

  });

  test("button should toggle between showing and hiring sidebar", () => {

   renderSharedLayout();

    const sidebarToggleBtn = screen.getAllByRole("button")[1];
    expect(sidebarToggleBtn).toHaveAttribute("class", "toggle-btn");

    const sidebarShowClass = "sidebar-container show-sidebar";

    const sidebarContainerBig = screen.getByTestId(
      "sidebar-container-big-test"
    );
    const sidebarContainerSmall = screen.getByTestId(
      "sidebar-container-small-test"
    );

    expect(sidebarContainerBig).toHaveAttribute("class", sidebarShowClass);
    expect(sidebarContainerSmall).not.toHaveAttribute(
      "class",
      sidebarShowClass
    );

    userEvent.click(sidebarToggleBtn);

    expect(sidebarContainerBig).not.toHaveAttribute("class", sidebarShowClass);
    expect(sidebarContainerSmall).toHaveAttribute("class", sidebarShowClass);

  });
});
