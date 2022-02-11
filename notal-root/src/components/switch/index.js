
const Switch = ({ onChange, value, icon, className }) => {
    return (<div className={`${className} flex`}>
        <input type="checkbox" value={value} onChange={onChange} className="hidden" role="switch" id="switch" />
        <label for="switch" className="h-full w-10 cursor-pointer">
            <div className={`w-11 h-6 ${value ? "bg-green-700" : "dark:bg-neutral-600 bg-neutral-200"} transition-all ease-in-out rounded-full flex items-center ${value ? "justify-end" : "justify-start"}`}>
                <div className={`w-4 h-4 ${value ? "mr-1" : "ml-1"} rounded-full bg-white`}>
                    {icon}
                </div>
            </div>
        </label>
    </div>)
}

export default Switch;