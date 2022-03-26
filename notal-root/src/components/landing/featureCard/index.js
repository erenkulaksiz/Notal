import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { isClient } from "@utils";

const LandingFeatureCard = ({ feature, ...rest }) => {
    return (<motion.div
        variants={{
            hidden: { y: isClient ? -50 : 0, opacity: isClient ? 0 : 1 },
            show: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 100, mass: .5 } }
        }}
        className="dark:bg-white/5 bg-white/40 dark:text-white text-black p-4 py-3 flex-col rounded-xl drop-shadow-xl"
    >
        <div className="flex flex-row pb-2">
            <div className="p-2 self-start rounded-full mr-2">
                {feature.icon}
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center">
                {feature.title}
            </h2>
        </div>
        <span className="text-white mt-12 text-current">{feature.desc}</span>
    </motion.div>)
}

export default LandingFeatureCard;