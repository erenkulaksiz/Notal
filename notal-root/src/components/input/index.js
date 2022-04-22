import { createElement } from "react";
import BuildComponent from "@utils/buildComponent";

const Input = ({
    onChange,
    onEnterPress,
    value,
    fullWidth = false,
    placeholder,
    containerClassName,
    className,
    height,
    textarea = false,
    rounded = false,
    autoFocus = false,
    icon,
    id,
    maxLength,
}) => {
    const InputElement = textarea ? "textarea" : "input";

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
            }
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
            },
            {
                true: "resize-none"
            }
        ],
        selectedClasses: [
            rounded,
            icon && true,
            textarea
        ]
    });

    return (<div className={BuildInputContainer.classes}>
        {icon && <span className="z-20 absolute left-2 fill-inherit" style={{ transform: "scale(0.8)" }}>{icon}</span>}
        <InputElement
            id={id}
            value={value}
            type={!textarea ? "text" : ""}
            key={id}
            autoFocus={autoFocus}
            onChange={onChange}
            className={BuildInput.classes}
            placeholder={placeholder}
            maxLength={maxLength}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    if (typeof onEnterPress === "function") {
                        onEnterPress();
                    }
                }
            }}
        />
    </div>)
}

export default Input;