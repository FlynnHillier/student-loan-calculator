import {useState, HTMLInputTypeAttribute, useEffect,useRef} from 'react'
import "./../styles/inputPlus.css"


interface SelectionOption {
    setState:(...args:any[]) => any,
    state:any,
    interface:{
        label?:string,
        placeholder?:string,
        type?:HTMLInputTypeAttribute
    }
}

interface Props {
    options:SelectionOption[],
    onSelectionChange?:(selectionIndex:number)=>any
}


const ToggleInput = ({options,onSelectionChange}:Props) => {
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

    function handleInput(event:React.ChangeEvent<HTMLInputElement>){
        if(event.target){
            options[activeSelectionIndex].setState(event.target.value || "")
        }
    }


    return (
            options.length <= 0 ? <></> : 
            <div className='inputplus frame'>
                <button className={`inputplus label ${options.length > 1 ? "isMulti" : ""}`} onClick={handleClick}>
                        {options[activeSelectionIndex].interface.label}
                </button>
                <input
                    ref={inputRef}
                    className='inputplus input'
                    placeholder={options[activeSelectionIndex].interface.placeholder}
                    type={options[activeSelectionIndex].interface.type}
                    onChange={handleInput}
                    value={options[activeSelectionIndex].state}
                />
            </div>
    )
}

export default ToggleInput