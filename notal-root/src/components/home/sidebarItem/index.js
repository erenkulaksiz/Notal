import { motion } from "framer-motion";

const HomeSidebarItem = ({ nav, onClick, current, navCollapse }) => {
    const selected = current == nav.id;
    return (<a
        href="#"
        onClick={onClick}
        data-route={nav.name}
        className="group relative w-full transition-colors h-[38px] flex items-center flex-row pl-[7px]"
    >
        <div className="z-20 flex">
            <div className="rounded-sm">
                {current == nav.id ? nav.icon.selected : nav.icon.default}
            </div>
            <motion.span
                variants={{
                    open: { opacity: 1, display: "flex" },
                    close: { opacity: 0, transitionEnd: { display: "none" } }
                }}
                transition={{ type: "tween", stiffness: 50 }}
                className={`font-normal text-xs sm:text-[1em] flex items-center ml-2`}
            >
                {nav.name}
            </motion.span>
        </div>
        {!selected &&
            <div
                className="z-10 absolute left-1 top-1 right-1 bottom-1 rounded dark:group-hover:bg-neutral-700/50 group-hover:bg-neutral-200/50"
            />
        }
        {selected &&
            <motion.div
                transition={{ type: "spring", duration: 0.5 }}
                layoutId="sidenavback"
                className="z-10 absolute left-1 top-1 right-1 bottom-1 rounded dark:bg-neutral-700 bg-neutral-200"
            />
        }
    </a>)
}

export default HomeSidebarItem;