import { useEffect, useState,createContext,ReactNode } from "react";

import { Multiplier,Year } from "../types/types"

export const useProvideConfig = () => {
    let [interest,setInterest] = useState<Multiplier>(1) //multiplier
    let [installments,setInstallments] = useState<Map<Year,number>>(new Map<Year,number>())
    let [incomeAmount,setIncomeAmount] = useState<number>(0)
    
    return {
        interest:{
            state:interest,
            set:setInterest,
        },
        installments:{
            state:installments,
            set:setInstallments,
        },
        incomeAmount:{
            state:incomeAmount,
            set:setIncomeAmount,
        }
    }
}

export const ConfigContext = createContext<ReturnType<typeof useProvideConfig>>({} as ReturnType<typeof useProvideConfig>)

export const ConfigProvider = ({children} : {children:ReactNode}) => {
    const config = useProvideConfig()

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    )
}