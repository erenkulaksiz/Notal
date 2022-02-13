import { motion } from "framer-motion";

const HomeSidebarItem = ({ nav, onClick, current, navCollapse }) => {
    return (<a href="#" onClick={onClick} data-route={nav.name} className={`${current == nav.id ? "bg-neutral-100 dark:bg-neutral-900 " : ""} after:z-50 after:content-[attr(data-route)] after:shadow-lg after:dark:bg-neutral-800 after:bg-neutral-200 ${navCollapse ? "hover:after:visible" : "hover:after:invisible"} after:invisible after:p-2 after:py-1 after:rounded-md after:absolute after:left-12 after:pointer-events-none pl-[10px] transition-colors h-10 flex items-center flex-row hover:bg-neutral-200 dark:hover:bg-neutral-900`}>
        <div className="mr-2 rounded-sm">
            {current == nav.id ? nav.icon.selected : nav.icon.default}
        </div>
        <motion.span
            initial={{ opacity: 1 }}
            animate={navCollapse ? { opacity: 0 } : ""}
            transition={{ type: "tween", stiffness: 50 }}
            className={`${current == nav.id ? "font-medium" : "font-normal"}`}
        >
            {nav.name}
        </motion.span>
    </a>)
}

export default HomeSidebarItem;