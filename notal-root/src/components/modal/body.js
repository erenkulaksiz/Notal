import BuildComponent from "@utils/buildComponent";
import { motion } from "framer-motion";

import { ChildrenAnim } from ".";

const Body = ({ children, className, animate = false }) => {

    const BuildModalBody = BuildComponent({
        name: "Modal Body",
        defaultClasses: "w-full h-auto flex items-start flex-col",
        extraClasses: className,
    })

    return (<motion.div
        className={BuildModalBody.classes}
        variants={animate && ChildrenAnim}
    >
        {children}
    </motion.div>)
}

export default Body;