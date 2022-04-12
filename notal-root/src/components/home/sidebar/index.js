import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

import { ChevronRightIcon } from "@icons";
import { HomeSidebarItem, Tooltip } from "@components";

import {
    HomeRoutes
} from '@utils/constants';
import BuildComponent from "@utils/buildComponent";
import LocalSettings from "@utils/localstorage";

const HomeSidebar = ({
    current,
    onViewingChange
}) => {
    const [navCollapse, setNavCollapse] = useState(undefined);

    const BuildSidebar = BuildComponent({
        name: "Home Sidebar Navigation",
        defaultClasses: "flex shadow-xl flex-col bg-white dark:bg-neutral-800 z-50 top-0 sticky",
    })

    const onNavCollapse = () => {
        LocalSettings.set("homeNavCollapsed", !navCollapse);
        setNavCollapse(!navCollapse);
    }

    useEffect(() => {
        const homeNavCollapsed = LocalSettings.get("homeNavCollapsed");
        if (typeof homeNavCollapsed == "undefined") {
            LocalSettings.set("homeNavCollapsed", false);
            setNavCollapse(false);
        } else {
            setNavCollapse(JSON.parse(homeNavCollapsed));
        }
    }, []);

    return (typeof navCollapse != "undefined" && <motion.nav
        variants={{
            open: { maxWidth: "10rem", minWidth: "10rem", width: "10rem" },
            close: { minWidth: "2.4rem", width: "2.4rem" }
        }}
        initial={navCollapse ? "close" : "open"}
        animate={navCollapse ? "close" : "open"}
        transition={{ type: "spring", damping: 50, stiffness: 500 }}
        className={BuildSidebar.classes}
    //onMouseEnter={() => navCollapse && onCollapse()}
    //onMouseLeave={() => navCollapse || onCollapse()}
    >
        <div className="w-full h-10 flex justify-end">
            <button
                className="absolute -right-3 top-2"
                onClick={() => onNavCollapse()}
            >
                <AnimatePresence initial={false}>
                    <motion.div
                        variants={{
                            open: { rotate: 0 },
                            close: { rotate: 180 }
                        }}
                        transition={{ type: "spring", damping: 50, stiffness: 500 }}
                        className="dark:bg-neutral-800 bg-neutral-100 drop-shadow-sm rounded-full w-7 h-7 flex items-center justify-center hover:dark:bg-neutral-900 hover:bg-neutral-200 transition-colors ease-in-out"
                    >
                        <ChevronRightIcon size={24} fill={"currentColor"} style={{ transform: "rotate(-180deg)" }} />
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>
        <AnimatePresence initial={false}>
            {HomeRoutes.map((nav, index) => <Tooltip
                key={index}
                content={navCollapse && (nav.name ?? "Not Found")}
                direction="right"
            >
                <HomeSidebarItem
                    nav={nav}
                    onClick={() => onViewingChange({ nav })}
                    current={current}
                    navCollapse={navCollapse}
                />
            </Tooltip>)}
        </AnimatePresence>
    </motion.nav>)
}

export default HomeSidebar;