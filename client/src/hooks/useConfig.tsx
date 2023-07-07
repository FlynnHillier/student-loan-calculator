import { useEffect, useState } from "react";

import { Multiplier,Year } from "../types/types"

export const useConfig = () => {
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