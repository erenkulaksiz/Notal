import { motion } from "framer-motion";

const HomeSidebarItem = ({ nav, onClick, current, navCollapse }) => {
    return (<a href="#" onClick={onClick} data-route={nav.name} className={`${current == nav.id ? "bg-neutral-100 dark:bg-neutral-900 " : ""}hover:after:z-50 hover:after:content-[attr(data-route)] hover:after:shadow-lg after:dark:bg-neutral-800 hover:after:bg-neutral-200 ${navCollapse ? "hover:after:flex" : "hover:after:hidden"} hover:after:p-2 hover:after:py-1 hover:after:rounded-md hover:after:absolute hover:after:left-12 hover:after:pointer-events-none pl-[10px] transition-colors h-10 flex items-center flex-row hover:bg-neutral-200 dark:hover:bg-neutral-900`}>
        <div className="mr-2 rounded-sm">
            {current == nav.id ? nav.icon.selected : nav.icon.default}
        </div>
        <motion.span
            initial={{ opacity: 1, display: "flex" }}
            animate={navCollapse ? {
                opacity: 0,
                transitionEnd: { display: "none" }
            } : ""}
            transition={{ type: "tween", stiffness: 50 }}
            className={`${current == nav.id ? "font-medium" : "font-normal"}`}
        >
            {nav.name}
        </motion.span>
    </a>)
}

export default HomeSidebarItem;