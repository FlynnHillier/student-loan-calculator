import { useState,createContext,ReactNode,useEffect } from "react";
import { ConfigEntries } from "../types/types";

import { Multiplier,Year } from "../types/types"

export const useProvideConfig = () => {
    let [hasLoadedLocalStorage,setHasLoadedLocalStorage] = useState<boolean>(false)
    
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

    
    function mapStringifyReplacer(key:string | number, value:any) {
        if(value instanceof Map) {
          return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
          };
        } else {
          return value;
        }
    }


    function mapStringifyReviver(key:string | number, value:any) {
        if(typeof value === 'object' && value !== null) {
          if (value.dataType === 'Map') {
            return new Map(value.value);
          }
        }
        return value;
    }


    function restoreFromConfig(config:any){
        setInstallments(config.installments)
        setInterest(config.interest)
        setIncomeAmount(config.incomeAmount)
        setIncomeAppreciacionActive(config.incomeAppreciationActive)
        setIncomeAppreciationMulti(config.incomeAppreciationMulti)
        setIncomeAppreciationAbsolute(config.incomeAppreciationAbsolute)
        setIncomeThresholdAmount(config.incomeThresholdAmount)
        setIncomeThresholdEnforcedMultiplier(config.incomeThresholdEnforcedMultiplier)
        setIncomeThresholdIsActive(config.incomeThresholdIsActive)
        setRepaymentAbsolute(config.repaymentAbsolute)
        setRepaymentMultiplier(config.repaymentMultiplier)
    }


    useEffect(()=>{
        const storedStringifiedConfig = localStorage.getItem("config")
        if(storedStringifiedConfig){
            const parsedConfig = JSON.parse(storedStringifiedConfig,mapStringifyReviver)
            restoreFromConfig(parsedConfig)
        }
        setHasLoadedLocalStorage(true)
    },[])
    
    

    useEffect(()=>{ 
        if(hasLoadedLocalStorage){
            localStorage.setItem("config",
                JSON.stringify(
                    {
                        installments,
                        interest,
                        incomeAmount,
                        incomeAppreciationActive,
                        incomeAppreciationMulti,
                        incomeAppreciationAbsolute,
                        incomeThresholdAmount,
                        incomeThresholdEnforcedMultiplier,
                        incomeThresholdIsActive,
                        repaymentAbsolute,
                        repaymentMultiplier,
                    },
                    mapStringifyReplacer,
                )  
            )
        }
    },[
        hasLoadedLocalStorage,
        interest,
        installments,
        incomeAmount,
        incomeAppreciationActive,
        incomeAppreciationMulti,
        incomeAppreciationAbsolute,
        incomeThresholdAmount,
        incomeThresholdEnforcedMultiplier,
        incomeThresholdIsActive,
        repaymentAbsolute,
        repaymentMultiplier,
    ])

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