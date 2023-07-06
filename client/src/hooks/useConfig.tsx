import { useState } from "react";

import { Multiplier,Year } from "../types/types"

export const useConfig = () => {
    let [interest,setInterest] = useState<Multiplier>(1) //multiplier
    let [installments,setInstallments] = useState<Map<Year,number>>(new Map<Year,number>())

    
    return {
        interest,
        setInterest,
        installments,
        setInstallments,
    }
}