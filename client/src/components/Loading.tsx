import React from "react"
import { CustomComponentProps } from "../interfaces/NotificationState"


const Loading = ({center}:CustomComponentProps)=>{
    return (
        <div className={center? "loading loading-center" : 'loading'}></div>
    )
}

export default Loading