
const Input = ({ onChange, fullWidth, placeholder, containerClassName, className }) => {
    return (<div className={`${fullWidth ? "w-full " : "w-64 "}${containerClassName ? containerClassName + " " : ""}h-11`}>
        <input type="text" onChange={onChange} className={`${className ? className + " " : ""}w-full h-full rounded-xl px-4 border-2 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 placeholder:text-neutral-400 placeholder:text-sm`} placeholder={placeholder} />
    </div>)
}

export default Input;