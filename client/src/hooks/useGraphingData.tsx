import { useState,useEffect } from "react";
import { useConfig } from "./useConfig";
import { YearGraphingEntry } from "../types/types";

const useGraphingData = () => {
    let [graphingData,setGraphingData] = useState<YearGraphingEntry[]>([])

    
    const {installments,interest} = useConfig()


    useEffect(()=>{
        //recalculate graphing data here.   
    },[installments,interest])


    return {
        graphingData
    }
}