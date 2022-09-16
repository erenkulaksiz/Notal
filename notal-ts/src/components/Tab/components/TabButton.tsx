import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TabButtonProps {
  children: ReactNode;
  selected: boolean;
  hover: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  setSelected: (arg: number) => void;
  setHover: (arg: number) => void;
  className: string;
  title: string;
}

export default function TabButton({
  children,
  selected,
  hover,
  onMouseEnter,
  onMouseLeave,
  onClick,
  setSelected,
  setHover,
  className,
  title,
}: TabButtonProps) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={({ key }) =>
        key === "Enter"
          ? () => {
              setSelected(-1);
              setHover(-1);
            }
          : null
      }
      title={title}
      className={className}
      onClick={onClick}
    >
      <span className="z-20 relative">{children}</span>
      {hover && (
        <motion.div
          className="absolute left-1 right-1 top-1 bottom-1 z-10 dark:bg-neutral-700 bg-neutral-300/80 rounded-md"
          layoutId="tabheader"
          transition={{
            layout: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
        ></motion.div>
      )}
      {selected && (
        <motion.div
          className="absolute left-3 right-3 h-1 bottom-0 rounded-xl z-10 bg-blue-600"
          layoutId="tabunderline"
          transition={{
            layout: {
              type: "spring",
              damping: 25,
              stiffness: 400,
              mass: 0.55,
            },
          }}
        ></motion.div>
      )}
    </button>
  );
}
