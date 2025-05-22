import { createContext, useState } from "react";
import {BeatLoader} from "react-spinners";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)
        
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const currency = "₹"
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }
    
    const Loader = ({ color }) => (
        <BeatLoader color={color || "#5f6FFF"} size={10} loading={true} />
    );
    
    
    
    const value = {
        currency,
        calculateAge, slotDateFormat,
        Loader
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider