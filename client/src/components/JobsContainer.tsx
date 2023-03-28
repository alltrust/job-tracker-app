import { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/JobsContainer";
import { Job } from "../components/Index";
import { JobType } from "../interfaces/NotificationState";
import Loading from "./Loading";
import PageBtnContainer from "./PageBtnContainer";

const JobsContainer = () => {
  const { getJobs, jobs, isLoading, page, totalJobs, search, searchStatus, sort, searchType, numOfPages } = useAppContext();

  useEffect(() => {
    getJobs();
  }, [search, searchStatus, sort, searchType, page]);

  if(isLoading){
      return <Loading center/>
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h1>No jobs to load yet...</h1>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 0 && "s"} found
      </h5>
      <div data-testid="jobs-container" className="jobs">
        {jobs.map((job: JobType) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer/>}
    </Wrapper>
  );
};

export default JobsContainer;
