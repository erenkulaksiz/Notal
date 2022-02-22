import {
    conditionalClass,
    allClass
} from '@utils/conditionalClass';

const Button = ({
    children,
    className,
    icon,
    onClick,
    gradient = false,
    light = false,
    size = "md",
    rounded = false,
    fullWidth = false
}) => {
    const widthClass = conditionalClass({
        keys: {
            default: "w-auto",
            fullWidth: "w-full",
        },
        selected: fullWidth && "fullWidth"
    });

    const roundedClass = conditionalClass({
        keys: {
            default: "rounded-xl",
            rounded: "rounded-full"
        },
        selected: rounded && "rounded"
    });

    const gradientClass = conditionalClass({
        keys: {
            gradient: "bg-gradient-to-r from-sky-600 to-violet-700"
        },
        selected: gradient && "gradient"
    });

    const sizeClass = conditionalClass({
        keys: {
            sm: "h-8",
            lg: "h-12",
            xl: "h-16",
        },
        selected: size
    });

    const ringClass = conditionalClass({
        keys: {
            ring: "outline-none focus:outline-2 focus:outline-blue-500/50"
        },
        selected: !light && "ring"
    })

    const type = conditionalClass({
        keys: {
            default: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700",
            light: "bg-transparent hover:bg-transparent active:bg-gray-800/50"
        },
        selected: light ? "light" : "default"
    });

    const classes = allClass({ // gather all classes
        defaultClasses: "z-10 hover:opacity-80 active:opacity-100 flex flex-row items-center p-4 py-2 relative active:scale-95 transition-all duration-75 text-white font-semibold text-sm",
        extraClasses: className,
        conditions: [sizeClass, type, gradientClass, roundedClass, widthClass, ringClass]
    });

    const iconSpace = conditionalClass({
        keys: {
            default: "left-4",
            md: "left-2"
        },
        selected: size,
    })

    const iconClasses = allClass({
        defaultClasses: "absolute",
        conditions: [iconSpace]
    })

    return (<button onClick={onClick} className={classes}>
        {icon && <span className={iconClasses}>{icon}</span>}
        <span className="mx-auto flex flex-row items-center">{children}</span>
    </button>)
}

export default Button;