import { useState } from "react";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useAppContext } from "../context/appContext";
import Logo from "./Logo";
import Wrapper from "../assets/wrappers/Navbar";

type Logout = boolean

const Navbar = () => {
    const [showLogout, setShowLogout] = useState<Logout>(false)
    const {user, toggleSidebar, logoutUser} = useAppContext();

    const toggleShowLogout = ()=>{
        setShowLogout((prevState=> !prevState))

    }
  return (
    <Wrapper>
      <div className="nav-center">
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
        >
          <FaAlignLeft />
        </button>

        <div>
          <Logo />
          <h3 className="logo-text">dashboard</h3>
        </div>

        <div className="btn-container">
          <button className="btn" onClick={toggleShowLogout}>
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>
          <div className={showLogout ?"dropdown show-dropdown" : "dropdown"}>
            <button
              onClick={logoutUser}
              className="dropdown-btn"
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
