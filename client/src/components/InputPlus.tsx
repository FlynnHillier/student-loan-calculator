import {useState,useRef} from 'react'
import "./../styles/inputPlus.css"
import TypeConversionInput from './TypeConversionInput'

interface SelectionOption {
    setState:(...args:any[]) => any,
    state:any,
    interface:{
        label?:string,
        placeholder?:string,
        type?:"string" | "number"
    }
}

interface Props {
    options:SelectionOption[],
    onSelectionChange?:(selectionIndex:number)=>any
}


const InputPlus = ({options,onSelectionChange}:Props) => {
    const [activeSelectionIndex,setActiveSelectionIndex] = useState<number>(0)

    const inputRef = useRef<any>(null)

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

    return (
            options.length <= 0 ? <></> : 
            <div className='inputplus frame'>
                <button className={`inputplus label ${options.length > 1 ? "isMulti" : ""}`} onClick={handleClick}>
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
    )
}

export default InputPlus