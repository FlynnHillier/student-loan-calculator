import { LineChart,Line,XAxis,YAxis } from 'recharts'
import { useGraphingData } from '../hooks/useGraphingData'

const GraphDisplay = () => {
    const {graphingData} = useGraphingData()

    return (
        <>
            <LineChart width={1200} height={600} data={graphingData}>
                <Line type="monotone" dataKey="value" stroke="#8884d8"/>
                <XAxis dataKey="year"/>
                <YAxis/>
            </LineChart>
        </>
    )
}

export default GraphDisplay