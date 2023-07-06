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