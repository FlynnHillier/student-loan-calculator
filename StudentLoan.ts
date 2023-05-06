import { Multiplier,Year,YearsValue } from "./types"

export class StudentLoan {
    public installments : Map<Year,number> = new Map<Year,number>() //installments mapped between years
    public interest:Multiplier

    
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
    get firstLoanYear() : Year {
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
        if(!this.isPopulated){
            return []
        }

        const firstLoanYear = this.firstLoanYear

        if(!period.start){
            period.start = firstLoanYear
        }

        if(!period.end){
            period.end = period.start + 22
        }

        const periodLength = period.end - period.start

        if(periodLength < 0){
            return []
        }

        if(periodLength === 0){
            return [this.getSingleYear(period.start)]
        }

        //period starts x years after startYear of loan, hence zeroFill x start values of output array
        const yearsSinceStartOfLoan = period.start - firstLoanYear
        const zeroFill = yearsSinceStartOfLoan < 0 ? firstLoanYear - period.start : 0
        
        const calculations : YearsValue[] = [
            this.getSingleYear(period.start)
        ]

        //calculate further year's values
        let accumulator = calculations[0].value
        for(let i = 1; i < periodLength - zeroFill + 1; i++){
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
            const installment = this.installments.get(period.start + zeroFill + i)
            if(installment){
                accumulator += installment
            }

            calculations[i] = {
                year:period.start + zeroFill + i,
                value:accumulator
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

    /**
     * 
     * @param year - year to recieve data bout
     * @param repayment -{absolute}: an absolute value to be deducted from the value of the loan annually; {percentage}: a percentage value to be repaid annually; #NOT ADVISABLE TO DECLARE BOTH
     * @returns - {year,value} - year in question; value, value of loan at given year 
     */
    getSingleYear(year:Year,repayment:{absolute?:number,percentage?:Multiplier} = {}) : YearsValue{
        if(!this.isPopulated){
            return {
                year:year,
                value:0
            }
        }

        const firstLoanYear = this.firstLoanYear
        const yearsAfterStart = year - firstLoanYear
        if(yearsAfterStart < 0){
            return {
                year:year,
                value:0
            }
        }

        let accumulator = this.installments.get(firstLoanYear)
        if(!accumulator){
            throw `no initial installment was found for year ${firstLoanYear} - suggested to be firstLoanYear`
        }
        for(let i= 1; i < yearsAfterStart; i++){
            if(repayment){
                accumulator -= repayment.absolute || 0
                accumulator *= repayment.percentage || 1
            }

            if(accumulator < 0){
                accumulator = 0
            }

            accumulator *= this.interest


            //add new installment if present
            const installment = this.installments.get(firstLoanYear + i)
            if(installment){
                accumulator += installment
            }

        }
        return {
            year:year,
            value:accumulator
        }
    }
}

const x = new StudentLoan([{year:2000,value:9000},{year:2007,value:9000}],1.06)
console.log(x.getYearsPeriod({},{absolute:1500}))