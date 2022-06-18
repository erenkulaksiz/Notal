import BuildComponent from "@utils/buildComponent"
import { motion } from "framer-motion"

const Backdrop = ({ children, blur, onClose, open, setShow, onKeyDown, className }) => {

    const BuildModalBackdrop = BuildComponent({
        name: "Modal Backdrop",
        defaultClasses: "fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center z-50",
        extraClasses: className,
        conditionalClasses: [{ true: "bg-black/50 backdrop-blur-sm", default: "bg-black/60" }],
        selectedClasses: [blur],
    })

    return (<motion.div
        variants={{
            show: {
                display: "flex",
                opacity: 1,
            },
            hidden: {
                opacity: 0,
                transitionEnd: { display: "none" },
            }
        }}
        transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }}
        initial="hidden"
        animate={open ? "show" : "hidden"}
        onAnimationComplete={() => !open && setShow(false)}
        onKeyDown={onKeyDown}
        className={BuildModalBackdrop.classes}
        onClick={onClose}
    >
        {children}
    </motion.div>)
}

export default Backdrop