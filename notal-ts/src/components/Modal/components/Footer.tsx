import { BuildComponent } from "@utils/style/buildComponent";
import { motion } from "framer-motion";

import type { ModalFooterProps } from "../Modal.d";

import { ChildrenAnim } from "../Modal";

export default function Footer({
  children,
  className,
  animate = false,
}: ModalFooterProps) {
  const BuildFooter = BuildComponent({
    name: "Modal Footer",
    defaultClasses: "w-full flex",
    extraClasses: className,
  });

  return (
    <motion.div
      className={BuildFooter.classes}
      variants={animate ? ChildrenAnim : undefined}
    >
      {children}
    </motion.div>
  );
}
