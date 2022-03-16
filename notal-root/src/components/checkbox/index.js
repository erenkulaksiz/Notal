import { CheckIcon } from "@icons";

const Checkbox = ({ value, onChange, className, children, id }) => {
    return (<div className={`${className ? className + " " : ""}flex flex-row`}>
        <input className="hidden" type="checkbox" value={value} onChange={onChange} id={id} />
        {children && <label className="flex flex-row items-center cursor-pointer group" htmlFor={id}>
            <div className={`${value ? "bg-green-500 dark:bg-green-800 " : ""}relative h-4 w-4 outline-none group-focus:outline-2 group-focus:outline-blue-500/50 transition-colors ease-in-out flex items-center text-xs justify-center rounded-md border-2 dark:border-neutral-600 ${children ? "mr-2" : ""}`}>
                {value && <CheckIcon size={24} fill="white" style={{ transform: "scale(0.5)" }} className="absolute" />}
            </div>
            {children}
        </label>}
    </div>)
}

export default Checkbox;