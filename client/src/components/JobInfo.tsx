import Wrapper from '../assets/wrappers/JobInfo'

interface JobInfoType{
    icon: JSX.Element,
    text: string
}

const JobInfo = ({icon,text}:JobInfoType)=>{
    return(
        <Wrapper>
            <span className="icon">{icon}</span>
            <span className="text">{text}</span>
        </Wrapper>
    )
}

export default JobInfo