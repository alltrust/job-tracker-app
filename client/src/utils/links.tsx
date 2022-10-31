import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

interface Links{
    id: number,
    text: string,
    path: string,
    icon: JSX.Element
}

const links:Links[] =[
    {
        id: 1,
        text: "stats",
        path: "/",
        icon: <IoBarChartSharp/>
    },
    {
        id:2,
        text: "all-jobs",
        path: "all-jobs",
        icon: <MdQueryStats/>
    },
    {
        id:3,
        text: "add-jobs",
        path: "add-job",
        icon: <FaWpforms/>
    },
    {
        id:4,
        text: "Profile",
        path: "profile",
        icon: <ImProfile/>
    }
]

export default links