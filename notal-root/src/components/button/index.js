
const Button = ({ children, className, icon, gradient = false }) => {
    return (<button className={`${className} ${gradient && "bg-gradient-to-r from-blue-600 to-pink-600"} hover:opacity-80 active:opacity-100 flex flex-row items-center p-4 py-2 relative bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 transition-all ease-in-out rounded-xl py-2 text-sm text-white font-semibold`}>
        {icon && <span className="absolute">{icon}</span>}
        <span className="mx-auto">{children}</span>
    </button>)
}

export default Button;