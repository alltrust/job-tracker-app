import links from "../utils/links";
import { NavLink } from "react-router-dom";
import { AllContext } from "../context/appContext";

interface props extends React.HTMLAttributes<any>{
    toggleSidebar? : AllContext['toggleSidebar']
}

const Navlinks = (props:props) => {

  return (
    <>
      {links.map((link) => (
        <NavLink
          to={link.path}
          key={link.id}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={props.toggleSidebar}
          end
        >
          <span className="icon">{link.icon}</span>
          {link.text}
        </NavLink>
      ))}
    </>
  );
};

export default Navlinks