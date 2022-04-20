import BuildComponent from "@utils/buildComponent"
import { motion } from "framer-motion"

// Wrapper for modal content.
const Content = ({ children, blur, className }) => {
    const BuildModalContent = BuildComponent({
        name: "Modal Content",
        defaultClasses: "z-50 relative box-border flex flex-col overflow-y-visible overflow-x-visible sm:overflow-visible shadow-2xl p-2 rounded-xl",
        conditionalClasses: [{
            true: "backdrop-brightness-75 dark:bg-black/50 bg-white",
            false: "dark:bg-neutral-900 bg-white"
        }],
        extraClasses: className,
        selectedClasses: [blur]
    });

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
        className={BuildModalContent.classes}
        tabIndex="-1"
    >
        {children}
    </motion.div>)
}

export default Content