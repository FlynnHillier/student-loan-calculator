import React from 'react'
import "../styles/inputInterface.css"

import { InputPlusGroup,InputPlusLabel,InputPlusSubLabel } from './InputPlusGroup'
import InputPlus from './InputPlus'
import MapDataStructureInteraction from './MapDataStructureInteraction'


import { useConfig } from '../hooks/useConfig'




const InputInterface = () => {
    const {
      interest,
      incomeAmount,
      installments,
      incomeAppreciationMulti,
      incomeAppreciationAbsolute,
      incomeAppreciationActive,
      incomeThresholdAmount,incomeThresholdEnforcedMultiplier,
      repaymentAbsolute,
      repaymentMultiplier
    } = useConfig()
  
  
    return (
      <div className="inputInterface frame">
        <div className="inputSection">
          <InputPlus
            options={[
              {
                setState:interest.set,
                state:interest.state,
                interface:{
                  label:"loan interest %",
                  type:"number",
                  tooltip:"annual interest on loans, given as a multiplier (e.g 9% increase = 1.09)",
                }
              }
            ]}
          />
          

          <InputPlusGroup>
            <InputPlusLabel text='Income'/>
            <InputPlus
              options={[
                {
                  setState:incomeAmount.set,
                  state:incomeAmount.state,
                  interface:{
                    label:"income",
                    type:"number",
                    tooltip:"your income in £",
                  }
                }
              ]}
            />
            <InputPlus
              onSelectionChange={(index)=>{
                if(index === 0){
                  incomeAppreciationActive.set("MULTI")
                }
                if(index === 1){
                  incomeAppreciationActive.set("ABS")
                }
              }}
              options={[
                {
                  setState:incomeAppreciationMulti.set,
                  state:incomeAppreciationMulti.state,
                  interface:{
                    label:"annual growth %",
                    type:"number",
                    tooltip:"annual income growth, given as a multiplier (e.g 9% increase = 1.09)",
                  }
                },
                {
                  setState:incomeAppreciationAbsolute.set,
                  state:incomeAppreciationAbsolute.state,
                  interface:{
                    label:"annual growth value",
                    type:"number",
                    tooltip:"annual income growth, given as an absolute value",
                  }
                }
              ]}
            />

            <InputPlusSubLabel text="Threshold"/>
            <InputPlus
              options={[
                {
                  setState:incomeThresholdAmount.set,
                  state:incomeThresholdAmount.state,
                  interface:{
                    label:"amount",
                    type:"number",
                    tooltip:"the income amount in which any income above this level will be subject to enforced repayments",
                  }
                }
              ]}
            />

          <InputPlus
              options={[
                {
                  setState:incomeThresholdEnforcedMultiplier.set,
                  state:incomeThresholdEnforcedMultiplier.state,
                  interface:{
                    label:"enforced repayment %",
                    type:"number",
                    tooltip:"the percentage of income above the given threshold that must be paid annually toward the loan, given as a percentage (e.g 9% = 0.09)",
                  }
                }
              ]}
            />
        </InputPlusGroup>

        <InputPlusGroup>
            <InputPlusLabel text='minimum repayment'/>
            <InputPlus
              
              options={[
                {
                  state:repaymentAbsolute.state,
                  setState:repaymentAbsolute.set,
                  interface:{
                    label:"repayment value",
                    type:"number",
                    tooltip:"optional repayment, given as an absolute. Note: the larger value of % or absolute will be used in calculations, not both."
                  }
                }
              ]}
            />
            <InputPlus
              options={[
                {
                  state:repaymentMultiplier.state,
                  setState:repaymentMultiplier.set,
                  interface:{
                    label:"repayment %",
                    type:"number",
                    tooltip:"optional repayment, given as a percentage. Note: the larger value of % or absolute will be used in calculations, not both."
                  }
                }
              ]}
            />
              
        </InputPlusGroup>

        </div>
        <div className="installMentSection">
          <MapDataStructureInteraction
            mapState={installments.state}
            setMapState={installments.set}
            title='installments'
            input={{
              keyType:"number",
              valueType:"number",
              valuePlaceHolder:"loan-value",
              keyPlaceHolder:"year",
            }}
          />
        </div>
      </div>
    )
}

export default InputInterface