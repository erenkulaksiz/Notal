import { BuildComponent } from "@utils/style/buildComponent";
import { motion } from "framer-motion";

import type { ModalBodyProps } from "./Modal.d";

import { ChildrenAnim } from "./Modal";

export default function Body({
  children,
  className,
  animate = false,
}: ModalBodyProps) {
  const BuildModalBody = BuildComponent({
    name: "Modal Body",
    defaultClasses: "w-full h-auto flex items-start flex-col",
    extraClasses: className,
  });

  return (
    <motion.div
      className={BuildModalBody.classes}
      variants={animate ? ChildrenAnim : undefined}
    >
      {children}
    </motion.div>
  );
}
