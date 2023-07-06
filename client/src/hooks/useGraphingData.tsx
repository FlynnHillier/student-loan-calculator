import { useState,useEffect } from "react";
import { useConfig } from "./useConfig";
import { YearGraphingEntry,Year, Multiplier, ConfigEntries } from "../types/types";


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
        period.end = period.start + 22
    }

    const periodLength = period.end - period.start + 1

    if(periodLength < 1){
        return []
    }

    if(installments.size === 0){
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












export const useGraphingData = () => {
    let [graphingData,setGraphingData] = useState<YearGraphingEntry[]>([])

    
    const {installments,interest} = useConfig()

    useEffect(()=>{
        setGraphingData(()=>{
            return calculateGraphingData(
                {
                    installments:installments,
                    interest:interest,
                    income:{
                        amount:0,
                        appreciation:{
                            active:"NONE",
                            multiplier:1,
                            absolute:0,
                        },
                        threshold:{
                            isActive:true,
                            amount:25000,
                            enforcedRepaymentMutliplier:1.09,
                        }
                    },
                    repayment:{}
                },
                {
                    period:{}
                }
            )
        })   
    },[installments,interest])


    return {
        graphingData
    }
}