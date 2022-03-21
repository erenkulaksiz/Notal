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
        defaultClasses: "flex shadow-xl flex-col bg-white dark:bg-neutral-800 z-50 top-0 sticky",
    })

    return (<motion.nav
        variants={{
            open: { maxWidth: "10rem", minWidth: "10rem", width: "10rem" },
            close: { minWidth: "2.6rem", width: "2.6rem" }
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
                className="absolute -right-3 top-2"
                onClick={onCollapse}
            >
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={navCollapse ? { rotate: 180 } : ""}
                    transition={{ type: "spring", damping: 50, stiffness: 500 }}
                    className="dark:bg-neutral-800 bg-neutral-100 drop-shadow-sm rounded-full w-7 h-7 flex items-center justify-center hover:dark:bg-neutral-900 hover:bg-neutral-200 transition-colors ease-in-out"
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