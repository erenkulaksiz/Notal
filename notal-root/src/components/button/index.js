import { createElement } from 'react';
import {
    conditionalClass,
    allClass
} from '@utils/conditionalClass';

import BuildComponent from '@utils/buildComponent';
import { Loading } from '@components';

const Button = ({
    children,
    className,
    icon,
    onClick,
    gradient = false,
    light = false,
    size = "md",
    rounded = false,
    fullWidth = false,
    ring = true,
    loading = false,
    form,
    as = "button",
    ...props
}) => {

    const iconSpace = conditionalClass({
        keys: {
            default: "left-4",
            md: "left-2"
        },
        selected: size,
    });

    const iconClasses = allClass({
        defaultClasses: "absolute left-0",
        conditions: [iconSpace]
    });

    const BuildButton = BuildComponent({
        name: "Button",
        defaultClasses: "cursor-pointer z-10 overflow-hidden hover:opacity-80 active:opacity-80 flex flex-row items-center p-4 py-2 relative active:scale-95 transition-all duration-75 text-white font-semibold text-sm",
        extraClasses: className,
        conditionalClasses: [
            {
                default: fullWidth,
                false: "w-auto",
                true: "w-full"
            },
            {
                default: rounded,
                false: "rounded-xl",
                true: "rounded-full"
            },
            {
                true: "bg-gradient-to-r from-sky-600 to-violet-700"
            },
            {
                default: size,
                sm: "h-8",
                lg: "h-12",
                xl: "h-16",
            },
            {
                default: light,
                false: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 outline-none focus:outline-blue-500/50",//also remove ring
                true: "bg-transparent hover:bg-transparent active:dark:bg-neutral-800/50 active:bg-neutral-200/50"
            },
            {
                default: "focus:outline-2 " + ring,
                true: "focus:outline-2",
            }
        ],
        selectedClasses: [
            fullWidth,
            rounded,
            gradient,
            size,
            light,
            ring,
        ]
    });

    const ButtonEl = ({ children, ...props }) => {
        return createElement(as, props, children)
    }

    return (<ButtonEl onClick={onClick} className={BuildButton.classes} {...props} form={form}>
        {icon && <span className={iconClasses}>{icon}</span>}
        <span className="mx-auto flex flex-row items-center">{children}</span>
        {loading && <div className="absolute left-0 right-0 bottom-0 top-0 dark:bg-neutral-900/90 bg-neutral-200/50 flex items-center justify-center">
            <Loading size="lg" />
        </div>}
    </ButtonEl>)
}

export default Button;