import Wrapper from '../assets/wrappers/StatItem'
import {DefaultProps} from './StatsContainer'

const StatsItem = ({icon, count, title, color, bcg}:DefaultProps)=>{
    return(
        <Wrapper color={color} bcg={bcg}>
            <header>
                <span className='count'>{count}</span>
                <div data-testid="icon-wrapper" className='icon'>{icon}</div>
            </header>
            <h5 className='title'>{title}</h5>
        </Wrapper>
    )
}

export default StatsItem