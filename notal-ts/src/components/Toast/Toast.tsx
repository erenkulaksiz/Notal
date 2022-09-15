import { useEffect, ReactNode, FC, HTMLAttributes, ElementType } from "react";
import { motion, MotionProps } from "framer-motion";

import type { ToastProps } from "./Toast.d";
import { BuildComponent } from "@utils/style/buildComponent";
import { CrossIcon, InfoIcon, Cross2Icon, CheckIcon } from "@icons";

interface ToastIconType {
  icon?: ReactNode;
  className: string;
}

interface ComponentProps extends HTMLAttributes<HTMLOrSVGElement> {
  as?: ElementType;
}

const ToastTypes: {
  default: ToastIconType;
  error: ToastIconType;
  info: ToastIconType;
  success: ToastIconType;
} = {
  default: {
    className: "dark:bg-neutral-700 bg-neutral-200 text-black dark:text-white",
  },
  error: {
    icon: <CrossIcon size={24} fill="currentColor" />,
    className: "dark:bg-red-600 bg-red-500 text-white",
  },
  info: {
    icon: <InfoIcon size={24} fill="currentColor" />,
    className: "dark:bg-blue-600 bg-blue-500 text-white",
  },
  success: {
    icon: <CheckIcon size={24} fill="currentColor" />,
    className: "dark:bg-green-600 bg-green-500 text-white",
  },
};

/**
 * NotalUI Toast Component
 */
export function Toast({
  toast,
  onClick,
  onRender,
}: {
  toast: ToastProps;
  onClick?: () => void;
  onRender: () => void;
}) {
  useEffect(() => {
    if (!toast.rendered) {
      typeof onRender == "function" && onRender();
    }
  }, [toast.rendered]);

  const NotalUIToast: FC<ComponentProps | MotionProps | any> = ({
    as: Tag = toast.buttons && Array.isArray(toast.buttons)
      ? motion.div
      : motion.a,
    ...otherProps
  }) => <Tag {...otherProps} />;

  const BuildToast = BuildComponent({
    name: "NotalUI Toast Container",
    defaultClasses:
      "flex flex-row pointer-events-auto items-center m-2 p-2 rounded-lg shadow-xl",
    conditionalClasses: [
      { true: "cursor-pointer" },
      {
        default: toast.className || ToastTypes.default.className,
        error: ToastTypes.error.className,
        info: ToastTypes.info.className,
        success: ToastTypes.success.className,
      },
    ],
    selectedClasses: [toast.closeable, toast.type || "default"],
  });

  return (
    <NotalUIToast
      className={BuildToast.classes}
      onClick={() => typeof onClick == "function" && onClick()}
      variants={{
        show: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 120 },
      }}
      initial={toast.rendered ? "show" : "hidden"}
      animate="show"
      exit="hidden"
      layoutId={toast.id?.toString()}
    >
      {toast.icon && <div className="mr-2 h-full flex">{toast.icon}</div>}
      {!toast.icon &&
        toast.type &&
        ToastTypes[toast.type as keyof typeof ToastTypes].icon && (
          <div className="mr-2 h-full flex">
            {toast.type && (
              <div className="flex items-center justify-center">
                {ToastTypes[toast.type as keyof typeof ToastTypes].icon}
              </div>
            )}
          </div>
        )}
      <div className="flex flex-col">
        {toast.title && <span className="text-lg">{toast.title}</span>}
        {toast.desc && (
          <span className="text-sm break-words">{toast.desc}</span>
        )}
      </div>
      {toast.buttons && (
        <div className="ml-2 flex flex-row h-full">
          {Array.isArray(toast.buttons) &&
            toast.buttons.map((button: ReactNode, index: number) => {
              return (
                <div key={index} className="w-[98%]">
                  {button}
                </div>
              );
            })}
        </div>
      )}
      {toast.closeable && toast.showClose && (
        <button
          onClick={() => typeof onClick == "function" && onClick()}
          className="ml-2 bg-neutral-300/10 dark:bg-neutral-900/10 hover:opacity-80 rounded p-[2px] flex items-center justify-center"
        >
          <Cross2Icon width={14} height={14} fill="currentColor" />
        </button>
      )}
    </NotalUIToast>
  );
}
