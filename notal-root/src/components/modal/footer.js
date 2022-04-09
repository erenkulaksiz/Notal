import BuildComponent from "@utils/buildComponent";
import { motion } from "framer-motion";

import { ChildrenAnim } from ".";

const Footer = ({ children, className, animate = false }) => {

    const BuildFooter = BuildComponent({
        name: "Modal Footer",
        defaultClasses: "w-full flex items-center justify-end",
        extraClasses: className
    });

    return (<motion.div
        className={BuildFooter.classes}
        variants={animate && ChildrenAnim}
    >
        {children}
    </motion.div >)
}

export default Footer;