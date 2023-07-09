import { useState,createContext,ReactNode } from "react";
import { ConfigEntries } from "../types/types";

import { Multiplier,Year } from "../types/types"

export const useProvideConfig = () => {
    let [interest,setInterest] = useState<Multiplier>(1) //multiplier
    let [installments,setInstallments] = useState<Map<Year,number>>(new Map<Year,number>())
    
    //## INCOME ##
    
    let [incomeAmount,setIncomeAmount] = useState<ConfigEntries["income"]["amount"]>(0)
    
    //-- Appreciaction
    let [incomeAppreciationActive,setIncomeAppreciacionActive] = useState<ConfigEntries["income"]["appreciation"]["active"]>("NONE")
    let [incomeAppreciationMulti,setIncomeAppreciationMulti] = useState<ConfigEntries["income"]["appreciation"]["multiplier"]>(1)
    let [incomeAppreciationAbsolute,setIncomeAppreciationAbsolute] = useState<ConfigEntries["income"]["appreciation"]["absolute"]>(0)

    //-- Threshold
    let [incomeThresholdAmount,setIncomeThresholdAmount] = useState<ConfigEntries["income"]["threshold"]["amount"]>(25000)
    let [incomeThresholdEnforcedMultiplier,setIncomeThresholdEnforcedMultiplier] = useState<ConfigEntries["income"]["threshold"]["enforcedRepaymentMutliplier"]>(0.09)
    let [incomeThresholdIsActive,setIncomeThresholdIsActive] = useState<ConfigEntries["income"]["threshold"]["isActive"]>(true)

    //## REPAYMENT ##
    let [repaymentAbsolute,setRepaymentAbsolute] = useState<ConfigEntries["repayment"]["absolute"]>(0)
    let [repaymentMultiplier,setRepaymentMultiplier] = useState<ConfigEntries["repayment"]["multiplier"]>(0)

    return {
        interest:{
            state:interest,
            set:setInterest,
        },
        installments:{
            state:installments,
            set:setInstallments,
        },

        //income-appreciation
        incomeAmount:{
            state:incomeAmount,
            set:setIncomeAmount,
        },
        incomeAppreciationActive:{
            state:incomeAppreciationActive,
            set:setIncomeAppreciacionActive,
        },
        incomeAppreciationMulti:{
            state:incomeAppreciationMulti,
            set:setIncomeAppreciationMulti,
        },
        incomeAppreciationAbsolute:{
            state:incomeAppreciationAbsolute,
            set:setIncomeAppreciationAbsolute,
        },

        //income-threshold
        incomeThresholdAmount:{
            state:incomeThresholdAmount,
            set:setIncomeThresholdAmount,
        },
        incomeThresholdIsActive:{
            state:incomeThresholdIsActive,
            set:setIncomeThresholdIsActive,
        },
        incomeThresholdEnforcedMultiplier:{
            state:incomeThresholdEnforcedMultiplier,
            set:setIncomeThresholdEnforcedMultiplier,
        },

        //repayment
        repaymentAbsolute:{
            state:repaymentAbsolute,
            set:setRepaymentAbsolute
        },
        repaymentMultiplier:{
            state:repaymentMultiplier,
            set:setRepaymentMultiplier,
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