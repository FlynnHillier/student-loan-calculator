import {useContext,useState} from "react"
import { ConfigContext } from "../contexts/config.context"

export const useConfig = () => {
    return useContext(ConfigContext)
}