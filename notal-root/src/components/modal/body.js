import { motion } from "framer-motion";

import { ChildrenAnim } from ".";

const Body = ({ children, className, animate = false }) => {
    return (<motion.div
        variants={{
            show: {
                transition: {
                    staggerChildren: 0.06,
                }
            },
            hidden: {
                transition: {
                    staggerChildren: 0.06,
                }
            }
        }}
        className={`${className ? className + " " : ""}w-full h-auto flex items-start flex-col`}
        variants={animate && ChildrenAnim}
    >
        {children}
    </motion.div>)
}

export default Body;