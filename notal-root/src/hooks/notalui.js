import { createContext, useContext, useEffect, useState, } from "react";

const toastContext = createContext();

export default function useNotalUI() {
    return useContext(toastContext);
}

export function NotalUIProvider(props) {
    const [toastBuffer, setToastBuffer] = useState([]);
    const [activeToasts, setActiveToasts] = useState([]);


    // toast sırası ve active toastlar olacak

    useEffect(() => {

    }, [toastBuffer]);

    const Toast = {
        trigger: ({ title, desc }) => {
            setToastBuffer([{ title, desc }]);
            alert("triggered!!");
        }
    }

    const value = { activeToasts, Toast }

    return <toastContext.Provider value={value} {...props} />
}