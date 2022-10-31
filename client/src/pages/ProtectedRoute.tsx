import { useAppContext } from "../context/appContext";
import {Navigate} from "react-router-dom"



interface ChildrenProps {
    children: JSX.Element;
  }

const ProtectedRoute = ({children}:ChildrenProps):JSX.Element=>{
    const {user} = useAppContext()
    if(!user){
        return <Navigate to="/landing"/>
    }
    return children
}

export default ProtectedRoute