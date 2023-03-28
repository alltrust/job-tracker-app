import { screen, render } from "@testing-library/react";
import { AllContext, AppContext } from "../context/appContext";
import { MemoryRouter } from "react-router-dom";
import Job from "./Job";
import { JobType } from "../interfaces/NotificationState";
import { mock } from "jest-mock-extended";
import { jobs } from "../test/mockedJobs";
import userEvent from "@testing-library/user-event";

const renderJob = (localProps: JobType, props?: any) => {
  const mockedProps = mock<AllContext>(props);
  render(
    <AppContext.Provider value={mockedProps}>
      <MemoryRouter>
        <Job {...localProps} />
      </MemoryRouter>
    </AppContext.Provider>
  );

  const editLink = screen.getByRole("link", { name: /edit/i });
  const deleteBtn = screen.getByRole("button", { name: /delete/i });

  return { editLink, deleteBtn };
};

describe("Job Component", () => {
  const createdAt = jobs[0].createdAt;
  const company = jobs[0].company;
  const _id = jobs[0]._id;
  const position = jobs[0].position;
  const jobLocation = jobs[0].jobLocation;
  const jobType = jobs[0].jobType;
  const status = jobs[0].status;

  const localProps: JobType = {
    createdAt,
    company,
    _id,
    position,
    jobLocation,
    jobType,
    status,
  };

  test("it should pass in all props and display", () => {
    const { editLink, deleteBtn } = renderJob(localProps);

    const mainIcon = screen.getByText(company[0]);
    expect(mainIcon).toHaveAttribute("class", "main-icon");

    const positionHeader = screen.getByRole("heading", { name: position });
    expect(positionHeader).toBeInTheDocument();

    const companyName = screen.getByText(company);
    expect(companyName).toBeInTheDocument();

    expect(editLink).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();
  });

  test("jobs edit fn and delete job fn should be called on clicks", () => {
    const setEditJob = jest.fn();
    const deleteJob = jest.fn();

    const contextProps = { setEditJob, deleteJob };

    const { editLink, deleteBtn } = renderJob(localProps, contextProps);

    userEvent.click(editLink);

    expect(setEditJob).toHaveBeenCalled();
    expect(setEditJob).toHaveBeenCalledWith(_id);

    userEvent.click(deleteBtn);

    expect(deleteJob).toHaveBeenCalled();
    expect(deleteJob).toHaveBeenCalledWith(_id);
  });
});
