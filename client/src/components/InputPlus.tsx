import {useState,useRef, useEffect} from 'react'
import "./../styles/inputPlus.css"
import TypeConversionInput from './TypeConversionInput'
import { Tooltip as ReactTooltip } from "react-tooltip";

interface SelectionOption {
    setState:(...args:any[]) => any,
    state:any,
    interface:{
        label?:string,
        placeholder?:string,
        type?:"string" | "number",
        tooltip?:string,
    }
}

interface Props {
    options:SelectionOption[],
    onSelectionChange?:(selectionIndex:number)=>any
}


const InputPlus = ({options,onSelectionChange}:Props) => {
    const [activeSelectionIndex,setActiveSelectionIndex] = useState<number>(0)
    const [toolTipId,setToolTipId] = useState<string>("")


    const inputRef = useRef<any>(null)

    useEffect(()=>{
        setToolTipId(generateID())
    },[activeSelectionIndex])

    function changeSelection(){
        setActiveSelectionIndex((previousSelection)=>{
            previousSelection++
            if(previousSelection >= options.length){
                previousSelection = 0
            }
            onSelectionChange && onSelectionChange(previousSelection)
            return previousSelection
        })
    }

    function handleClick(){
        changeSelection()
        if(inputRef.current){
            inputRef.current.value = options[activeSelectionIndex].state
            selectLastCharacter()
        }
    }

    function selectLastCharacter(){
        //NOT WORKING.
        inputRef.current.focus()
        inputRef.current.type="text"
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
        inputRef.current.type = options[activeSelectionIndex].interface.type
    }

    function handleValueChange(value:string | number){
        options[activeSelectionIndex].setState(value)
    }

    function generateID(){
        const {label,placeholder,type} = options[activeSelectionIndex].interface

        return `inputPlus-${label}_${type}_${placeholder}`
    }

    return (
            options.length <= 0 ? <></> :
            <>
                <div className='inputplus frame'>
                    <button data-tooltip-id={toolTipId} className={`inputplus label ${options.length > 1 ? "isMulti" : ""}`} onClick={handleClick}>
                            {options[activeSelectionIndex].interface.label}
                    </button>
                    <TypeConversionInput
                        convertTo='number'
                        onValueChange={handleValueChange}
                        ref={inputRef}
                        className='inputplus input'
                        placeholder={options[activeSelectionIndex].interface.placeholder}
                        type={options[activeSelectionIndex].interface.type}
                        value={options[activeSelectionIndex].state}
                    />
                </div>
                {
                    options[activeSelectionIndex].interface.tooltip ? 
                    <ReactTooltip
                        anchorSelect={`[data-tooltip-id="${toolTipId}"]`}
                        place='left-start'
                        variant='dark'
                        className='inputplus tooltip'
                    >
                        <div className='inputplus tooltip'>
                            {options[activeSelectionIndex].interface.tooltip}
                        </div>
                    </ReactTooltip>
                    :
                    <></>
                }
            </> 
    )
}

export default InputPlus