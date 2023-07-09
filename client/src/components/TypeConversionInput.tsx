import React,{useEffect, useState} from 'react'

type SupportedConversionType = string | number

interface SimpleProps {
  value?:SupportedConversionType
  onValueChange:(value:SupportedConversionType) => any
  convertTo:"number" | "string"
}

interface ForwardedProps extends React.InputHTMLAttributes<HTMLInputElement>  {
  children?:React.ReactNode
}

type Props = SimpleProps & ForwardedProps

const TypeConversionInput = React.forwardRef<HTMLInputElement,Props>(({children,onValueChange,convertTo,value,...props}:Props,ref) => {
    let [inputValue,setInputValue] = useState<SupportedConversionType>(value || "") 

    useEffect(()=>{
      setInputValue(value || "")
    },[value])
    
    function handleChange(event:React.ChangeEvent<HTMLInputElement>){
      const setTo = function(){
        switch (convertTo){
          case "number":
            return Number(event.target.value)
          case "string":
            return event.target.value
          default:
            return "" //return empty string on error to make identifying such an error easier, as type errors can be hard to identify when using GUI
        }
      }()
      setInputValue(setTo)
      onValueChange(setTo)
    }

    return <input
        ref={ref}
        onChange={handleChange}
        value={inputValue}
        {...props}
    >
      {children}
    </input>
})

export default TypeConversionInput