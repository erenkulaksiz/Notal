import {
    conditionalClass,
    allClass
} from '@utils/conditionalClass';

import BuildComponent from '@utils/buildComponent';
import React from 'react';

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
        defaultClasses: "absolute",
        conditions: [iconSpace]
    });

    const BuildButton = BuildComponent({
        name: "Button",
        defaultClasses: "cursor-pointer z-10 hover:opacity-80 active:opacity-100 flex flex-row items-center p-4 py-2 relative active:scale-95 transition-all duration-75 text-white font-semibold text-sm",
        extraClasses: className,
        conditionalClasses: [
            {
                false: "w-auto",
                true: "w-full"
            },
            {
                false: "rounded-xl",
                true: "rounded-full"
            },
            {
                true: "bg-gradient-to-r from-sky-600 to-violet-700"
            },
            {
                sm: "h-8",
                lg: "h-12",
                xl: "h-16",
            },
            {
                false: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 outline-none focus:outline-2 focus:outline-blue-500/50",//also remove ring
                true: "bg-transparent hover:bg-transparent active:bg-gray-800/50"
            }
        ],
        selectedClasses: [
            fullWidth,
            rounded,
            gradient,
            size,
            light,
        ]
    });

    const ButtonEl = ({ ...props }) => (React.createElement(as, props));

    return (<ButtonEl onClick={onClick} className={BuildButton.classes} {...props}>
        {icon && <span className={iconClasses}>{icon}</span>}
        <span className="mx-auto flex flex-row items-center">{children}</span>
    </ButtonEl>)
}

export default Button;