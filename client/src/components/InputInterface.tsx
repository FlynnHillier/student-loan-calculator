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
                  label:"loan interest"
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
                  }
                },
                {
                  setState:incomeAppreciationAbsolute.set,
                  state:incomeAppreciationAbsolute.state,
                  interface:{
                    label:"annual growth value",
                    type:"number",
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
              valueType:"number"
            }}
          />
        </div>
      </div>
    )
}

export default InputInterface