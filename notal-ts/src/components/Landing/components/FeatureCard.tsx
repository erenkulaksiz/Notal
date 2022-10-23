import { ReactNode } from "react";
import { motion } from "framer-motion";

import { isClient } from "@utils";

export interface LandingFeatureCardProps {
  title: string;
  desc: string;
  icon: ReactNode;
}

export interface LandingFeatureCardTypes {
  feature: {
    title: string;
    desc: string;
    icon: ReactNode;
  };
}

export function LandingFeatureCard({ feature }: LandingFeatureCardTypes) {
  return (
    <motion.div
      variants={{
        hidden: { y: isClient() ? -50 : 0, opacity: isClient() ? 0 : 1 },
        show: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 100,
            mass: 0.5,
          },
        },
      }}
      className="dark:bg-white/5 bg-white/40 relative dark:text-white text-black p-4 flex-col rounded-xl drop-shadow-xl group"
    >
      <div className="rounded-xl absolute -z-20 -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 blur opacity-0 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-40 transition duration-700"></div>
      <div className="flex flex-row">
        <div className="p-1 self-start rounded-full mr-2 dark:bg-neutral-700/20 bg-neutral-300/20">
          {feature.icon}
        </div>
        <h2 className="text-lg font-medium text-black dark:text-white flex items-center">
          {feature.title}
        </h2>
      </div>
      <div className="text-white text-sm text-current mt-2">{feature.desc}</div>
    </motion.div>
  );
}
