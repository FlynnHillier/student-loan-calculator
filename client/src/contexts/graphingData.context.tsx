import { useState,useEffect,createContext,ReactNode } from "react";
import { useConfig } from "./../hooks/useConfig";
import { YearGraphingEntry,Year, ConfigEntries } from "../types/types";




interface GraphingParamaters {
    period:{
        start?:Year
        end?:Year
    },
}


function calculateGraphingData(config:ConfigEntries,paramaters:GraphingParamaters) : YearGraphingEntry[] {
    const {period} = paramaters
    const {income,installments,repayment,interest} = config

    //calculate first installment year
    const firstInstallmentYear = function(){
        const firstYear = Array.from(config.installments.keys())
        .reduce((lowestYear,year)=>{
            return lowestYear < year ? lowestYear : year  
        },Infinity)

        return firstYear === Infinity ? 0 : firstYear
    }()

    if(!period.start){
        period.start = firstInstallmentYear
    }

    if(!period.end){
        period.end = period.start + 40
    }

    const periodLength = period.end - period.start + 1

    if(periodLength < 1){
        return []
    }

    if(installments.size === 0){
        return new Array(periodLength).fill(null).map((v,i)=>{
            return {
                year:period.start! + i,
                value:0
            }
        })
    }

    
    //period starts x years after startYear of loan, hence zeroFill x start values of output array
    const yearsAfterFirstInstallmentOfPeriodStart = period.start - firstInstallmentYear
    const zeroFill = yearsAfterFirstInstallmentOfPeriodStart < 0 ? firstInstallmentYear - period.start : 0
    
    const calculations : YearGraphingEntry[] = []


    //initialise accumulator for calculation
    let accumulator = {
        loanValue:0,
        repayments:{
            enforced:0,
            additional:0,
        },
        income:income.amount
    }

    for(let i = 0; i < yearsAfterFirstInstallmentOfPeriodStart + periodLength;i++){
        let currentYear = firstInstallmentYear + i

        //calculate enforced repayments based on income (0 if isActive flag in config is set to false)
        const enforced = !config.income.threshold.isActive ? 0 : function(loanValue : number,incomeAmount : number){
            if(incomeAmount <= income.threshold.amount){
                return 0
            }
    
            const enforcableAmount = (incomeAmount - income.threshold.amount) * income.threshold.enforcedRepaymentMutliplier
    
            //if the loan is entirely repaid,return loan value; else return enforcable amount
            return enforcableAmount > loanValue ? loanValue : enforcableAmount
        }(accumulator.loanValue,accumulator.income)
        //calculate any additional optional repayments (considering already paid enforced repayments)
        let additional = 0

        //if repayment option is provided, and there is still value left on loan to be repaid after enforced amount
        if(repayment && (accumulator.loanValue - enforced) > 0){
            const multiRepayment = repayment.multiplier ? (accumulator.loanValue * repayment.multiplier) - enforced : 0
            const absoluteRepayment = repayment.absolute ? repayment.absolute - enforced : 0

            //select larger of the two
            additional = multiRepayment >= absoluteRepayment ? multiRepayment : absoluteRepayment

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
        accumulator.loanValue *= interest

        //add new installment if present
        const installment = installments.get(currentYear)
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
                        total:enforced + additional,
                    },
                    cumulative:{
                        enforced:accumulator.repayments.enforced,
                        additional:accumulator.repayments.additional,
                        total:accumulator.repayments.additional + accumulator.repayments.enforced,
                    }
                },
                income:accumulator.income
            }
        }

        //apply any annual increase to income
        if(income.appreciation){
            const {absolute,multiplier,active} = income.appreciation
            if(active === "ABS"){
                accumulator.income += absolute
            } else if(active === "MULTI"){
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



export const useProvideGraphingData = () => {
    let [graphingData,setGraphingData] = useState<YearGraphingEntry[]>([])

    const {
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
    } = useConfig()

    useEffect(()=>{
        setGraphingData(()=>{
            const calculation = calculateGraphingData(
                {
                    installments:installments.state,
                    interest:interest.state,
                    income:{
                        amount:incomeAmount.state,
                        appreciation:{
                            active:incomeAppreciationActive.state,
                            multiplier:incomeAppreciationMulti.state,
                            absolute:incomeAppreciationAbsolute.state,
                        },
                        threshold:{
                            isActive:incomeThresholdIsActive.state,
                            amount:incomeThresholdAmount.state,
                            enforcedRepaymentMutliplier:incomeThresholdEnforcedMultiplier.state,
                        }
                    },
                    repayment:{
                       multiplier:repaymentMultiplier.state,
                       absolute:repaymentAbsolute.state, 
                    }
                },
                {
                    period:{}
                }
            )
            return calculation
        })   

    },[
        installments.state,
        interest.state,
        incomeAmount.state,
        incomeAppreciationActive.state,
        incomeAppreciationMulti.state,
        incomeAppreciationAbsolute.state,
        incomeThresholdAmount.state,
        incomeThresholdEnforcedMultiplier.state,
        incomeThresholdIsActive.state,
        repaymentAbsolute.state,
        repaymentMultiplier.state,
    ])


    return {
        graphingData
    }
}

export const GraphingDataContext = createContext<ReturnType<typeof useProvideGraphingData>>({} as ReturnType<typeof useProvideGraphingData>)

export const GraphingDataProvider = ({children} : {children:ReactNode}) => {
    const graphingData = useProvideGraphingData()

    return (
        <GraphingDataContext.Provider value={graphingData}>
            {children}
        </GraphingDataContext.Provider>
    )
}