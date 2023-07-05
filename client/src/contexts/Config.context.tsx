import {createContext,useReducer,ReactNode} from "react";
import { Multiplier,Year,YearsValue } from "../types/types"
import { StudentLoan } from "../classes/StudentLoan";


//## INTERFACING ##


interface ConfigContext {
    installments: Map<Year,number>
    interest:Multiplier,
    income: {
        amount:number,
        appreciation:{
            activeMode:"MULTI" | "ABSOLUTE" | "NONE" //which value to utilise when calculating.
            multiplier:Multiplier,
            absolute:number,
        },
        threshold:{
            isActive:boolean, //decide wether to utilise values displayed.
            amount:number,
            enforcedRepaymentMutliplier:Multiplier
        }
    }
}


interface ConfigReducerAction {
    type: "INSTALLMENT" | "INTEREST" | "INCOME"
    payload: { 

        installment?:{ //use null to act as placehold to remove value from loan
            year:Year,
            value:number | null
        },

        interest?: { //simple just absolute update of value.
            value:Multiplier
        },

        income?: {
            type:"AMOUNT" | "APPRECIATION" | "THRESHOLD" // type to determine which optional attributes to check in order to update.
            amount?: { //simple just absolute update of value.
                value:number
            }

            appreciation?:{ //update whichever values are provided. (also update active mode to most recent changed value?)
                multiplier?:Multiplier,
                absolute?:number
            },

            threshold:{ //update whichever values are provided.
                amount?:number
                enforcedRepaymentMutliplier?:Multiplier
            }
        }
    }
}


//## ACTION HANDLING / FUNCTIONALITY ##


const configReducer = (config:ConfigContext,action: ConfigReducerAction) : ConfigContext => {
    switch(action.type){
        default:
            return config
    }
}



//## INITIAL CONTEXT VALUE DECLARATION ##


const intialConfigContext : ConfigContext = {
    installments: new Map<Year,number>(),
    interest:0,
    income: {
        amount:0,
        appreciation:{
            activeMode:"MULTI",
            multiplier:1,
            absolute:0,
        },
        threshold:{
            isActive:false,
            amount:250000,
            enforcedRepaymentMutliplier:1,
        }
    }
}




//## ACCESS FUNCTIONS ##

const useProvideConfig = () => {
    const [config,dispatchConfig]= useReducer(configReducer,intialConfigContext)

    return {
        config,
        dispatchConfig
    }
}

export const ConfigContext = createContext<ReturnType<typeof useProvideConfig>>({} as ReturnType<typeof useProvideConfig>)

export const ConfigProvider = ({children} : {children:ReactNode}) => {
    const CONFIG = useProvideConfig()

    return (
        <ConfigContext.Provider value={CONFIG}>
            {children}
        </ConfigContext.Provider>
    )
}