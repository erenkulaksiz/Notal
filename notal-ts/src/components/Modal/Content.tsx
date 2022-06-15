import { BuildComponent } from "@utils/style/buildComponent";
import { motion } from "framer-motion";

import type { ModalContentProps } from "./Modal.d";

import { ChildrenAnim } from "./Modal";

// Wrapper for modal content.
export default function Content({
  children,
  blur,
  className,
  animate = false,
}: ModalContentProps) {
  const BuildModalContent = BuildComponent({
    name: "Modal Content",
    defaultClasses:
      "z-50 relative box-border flex flex-col overflow-y-visible overflow-x-visible sm:overflow-visible shadow-2xl p-2 rounded-xl",
    conditionalClasses: [
      {
        true: "backdrop-brightness-75 dark:bg-black/50 bg-white",
        false: "dark:bg-neutral-900 bg-white",
      },
    ],
    extraClasses: className,
    selectedClasses: [blur],
  });

  return (
    <motion.div
      variants={animate ? ChildrenAnim : undefined}
      onClick={(e) => e.stopPropagation()}
      className={BuildModalContent.classes}
      tabIndex={-1}
    >
      {children}
    </motion.div>
  );
}
