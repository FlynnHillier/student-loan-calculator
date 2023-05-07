import { Multiplier,Year,YearsValue } from "../types/types"


export class StudentLoan {
    public installments : Map<Year,number> = new Map<Year,number>() //installments mapped between years
    public interest:Multiplier

    private income : {
        amount:number,
        annualAppreciation?:{
            multiplier?:Multiplier,
            absolute?:number,
        },
        threshold:{
            amount:number,
            enforcedRepaymentMutliplier:Multiplier
        },
    } = {
        amount:29000,
        threshold:{
            amount:25000,
            enforcedRepaymentMutliplier:0.09,
        },
        annualAppreciation:{
            multiplier:1.05
        }
    }
    
    /**
     * 
     * @param installments - {year,value}[] : year - the year in which the installment is made ; value - the value of the installment
     * @param interest - the annual interest rate applied to the loan
     */
    constructor(installments:YearsValue[],interest:Multiplier){        
        installments.forEach((installment)=>{
            this.installments.set(installment.year,installment.value)
        })
        this.interest = interest
    }


    /**
     * @description the year in which the first installment is made. (0 if no installments present)
     */
    get firstInstallmentYear() : Year {
        const firstYear = Array.from(this.installments.keys())
        .reduce((lowestValue,value)=>{
            return lowestValue < value ? lowestValue : value  
        },Infinity)

        return firstYear === Infinity ? 0 : firstYear
    }


    /**
     * @description if any installments are present within the loan
     */
    get isPopulated() : boolean {
        return this.installments.size !== 0
    }


    /**
     * 
     * @param period - the period in years in which loan values should be calculated
     * @param repayment - {absolute}: an absolute value to be deducted from the value of the loan annually; {percentage}: a percentage value to be repaid annually; #NOT ADVISABLE TO DECLARE BOTH 
     * @returns - {year,value}[] - year in question; value, value of loan at given year 
     */
    getYearsPeriod(period:{start?:Year,end?:Year} = {},repayment:{absolute?:number,multiplier?:Multiplier} = {}) : YearsValue[]{
        const firstInstallmentYear = this.firstInstallmentYear

        if(!period.start){
            period.start = firstInstallmentYear
        }

        if(!period.end){
            period.end = period.start + 22
        }

        const periodLength = period.end - period.start + 1

        if(periodLength < 1){
            return []
        }

        if(!this.isPopulated){
            return new Array(periodLength).map((v,i)=>{
                return {
                    year:period.start! + i,
                    value:0
                }
            })
        }

        
        //period starts x years after startYear of loan, hence zeroFill x start values of output array
        const yearsAfterFirstInstallmentOfPeriodStart = period.start - firstInstallmentYear
        const zeroFill = yearsAfterFirstInstallmentOfPeriodStart < 0 ? firstInstallmentYear - period.start : 0
        
        const calculations : YearsValue[] = []


        //initialise accumulator for calculation
        let accumulator = {
            loanValue:0,
            repayments:{
                enforced:0,
                additional:0,
            },
            income:this.income.amount
        }

        for(let i = 0; i < yearsAfterFirstInstallmentOfPeriodStart + periodLength;i++){
            let currentYear = firstInstallmentYear + i


            //calculate enforced repayments based on income
            const enforced = this._calculateEnforcedRepayment(accumulator.loanValue,accumulator.income)
            //calculate any additional optional repayments (considering already paid enforced repayments)
            let additional = 0

            //if repayment option is provided, and there is still value left on loan to be repaid after enforced amount
            if(repayment && (accumulator.loanValue - enforced) > 0){
                if(repayment.absolute && repayment.absolute > enforced){
                    additional = repayment.absolute - enforced                    
                } else if(repayment.multiplier){
                    additional = (accumulator.loanValue * repayment.multiplier) - enforced
                }

                //if additional amount is more than is remaining on the loan, only add the amount remaining on the loan
                additional =  additional < (accumulator.loanValue - enforced) ? additional : (accumulator.loanValue - enforced)
            }


            //update the accumulator with calculated values
            accumulator.repayments.additional += additional
            accumulator.repayments.enforced += enforced
            accumulator.loanValue -= additional
            accumulator.loanValue -= enforced


            //round to zero if loan value is now negative
            if(accumulator.loanValue < 0){
                accumulator.loanValue = 0
            }
            
            //apply loan interest
            accumulator.loanValue *= this.interest

            //add new installment if present
            const installment = this.installments.get(currentYear)
            if(installment){
                accumulator.loanValue += installment
            }   

            //record calculations if necessary within specified period
            if(i >= yearsAfterFirstInstallmentOfPeriodStart){
                calculations[i - yearsAfterFirstInstallmentOfPeriodStart - zeroFill] = {
                    year:currentYear,
                    value:accumulator.loanValue,
                    repayments:{
                        marginal:{
                            enforced:enforced,
                            additional:additional,
                        },
                        cumulative:{
                            enforced:accumulator.repayments.enforced,
                            additional:accumulator.repayments.additional,
                        }
                    },
                    income:accumulator.income
                }
            }

            //apply any annual increase to income
            if(this.income.annualAppreciation){
                const {absolute,multiplier} = this.income.annualAppreciation
                if(absolute){
                    accumulator.income += absolute
                } else if(multiplier){
                    accumulator.income *= multiplier
                }
            }
        }

        //return conjoined zero fill array and calculations
        return [
            ...new Array(zeroFill)
            .fill(null)
            .map((v,i)=>{
                return {
                    year:period.start! + i,
                    value:0
                }
            }),
            ...calculations
        ]
    }


    private _calculateEnforcedRepayment(loanValue:number,income:number) : number {
        if(income <= this.income.threshold.amount){
            return 0
        }

        const enforcableAmount = (income - this.income.threshold.amount) * this.income.threshold.enforcedRepaymentMutliplier

        //if the loan is entirely repaid,return loan value; else return enforcable amount
        return enforcableAmount > loanValue ? loanValue : enforcableAmount
    }

}