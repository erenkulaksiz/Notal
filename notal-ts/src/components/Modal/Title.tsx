import { motion } from "framer-motion";

import type { ModalTitleProps } from "./Modal.d";

import { ChildrenAnim } from "./Modal";

export default function Title({
  children,
  className,
  animate = false,
}: ModalTitleProps) {
  return (
    <motion.div
      className={`${
        className ? className + " " : ""
      }w-full min-h-[2.4rem] justify-center flex items-center`}
      variants={animate ? ChildrenAnim : undefined}
    >
      {children}
    </motion.div>
  );
}
