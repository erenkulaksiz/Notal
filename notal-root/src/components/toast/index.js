import { useEffect, createElement } from "react";
import { motion } from "framer-motion";

import BuildComponent from "@utils/buildComponent";
import { Cross2Icon } from "@icons";

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
        extraClasses: className,
        conditionalClasses: [{ true: "cursor-pointer" }],
        selectedClasses: [closeable]
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