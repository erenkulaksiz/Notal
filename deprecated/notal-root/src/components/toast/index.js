import { useEffect, createElement } from "react";
import { motion } from "framer-motion";

import BuildComponent from "@utils/buildComponent";

import {
    CrossIcon,
    InfoIcon,
    Cross2Icon,
    CheckIcon
} from "@icons";

const ToastTypes = {
    default: {
        className: "dark:bg-neutral-700 bg-neutral-200"
    },
    error: {
        icon: <CrossIcon size={24} fill="currentColor" />,
        className: "dark:bg-red-600 bg-red-500 text-white"
    },
    info: {
        icon: <InfoIcon size={24} fill="currentColor" />,
        className: "dark:bg-blue-600 bg-blue-500 text-white"
    },
    success: {
        icon: <CheckIcon size={24} fill="currentColor" />,
        className: "dark:bg-green-600 bg-green-500 text-white"
    }
}

/**
 * 
 * @param {title} string 
 * @returns 
 */
const Toast = ({
    title,
    desc,
    icon,
    closeable = true,
    className,
    buttons,
    onClick,
    showClose = true,
    id,
    onRender,
    rendered,
    type,
}) => {

    useEffect(() => {
        if (!rendered) {
            onRender();
        }
    }, [rendered]);

    const NotalUIToast = ({ children, ...props }) => {
        return createElement(buttons ? motion.div : motion.a, props, children)
    }

    const BuildToast = BuildComponent({
        name: "NotalUI Toast Container",
        defaultClasses: "flex flex-row pointer-events-auto items-center m-2 p-2 rounded-lg shadow-xl",
        conditionalClasses: [{ true: "cursor-pointer" }, {
            default: className || ToastTypes.default.className,
            error: ToastTypes.error.className,
            info: ToastTypes.info.className,
            success: ToastTypes.success.className,
        }],
        selectedClasses: [closeable, type]
    });

    return (
        <NotalUIToast
            className={BuildToast.classes}
            onClick={onClick}
            variants={{
                show: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 120 }
            }}
            initial={rendered ? "show" : "hidden"}
            animate="show"
            exit="hidden"
            layout
            layoutId={id}
        >
            {icon && <div className="mr-2 h-full flex">
                {icon}
            </div>}
            {!icon && type && ToastTypes[type]?.icon && <div className="mr-2 h-full flex">
                {type && <div className="flex items-center justify-center">
                    {ToastTypes[type].icon}
                </div>}
            </div>}
            <div className="flex flex-col">
                {title && <span className="text-lg">{title}</span>}
                {desc && <span className="text-sm break-words">{desc}</span>}
            </div>
            {
                buttons && <div className="ml-2 flex flex-row h-full">
                    {buttons.map((button, index) => {
                        return <div key={index} className="w-[98%]">
                            {button}
                        </div>
                    })}
                </div>
            }
            {
                closeable && showClose && <button onClick={onClick} className="ml-2 bg-neutral-300/10 dark:bg-neutral-900/10 hover:opacity-80 rounded p-[2px] flex items-center justify-center">
                    <Cross2Icon width={14} height={14} fill="currentColor" />
                </button>
            }
        </NotalUIToast>
    )
}

export default Toast;