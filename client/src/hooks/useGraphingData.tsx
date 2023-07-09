import {useContext} from "react"
import { GraphingDataContext } from "../contexts/graphingData.context"

export const useGraphingData = () => {
    return useContext(GraphingDataContext)
}