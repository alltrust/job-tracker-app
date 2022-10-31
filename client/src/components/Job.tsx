import { Link } from "react-router-dom";
import { JobType } from "../interfaces/NotificationState";
import { useAppContext } from "../context/appContext";
import { FaLocationArrow, FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import JobInfo from "./JobInfo";
import Wrapper from "../assets/wrappers/Job";
import moment from "moment";

const Job = ({
  createdAt,
  company,
  _id,
  position,
  jobLocation,
  jobType,
  status,
}: JobType) => {
  let date: string = moment(createdAt).format("MMM Do, YYYY");

  const { setEditJob, deleteJob } = useAppContext();

  const onEditJob = (jobId: string) => {
    setEditJob(jobId)
    
  };

  const onDeleteJob = (jobId: string) => {
    deleteJob(jobId)
  };

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-job"
              className="btn edit-btn"
              onClick={onEditJob.bind(null, _id)}
            >
              Edit
            </Link>
            <button
              className="btn delete-btn"
              onClick={onDeleteJob.bind(null, _id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
