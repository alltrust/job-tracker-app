import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import ErrorImg from "../assets/images/not-found.svg";

const Error = () => {
  return (
    <Wrapper className="full-page">
      <div>
        <img src={ErrorImg} alt="page not found" />
        <h3>Can't find your page</h3>
        <p>Please navigate back to available page</p>
        <Link to="/">HOME</Link>
      </div>
    </Wrapper>
  );
};

export default Error;
