import { motion } from "framer-motion"

// Wrapper for modal content.
const Content = ({ children, blur, className }) => {
    return (<motion.div
        variants={{
            hidden: {
                opacity: 0,
                scale: 0.8,
                transition: {
                    staggerChildren: 0.04,
                    type: "spring", stiffness: 800, damping: 70, duration: 50
                },
            },
            show: {
                opacity: 1,
                scale: 1,
                transition: {
                    staggerChildren: 0.04,
                    type: "spring", stiffness: 800, damping: 70, duration: 50
                },
            }
        }}
        onClick={e => e.stopPropagation()}
        className={`${className ? className + " " : ""}z-50 relative box-border flex flex-col min-h-min shadow-2xl p-2 ${blur ? "backdrop-brightness-75 dark:bg-black/50 bg-white " : "dark:bg-neutral-900 bg-white "}rounded-xl overflow-hidden`}
    >
        {children}
    </motion.div>)
}

export default Content