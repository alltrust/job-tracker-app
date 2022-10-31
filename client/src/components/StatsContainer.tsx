import StatsItem from "./StatsItem";
import { useAppContext } from "../context/appContext";
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa";
import Wrapper from "../assets/wrappers/StatsContainer";

 export interface DefaultProps {
  title: string;
  count: number;
  icon: JSX.Element;
  color: string;
  bcg: string;
}

const StatsContainer = () => {
  const { defaultStats } = useAppContext();
  

  const defaultprops: DefaultProps[] = [
    {
      title: "pending applications",
      count:  defaultStats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: "#e9b949",
      bcg: "#fcefc7",
    },
    {
      title: "interviews scheduled",
      count:  defaultStats.interview || 0,
      icon: <FaCalendarCheck />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "jobs declined",
      count:  defaultStats.declined || 0,
      icon: <FaBug />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    }
  ];

  return (
    <Wrapper>
        {defaultprops.map((item,index)=>{
            return <StatsItem key={index} {...item}/>
        })}
    </Wrapper>
  );
};

export default StatsContainer;
