import {useEffect} from 'react'
import { useAppContext } from '../../context/appContext'
import { ChartsContainer, StatsContainer} from '../../components/Index'
import Loading from '../../components/Loading'

const Stats = ()=>{
    const {showStats, monthlyApplications, isLoading } = useAppContext()
    
    useEffect(()=>{
        showStats()
    },[])

    if(isLoading){
        return <Loading center/>
    }
    return (
        <>
        <StatsContainer/>
        {monthlyApplications.length > 0 && <ChartsContainer/>}

        </>
    )
}

export default Stats