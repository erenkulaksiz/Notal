import { useState, useEffect } from "react";

const Button = ({ children, className, icon, gradient = false, light = false, size = "md", onClick, rounded = false }) => {
    const [sizeState, setSize] = useState("");

    useEffect(() => {
        switch (size) {
            case "sm":
                setSize("h-8 ");
                break;
            case "md":
                setSize("");
                break;
            case "lg":
                setSize("h-12 ");
                break;
            case "xl":
                setSize("h-16 ");
                break;
        }
    }, [size]);

    return (<button onClick={onClick} className={`${className ? className + " " : ""}${light ? "bg-transparent hover:bg-transparent active:bg-gray-800/50 " : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 "}${gradient ? "bg-gradient-to-r from-sky-600 to-violet-700 " : ""}${sizeState}hover:opacity-80 active:opacity-100 flex flex-row items-center p-4 py-2 relative active:scale-95 transition-all duration-75 ${rounded ? "rounded-full " : "rounded-xl "}text-sm text-white font-semibold`}>
        {icon && <span className={`absolute ${size == "md" ? "left-2 " : "left-4 "}`}>{icon}</span>}
        <span className="mx-auto flex flex-row items-center">{children}</span>
    </button>)
}

export default Button;