import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { ChevronRightIcon } from "@icons";
import { HomeSidebarItem, Tooltip } from "@components";

import {
    HomeRoutes
} from '@utils/constants';
import BuildComponent from "@utils/buildComponent";

const HomeSidebar = ({ navCollapse, current, onViewingChange, onCollapse }) => {
    const BuildSidebar = BuildComponent({
        name: "Home Sidebar Navigation",
        defaultClasses: "flex shadow-xl flex-col bg-white dark:bg-neutral-800 z-30 top-0 sticky max-w-2xl",
    })

    return (<motion.nav
        variants={{
            open: { maxWidth: "14rem", width: "20%" },
            close: { width: "2.6rem", minWidth: 0 }
        }}
        initial="open"
        animate={navCollapse ? "close" : "open"}
        transition={{ type: "spring", damping: 50, stiffness: 500 }}
        className={BuildSidebar.classes}
    //onMouseEnter={() => navCollapse && onCollapse()}
    //onMouseLeave={() => navCollapse || onCollapse()}
    >
        <div className="w-full h-10 flex justify-end">
            <button
                className="px-1.5"
                onClick={onCollapse}
            >
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={navCollapse ? { rotate: 180 } : ""}
                    transition={{ type: "spring", damping: 50, stiffness: 500 }}
                    className="dark:bg-neutral-800 rounded w-7 h-7 flex items-center justify-center hover:dark:bg-neutral-900 hover:bg-neutral-200 transition-colors ease-in-out"
                >
                    <ChevronRightIcon size={24} fill={"currentColor"} style={{ transform: "rotate(-180deg)" }} />
                </motion.div>
            </button>
        </div>
        {HomeRoutes.map((nav, index) => <Tooltip
            key={index}
            content={navCollapse ? nav.name : ""}
            direction="right"
        >
            <HomeSidebarItem
                nav={nav}
                onClick={() => onViewingChange({ nav })}
                current={current}
                navCollapse={navCollapse}
            />
        </Tooltip>)}
    </motion.nav>)
}

export default HomeSidebar;