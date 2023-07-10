import React, { useEffect,useState,HTMLInputTypeAttribute,useRef} from 'react'
import "./../styles/mapDataStructureInteraction.css"
import {PiPlus} from "react-icons/pi"
import {RxCross2} from "react-icons/rx"
import {useFocusWithin} from 'react-aria';
import TypeConversionInput from './TypeConversionInput';


interface Props {
    title?:string
    mapState:Map<KeyType,ValueType>
    setMapState:React.Dispatch<React.SetStateAction<Map<any, any>>>
    input?:{
        valueType?:"string" | "number",
        keyType?:"string" | "number",
        keyPlaceHolder?:string,
        valuePlaceHolder?:string,
    }
}

type KeyType = string | number

type ValueType = string | number


const MapDataStructureInteraction = ({mapState,setMapState,title,input}:Props) => {
    let [arrayRepresentation,setArrayRepresentation] = useState<[key:KeyType, value:ValueType][]>(Array.from(mapState.entries()))

    //temporary state to prevent state being updated on every ammendment. Only update once user deselects input field.
    let [activeEditKey,setActiveEditKey] = useState<null | KeyType>(null)
    let [activeEditValue,setActiveEditValue] = useState<null | ValueType>(null)
    
    //new entry state (allows user to add a new entry to map)
    let [isCreatingNewEntry,setIsCreatingNewEntry] = useState<boolean>(false)
    let [newEntryIsFocusedWithin,setNewEntryIsFocusedWithin] = useState<boolean>(false)
    let [newEntryKey,setNewEntryKey] = useState<KeyType>("")
    let [newEntryValue,setNewEntryValue] = useState<ValueType>("")

    const newEntryKeyInputRef = useRef<any>(null)

    let { focusWithinProps } = useFocusWithin({
        onFocusWithinChange: (isFocusWithin) => setNewEntryIsFocusedWithin(isFocusWithin)
    });

    //when user defocuses new entry input's, end the entry
    useEffect(()=>{
        if(!newEntryIsFocusedWithin && isCreatingNewEntry){
            endNewEntry()
        }
    },[newEntryIsFocusedWithin])

    //when user begins creatingnewentry focus key input
    useEffect(()=>{
        if(isCreatingNewEntry){
            newEntryKeyInputRef.current && newEntryKeyInputRef.current.focus()
        }
    },[isCreatingNewEntry])

    //track map with accurate array representation for mapping purposes.
    useEffect(()=>{
        setArrayRepresentation(Array.from(mapState.entries()))
    },[mapState])

    
    //## EDIT EXISTING MAP ENTRY ##
    function handleExistingValueChange(event:React.ChangeEvent<HTMLInputElement>,key:KeyType) {        
        setActiveEditKey(key)
        setActiveEditValue(event.target.value)
    }

    //commit changes once user defocuses input field (prevent excessive state updates)
    function handleBlur(key:KeyType){
        if(key === activeEditKey && activeEditValue){
            commitChange(key,activeEditValue)
        }
    }
    
    //update map state with user edits
    function commitChange(key:KeyType,value:ValueType){
        setMapState((prev)=>{
            prev.set(key,value)
            setActiveEditKey(null)
            setActiveEditValue(null)
            return new Map(prev)
        })
    }

    //## REMOVE EXISTING MAP ENTRY ##
    function onClickRemoveEntry(key:KeyType) {
        setMapState((prev)=>{
            prev.delete(key)
            return new Map(prev)
        })
    }

    //## ADD EXISTING MAP ENTRY ##

    //handle when user clicks the add entry icon
    function onClickAddEntry() {
        setIsCreatingNewEntry(true)
        newEntryKeyInputRef.current && newEntryKeyInputRef.current.focus()
    }

    //query wether user inputs are currently suitable for new map entry
    function isSuitableNewEntry(){
        return newEntryKey && newEntryValue
    }

    //call once user is no longer entering (or whishes to be done doing so) details regarding new entry
    function endNewEntry(){
        setIsCreatingNewEntry(false)
        if(isSuitableNewEntry()){
            attemptAddEntry(newEntryKey,newEntryValue)
        }
        clearNewEntryState()
    }

    //attempt to update state with a new map entry
    function attemptAddEntry(key:KeyType,value:ValueType){
        if(key && value){
            setMapState((prev)=>{
                prev.set(key,value)
                return new Map(prev)
            })
        }
    }

    //update newEntryValue state on user input
    function handleNewEntryValueChange(value: ValueType) {
        setNewEntryValue(value)
    }

    //update newEntryKey state on user input
    function handleNewEntryKeyChange(value: KeyType) {
        setNewEntryKey(value)
    }

    //listen for enter key presses in order to allow users to submit new entry with keyboard
    function handleNewEntryKeyDown(event:React.KeyboardEvent<HTMLInputElement>){
        if(event.code === "Enter"){
            if(isSuitableNewEntry()){
                endNewEntry()
            }
        }
    }

    //reset new entry state ready for another creation
    function clearNewEntryState(){
        setNewEntryKey("")
        setNewEntryValue("")
    }




    return (
        <div className="inputTheme">
            <div className='MapDataStructureInteraction frame'>
                {   
                    !title ? <></> :
                    <div className="banner">
                        {title}
                    </div>
                }
                <div className="entryFrame">
                    {
                        arrayRepresentation.map((keyValuePair)=>{
                            let [key,value] = keyValuePair

                            return (
                                <div className='entry' key={key}>
                                    <div className="key">
                                        {key}
                                        <RxCross2 className="removeIcon"
                                            onClick={()=>{
                                                onClickRemoveEntry(key)
                                            }}
                                        />
                                    </div>
                                    <input 
                                        className='editValue'
                                        value={activeEditKey !== key ? value : activeEditValue || "ERROR."} 
                                        type={input?.valueType}
                                        onChange={(event)=>{
                                            handleExistingValueChange(event,key)
                                        }}
                                        onBlur={()=>{
                                            handleBlur(key)
                                        }}                                    />
                                </div>
                            )
                        })
                    }
                    <div className='entry'
                        {...focusWithinProps}
                        style={{
                            display:!isCreatingNewEntry ? "none" : "flex"
                        }}
                    >
                        <div className="key">
                            <TypeConversionInput
                                convertTo={input?.keyType || "string"}
                                onValueChange={handleNewEntryKeyChange} 
                                type={input?.keyType} 
                                ref={newEntryKeyInputRef}
                                value={newEntryKey}
                                onKeyDown={handleNewEntryKeyDown}
                                placeholder={input?.keyPlaceHolder}
                            />
                        </div>
                        <TypeConversionInput 
                            onValueChange={handleNewEntryValueChange}
                            convertTo={input?.valueType || "string"}
                            className='editValue'
                            type={input?.valueType}
                            value={newEntryValue}
                            onKeyDown={handleNewEntryKeyDown}
                            placeholder={input?.valuePlaceHolder}
                        />
                    </div>
                </div>

                <div className="additionIconFrame" 
                    style={{
                        visibility:isCreatingNewEntry ? "hidden" : "visible"
                    }}
                >
                    <PiPlus className='additionIcon' size={30}
                        onClick={onClickAddEntry}
                    />
                </div>
            </div>
        </div>
    )
}

export default MapDataStructureInteraction