import { BuildComponent } from "@utils/style/buildComponent";
import { motion } from "framer-motion";

import type { ModalBackdropProps } from "../Modal.d";

export default function Backdrop({
  children,
  blur,
  onClose,
  open,
  setShow,
  onKeyDown,
  className,
}: ModalBackdropProps) {
  const BuildModalBackdrop = BuildComponent({
    name: "Modal Backdrop",
    defaultClasses:
      "fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center z-50 overflow-auto",
    extraClasses: className,
    conditionalClasses: [
      { true: "bg-black/50 backdrop-blur-sm", default: "bg-black/60" },
    ],
    selectedClasses: [blur],
  });

  return (
    <motion.div
      variants={{
        show: {
          display: "flex",
          opacity: 1,
        },
        hidden: {
          opacity: 0,
          transitionEnd: { display: "none" },
        },
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        duration: 0.02,
        damping: 25,
      }}
      initial="hidden"
      animate={open ? "show" : "hidden"}
      onAnimationComplete={() =>
        !open && typeof setShow == "function" && setShow(false)
      }
      onKeyDown={() => typeof onKeyDown == "function" && onKeyDown()}
      className={BuildModalBackdrop.classes}
      onClick={() => onClose()}
    >
      {children}
    </motion.div>
  );
}
