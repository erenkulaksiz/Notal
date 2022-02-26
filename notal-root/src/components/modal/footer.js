import { motion } from "framer-motion";

import { ChildrenAnim } from ".";

const Footer = ({ children, className, animate = false }) => {
    return (<motion.div
        className={`${className ? className + " " : ""}w-full h-12 justify-center flex items-center`}
        variants={animate && ChildrenAnim}
    >
        {children}
    </motion.div >)
}

export default Footer;