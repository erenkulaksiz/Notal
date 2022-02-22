import {
    conditionalClass,
    allClass
} from '@utils/conditionalClass';

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

    const iconClasses = conditionalClass({
        keys: {
            icon: "absolute pl-8"
        },
        selected: icon && "icon",
    })

    const roundedClass = conditionalClass({
        keys: {
            default: "rounded-xl",
            rounded: "rounded-full"
        },
        selected: rounded && "rounded"
    });

    const widthClass = conditionalClass({
        keys: {
            fullWidth: "w-full",
        },
        selected: fullWidth && "fullWidth"
    });

    const inputClasses = allClass({ // gather all classes
        defaultClasses: "outline-none focus:outline-2 focus:outline-blue-500/50 w-full h-full px-4 border-2 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 placeholder:text-neutral-400 placeholder:text-sm",
        extraClasses: className,
        conditions: [roundedClass, iconClasses]
    });

    const heightClass = conditionalClass({
        keys: {
            default: "h-11",
            custom: height
        },
        selected: height && "custom"
    })

    const containerClasses = allClass({
        defaultClasses: "h-11 flex flex-row relative items-center",
        extraClasses: containerClassName,
        conditions: [widthClass, heightClass, roundedClass],
    })

    return (<div className={containerClasses}>
        {icon && <span className="z-20 absolute left-2 fill-inherit" style={{ transform: "scale(0.8)" }}>{icon}</span>}
        <input value={value} type="text" onChange={onChange} className={inputClasses} placeholder={placeholder} />
    </div>)
}

export default Input;