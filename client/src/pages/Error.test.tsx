import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Error from "./Error";

const renderErrorPage = ()=>{

    render(
        <MemoryRouter>
          <Error />
        </MemoryRouter>
      );
}

describe("Error page", () => {

  test("should display an image for a page that is not found", () => {

    renderErrorPage()
    
    const imageAltText = screen.getByAltText(/page not found/i);

    expect(imageAltText).toBeInTheDocument();
  });

  test("there is a 'home' link that goes to '/'", () => {

    renderErrorPage();

    const link = screen.getByRole("link", { name: /home/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/")
  
  });
});

