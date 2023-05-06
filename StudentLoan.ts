import { Multiplier,Year,YearsValue } from "./types"

export class StudentLoan {
    public installments : Map<Year,number> = new Map<Year,number>() //installments mapped between years
    public interest:Multiplier

    private income : {
        amount:number,
        annualAppreciation?:{
            percentage:Multiplier,
            absolute:number,
        },
        threshold:{
            amount:number,
            enforcedRepayment:Multiplier
        },
    } = {
        amount:0,
        threshold:{
            amount:25000,
            enforcedRepayment:0.91,
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
    getYearsPeriod(period:{start?:Year,end?:Year} = {},repayment:{absolute?:number,percentage?:Multiplier} = {}) : YearsValue[]{
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
        //retry
        let accumulator = 0
        for(let i = 0; i < yearsAfterFirstInstallmentOfPeriodStart + periodLength;i++){
            let currentYear = firstInstallmentYear + i

            //calculate any repayments if necessary
             if(repayment){
                accumulator -= repayment.absolute || 0
                accumulator *= repayment.percentage || 1
            }

            //round to zero if loan value is now negative
            if(accumulator < 0){
                accumulator = 0
            }
            
            //apply loan interest
            accumulator *= this.interest

            //add new installment if present
            const installment = this.installments.get(currentYear)
            if(installment){
                accumulator += installment
            }

            if(i >= yearsAfterFirstInstallmentOfPeriodStart){
                calculations[i - yearsAfterFirstInstallmentOfPeriodStart - zeroFill] = {
                    year:currentYear,
                    value:accumulator
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
}