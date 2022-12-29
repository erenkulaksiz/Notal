import { motion } from "framer-motion";

import { BuildComponent } from "@utils/style";
import type { ModalTitleProps } from "../Modal.d";

import { ChildrenAnim } from "../Modal";

export default function Title({
  children,
  className,
  animate = false,
}: ModalTitleProps) {
  return (
    <motion.div
      className={
        BuildComponent({
          name: "Modal Title",
          defaultClasses: "w-full justify-center flex items-center",
          extraClasses: className,
        }).classes
      }
      variants={animate ? ChildrenAnim : undefined}
    >
      {children}
    </motion.div>
  );
}
