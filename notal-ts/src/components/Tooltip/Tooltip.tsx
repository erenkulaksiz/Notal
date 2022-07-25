import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

import { CreatePortal as Portal } from "@components";
import {
  BuildAllContainer,
  BuildTooltipContainer,
  BuildArrow,
  BuildPortal,
} from "./BuildComponent";
import type { TooltipProps } from "./Tooltip.d";

export function Tooltip({
  children,
  content,
  allContainerClassName,
  containerClassName,
  hideArrow = false,
  direction = "top",
  animated = true,
  blockContent = true, // block pointer events
  closeAuto = true, // automatically close after time
  useFocus = false, // uses focus instead of using hover
  style,
  noPadding = false,
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setShow(true);
    }
  }, [visible]);

  const vars = {
    hidden: {
      opacity: 0,
      transitionEnd: { display: "none" },
    },
    show: {
      opacity: 1,
      display: "flex",
    },
  };

  const variations = {
    top: {
      hidden: { y: 10, ...vars.hidden },
      show: { y: 0, ...vars.show },
    },
    right: {
      hidden: { x: -10, ...vars.hidden },
      show: { x: 0, ...vars.show },
    },
    bottom: {
      hidden: { y: -10, ...vars.hidden },
      show: { y: 0, ...vars.show },
    },
    left: {
      hidden: { x: 10, ...vars.hidden },
      show: { x: 0, ...vars.show },
    },
    workspaceSidebarRight: {
      hidden: { x: 0, ...vars.hidden },
      show: { x: 0, ...vars.show },
    },
  };

  return (
    <div
      onMouseEnter={() => !useFocus && setVisible(true)}
      onMouseLeave={() => !useFocus && setVisible(false)}
      onFocus={() => useFocus && setVisible(true)}
      onBlur={() => useFocus && setVisible(false)}
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={BuildAllContainer({ allContainerClassName }).classes}
      style={style}
    >
      {children}
      {show && content && (
        <Portal
          parent={containerRef.current}
          className={BuildPortal({ direction, blockContent }).classes}
          portalName="notal-tooltip"
        >
          <motion.div
            initial="hidden"
            animate={visible ? "show" : "hidden"}
            variants={variations[direction]}
            transition={{
              type: animated ? "spring" : "none",
              stiffness: 400,
              duration: 0.02,
              damping: 25,
            }} // bottom-[calc(100%+45px)]
            className={
              BuildTooltipContainer({
                containerClassName,
                direction,
                noPadding,
              }).classes
            }
            onAnimationComplete={() => !visible && setShow(false)}
          >
            {content}
            {!hideArrow && (
              <div className={BuildArrow({ direction }).classes} />
            )}
          </motion.div>
        </Portal>
      )}
    </div>
  );
}
