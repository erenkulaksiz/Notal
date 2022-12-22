import { BuildComponent } from "@utils/style/buildComponent";
import { motion } from "framer-motion";

import type { KeyboardEvent, MouseEvent } from "react";
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
      "fixed top-0 right-0 bottom-0 left-0 flex z-50 overflow-auto items-start pt-4 pb-4",
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
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
        typeof onKeyDown == "function" && onKeyDown(event)
      }
      tabIndex={-1}
      className={BuildModalBackdrop.classes}
      onClick={(e: MouseEvent<HTMLDivElement>) => onClose(e)}
    >
      {children}
    </motion.div>
  );
}
