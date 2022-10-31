import {useState} from 'react'
import Wrapper from '../assets/wrappers/ChartsContainer'
import BarChart from './BarChart'
import AreaChart from './AreaChart'
import { useAppContext } from '../context/appContext'

const ChartsContainer = ()=>{
    const [barChartState, setBarChartState] = useState<boolean>(true)
    const {monthlyApplications:data} = useAppContext()

    const toggleBarChart = ()=>{
        setBarChartState((prevState)=> !prevState)
    }

    return (
        <Wrapper>
            <h4>Monthly Applications</h4>
            <button type='button' onClick={toggleBarChart}>{barChartState? "AreaChart" : "BarChart"}</button>
            {barChartState ? <BarChart data={data}/> : <AreaChart data={data}/>}
        </Wrapper>
    )
}

export default ChartsContainer