import BuildComponent from "@utils/buildComponent";

const Input = ({
    onChange,
    value,
    fullWidth = false,
    placeholder,
    containerClassName,
    className,
    height,
    rounded = false,
    icon
}) => {

    const BuildInputContainer = BuildComponent({
        name: "Input Container",
        defaultClasses: "h-11 flex flex-row relative items-center",
        extraClasses: containerClassName,
        conditionalClasses: [
            {
                true: "rounded-xl",
            },
            {
                default: "h-11",
                custom: height,
            },
            {
                false: "rounded-xl",
                true: "rounded-full",
            },
        ],
        selectedClasses: [
            fullWidth,
            height && "custom",
            rounded
        ]
    });

    const BuildInput = BuildComponent({
        name: "Input",
        defaultClasses: "outline-none focus:outline-2 focus:outline-blue-500/50 w-full h-full px-4 border-2 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 placeholder:text-neutral-400 placeholder:text-sm",
        extraClasses: className,
        conditionalClasses: [
            {
                false: "rounded-xl",
                true: "rounded-full",
            },
            {
                true: "absolute pl-8"
            }
        ],
        selectedClasses: [
            rounded,
            icon && true
        ]
    });

    return (<div className={BuildInputContainer.classes}>
        {icon && <span className="z-20 absolute left-2 fill-inherit" style={{ transform: "scale(0.8)" }}>{icon}</span>}
        <input value={value} type="text" onChange={onChange} className={BuildInput.classes} placeholder={placeholder} />
    </div>)
}

export default Input;