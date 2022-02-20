import { motion } from "framer-motion";

const HomeSidebarItem = ({ nav, onClick, current, navCollapse }) => {
    const selected = current == nav.id;
    return (<a href="#" onClick={onClick} data-route={nav.name} className={`group relative hover:after:z-50 hover:after:content-[attr(data-route)] hover:after:shadow-lg after:dark:bg-neutral-800 hover:after:bg-neutral-200 ${navCollapse ? "hover:after:flex" : "hover:after:hidden"} hover:after:p-2 hover:after:py-1 hover:after:rounded-md hover:after:absolute hover:after:left-12 hover:after:pointer-events-none pl-[10px] transition-colors h-10 flex items-center flex-row `}>
        <div className="z-20 flex">
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
        </div>
        <div className="z-10 absolute left-1.5 top-1 right-1 bottom-1 rounded " />
        {selected && <motion.div transition={{ type: "spring", duration: 0.5 }} layoutId="sidenavback" className="z-10 absolute left-1.5 top-1 right-1 bottom-1 rounded dark:bg-neutral-700 bg-neutral-200" />}
    </a>)
}

export default HomeSidebarItem;