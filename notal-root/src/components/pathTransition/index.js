import { motion } from "framer-motion";

const PathTransition = ({ className, children }) => {
    return (<motion.div
        transition={{
            type: "spring",
            damping: 50,
            stiffness: 400
        }}
        initial={{ y: -80, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0.7 }}
        className={className}
    >
        {children}
    </motion.div>)
}

export default PathTransition;