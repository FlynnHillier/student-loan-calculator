import {useEffect,useState} from "react"
import { Line,XAxis,YAxis, Tooltip, Bar,ComposedChart,Legend } from 'recharts'
import { useGraphingData } from '../hooks/useGraphingData'

interface SanitizedGraphingData{
    "loan-value":number,
    "cumulative-repayment":number,
    "cumulative-repayment-enforced":number,
    "cumulative-repayment-additional":number,
    "marginal-repayment":number,
    "marginal-repayment-enforced":number,
    "marginal-repayment-additional":number,
    "income":number,
    "year":number,
}

const GraphDisplay = () => {
    const {graphingData} = useGraphingData()
    const [sanitizedGraphingData,setSanitizedGraphing] = useState<SanitizedGraphingData[]>([])

    useEffect(()=>{
        setSanitizedGraphing(graphingData.map(({value,repayments,year,income})=>{
                return {
                    "loan-value":round2DP(value),
                    "cumulative-repayment":round2DP(repayments?.cumulative.total || 0),
                    "cumulative-repayment-enforced":round2DP(repayments?.cumulative.enforced || 0),
                    "cumulative-repayment-additional":round2DP(repayments?.cumulative.additional || 0),
                    "marginal-repayment":round2DP(repayments?.marginal.total || 0),
                    "marginal-repayment-enforced":round2DP(repayments?.marginal.enforced || 0),
                    "marginal-repayment-additional":round2DP(repayments?.marginal.additional || 0),
                    "income":round2DP(income || 0),
                    "year":year
                }
            }))
    },[graphingData])

    function round2DP(number:number) : number {
        return Math.round(number * 100) / 100
    }

    return (
        <>
            <ComposedChart width={1200} height={600} data={sanitizedGraphingData}>
                <Line type="monotone" label="loanvalue" dataKey="loan-value" stroke="#8884d8"/>
                <Line type="monotone"  dataKey="cumulative-repayment" stroke="#8a0f1f"/>
                <Line type="monotone"  dataKey="income" stroke="#1a963b"/>
                <Bar type="monotone" dataKey="marginal-repayment" fill="#d99e14"/>
                <XAxis dataKey="year"/>
                <Tooltip/>
                <YAxis dataKey={"loan-value"}/>
                <Legend/>
            </ComposedChart>
        </>
    )
}

export default GraphDisplay