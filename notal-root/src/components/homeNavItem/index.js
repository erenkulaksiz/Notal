import { motion } from "framer-motion";

const HomeNavItem = ({ nav, onClick, current, navCollapse }) => {
    return (<a href="#" onClick={onClick} className={`${current == nav.id ? "bg-neutral-100 dark:bg-neutral-900 " : ""} after:content-['fdgdfg'] after:shadow-lg after:bg-neutral-800 hover:after:visible after:invisible after:p-2 after:py-1 after:rounded-md after:absolute after:left-14 pl-3 transition-colors h-10 flex items-center flex-row hover:bg-neutral-200 dark:hover:bg-neutral-900`}>
        <div className="mr-2 rounded-sm">
            {current == nav.id ? nav.icon.selected : nav.icon.default}
        </div>
        <motion.div
            animate={navCollapse ? "collapse" : "open"}
            transition={{ type: "tween", stiffness: 50 }}
            variants={{
                collapse: {
                    x: -100,
                    opacity: 0
                },
                open: {
                    x: 0,
                    opacity: 1
                }
            }}
        >
            {nav.name}
        </motion.div>
        {navCollapse && <div className="absolute left-12 py-1 p-2 invisible dark:bg-neutral-800 bg-neutral-100 shadow-lg rounded-md pointer-events-none">
            {nav.name}
        </div>}
    </a>)
}

export default HomeNavItem;