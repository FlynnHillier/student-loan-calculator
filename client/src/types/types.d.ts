export type Multiplier = number
export type Year = number

export interface YearGraphingEntry {
    year:number
    value:number
    repayments?:{
        marginal:{
            enforced:number,
            additional:number,
        },
        cumulative:{
            enforced:number,
            additional:number,
        }
    }
    income?:number
}


export interface ConfigEntries {
    installments: Map<Year,number>
    interest:Multiplier,
    income: {
        amount:number,
        appreciation:{
            active: "MULTI" | "ABS" | "NONE"
            multiplier:Multiplier,
            absolute:number,
        },
        threshold:{
            isActive:boolean, //decide wether to utilise values displayed.
            amount:number,
            enforcedRepaymentMutliplier:Multiplier
        }
    }
    repayment:{
        absolute?:number
        multiplier?:Multiplier
    }
}