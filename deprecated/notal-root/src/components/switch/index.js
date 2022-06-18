import { motion } from "framer-motion";

import BuildComponent from "@utils/buildComponent";

/*
    Provide id prop for switch!!
*/
const Switch = ({
    onChange,
    value,
    icon,
    className,
    ...props
}) => {

    const BuildSwitchContainer = BuildComponent({
        name: "Switch Container",
        defaultClasses: "flex",
        extraClasses: className,
    });

    const BuildSwitch = BuildComponent({
        name: "Switch",
        defaultClasses: "w-full h-6 transition-all ease-in-out rounded-full flex items-center",
        conditionalClasses: [
            {
                true: "bg-green-700 justify-end",
                false: "dark:bg-neutral-600 bg-neutral-200 justify-start"
            }
        ],
        selectedClasses: [
            value,
        ]
    });

    const BuildSwitchInside = BuildComponent({
        name: "Switch Inside",
        defaultClasses: "w-4 h-4 rounded-full text-black dark:text-white bg-white dark:bg-black",
        conditionalClasses: [
            {
                true: "mr-1",
                false: "ml-1"
            }
        ],
        selectedClasses: [
            value,
        ]
    });

    return (<div className={BuildSwitchContainer.classes}>
        <input type="checkbox" id={props.id} checked={value} onChange={onChange} className="hidden" {...props} />
        <label htmlFor={props.id} className="h-full w-10 cursor-pointer">
            <div className={BuildSwitch.classes}>
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }}
                    className={BuildSwitchInside.classes}
                >
                    {icon}
                </motion.div>
            </div>
        </label>
    </div>)
}

export default Switch;