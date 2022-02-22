import { motion } from "framer-motion";

import { BackIcon } from "@icons";
import { HomeSidebarItem } from "@components";

import {
    HomeRoutes
} from '@utils/constants';

const HomeSidebar = ({ navCollapse, current, onViewingChange, onCollapse }) => {
    return (<motion.nav
        initial={{ width: "14rem" }}
        animate={navCollapse ? { width: "2.6rem" } : ""}
        transition={{ type: "spring", damping: 50, stiffness: 500 }}
        className="flex flex-col bg-white dark:bg-neutral-800/90"
    >
        <div className="w-full h-10 flex justify-end">
            <button
                className="px-1.5"
                onClick={onCollapse}
            >
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={navCollapse ? { rotate: 180 } : ""}
                    transition={{ type: "tween", stiffness: 50 }}
                    className="dark:bg-neutral-800 rounded w-7 h-7 flex items-center justify-center hover:dark:bg-neutral-900 hover:bg-neutral-200 transition-colors ease-in-out"
                >
                    <BackIcon size={24} fill={"currentColor"} />
                </motion.div>
            </button>
        </div>
        {HomeRoutes.map((nav, index) => <HomeSidebarItem nav={nav} key={index} onClick={() => onViewingChange({ nav })} current={current} navCollapse={navCollapse} />)}
    </motion.nav>)
}

export default HomeSidebar;