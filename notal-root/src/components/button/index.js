
const Button = ({ children, className, icon, gradient = false, light = false, size = "md", onClick, rounded = false }) => {
    return (<button onClick={onClick} className={`${className ? className + " " : ""}${light ? "bg-transparent hover:bg-transparent active:bg-gray-800/50 " : ""}${gradient ? "bg-gradient-to-r from-blue-600 to-pink-600 " : ""}${size == "md" ? "" : size == "lg" ? "h-10 " : size == "sm" ? "h-8 " : ""}hover:opacity-80 active:opacity-100 flex flex-row items-center p-4 py-2 relative bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 transition-all duration-75 ${rounded ? "rounded-full " : "rounded-xl "}text-sm text-white font-semibold`}>
        {icon && <span className="absolute left-2">{icon}</span>}
        <span className="mx-auto flex flex-row items-center">{children}</span>
    </button>)
}

export default Button;