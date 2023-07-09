import React from 'react'
import "../styles/inputPlusGroup.css"

interface GroupProps {
    children?:React.ReactNode
}

interface LabelProps {
    text:string
}

export const InputPlusGroup = ({children}:GroupProps) => {
  return (
    <div className="inputPlusGroup">
        {children}
    </div>
  )
}

export const InputPlusLabel = ({text}: LabelProps) => {
    return (
        <span className="label">
            {text}
        </span>
    )
}

export const InputPlusSubLabel = ({text}: LabelProps) => {
    return (
        <span className="sublabel">
            {text}
        </span>
    )
}