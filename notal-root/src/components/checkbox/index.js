import { CheckIcon } from "@icons";

const Checkbox = ({ value, onChange, className, content }) => {
    return (<div className={`${className ? className + " " : ""}flex flex-row`}>
        <input className="hidden" type="checkbox" value={value} onChange={onChange} id="flexCheckDefault" />
        {content && <label className={`flex flex-row items-center cursor-pointer`} htmlFor="flexCheckDefault">
            <div className={`${value ? "bg-green-500 dark:bg-green-600/70 " : ""}h-4 w-4 transition-colors ease-in-out flex items-center text-xs justify-center rounded-md border-2 dark:border-neutral-600 ${content ? "mr-2" : ""}`}>
                {value && <CheckIcon size={24} fill="white" style={{ transform: "scale(0.5)" }} />}
            </div>
            {content}
        </label>}
    </div>)
}

export default Checkbox;