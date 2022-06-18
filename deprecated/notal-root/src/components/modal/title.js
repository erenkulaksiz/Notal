import { motion } from "framer-motion";

import { ChildrenAnim } from ".";

const Title = ({ children, className, animate = false }) => {
    return (<motion.div
        className={`${className ? className + " " : ""}w-full min-h-[2.4rem] justify-center flex items-center`}
        variants={animate && ChildrenAnim}
    >
        {children}
    </motion.div>)
}

export default Title;