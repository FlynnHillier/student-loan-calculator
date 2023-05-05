interface YearsValue {
    year:number
    value:number
}

type Multiplier = number
type Year = number

export class StudentLoan {
    private amount :number
    private interest:Multiplier
    private startYear:Year

    constructor(amount:number,interest:Multiplier,startYear:Year){
        this.amount = amount
        this.interest = interest
        this.startYear = startYear
    }

    /**
     * 
     * @param period - the period in years in which loan values should be calculated
     * @returns - {year,value}[] - year in question; value, value of loan at given year 
     */
    getYearsPeriod(period:{start?:Year,end?:Year} = {}) : YearsValue[]{
        if(!period.start){
            period.start = this.startYear
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
        const yearsSinceStartOfLoan = period.start - this.startYear
        const zeroFill = yearsSinceStartOfLoan < 0 ? this.startYear - period.start : 0

        
        const calculations : YearsValue[] = []
        
        //initiliase value of first value in loan calculations. Used later for continued calculations.
        if(periodLength > zeroFill){
            if(zeroFill !== 0){ //some first years within the period were not before the start year, hence the first year to be calculated will be the first year the loan is taken out
                calculations[0] = {year:this.startYear,value:this.amount}
            } else{ //first year not necessarily the first year taken out, therefore fetch value
                calculations[0] = this.getSingleYear(period.start)
            }
        }

        //calculate further year's values
        let accumulator = calculations[0].value
        for(let i = 1; i < periodLength - zeroFill + 1; i++){
            accumulator *= this.interest



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
     * @returns - {year,value} - year in question; value, value of loan at given year 
     */
    getSingleYear(year:Year) : YearsValue{
        const yearsAfterStart = year - this.startYear
        if(yearsAfterStart < 0){
            return {
                year:year,
                value:0
            }
        }

        let accumulator = this.amount
        for(let i= 1; i < yearsAfterStart; i++){
            accumulator *= this.interest
        }
        return {
            year:year,
            value:accumulator
        }
    }
}