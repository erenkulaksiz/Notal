import { BuildComponent } from "@utils/style";
import type { TooltipProps } from "./Tooltip.d";

export function BuildAllContainer({ allContainerClassName }: TooltipProps) {
  return BuildComponent({
    name: "Tooltip All Container",
    defaultClasses: "relative flex justify-center items-center",
    extraClasses: allContainerClassName,
  });
}

export function BuildPortal({
  direction = "top",
  blockContent = true,
}: TooltipProps) {
  return BuildComponent({
    name: "Tooltip Portal",
    defaultClasses: "absolute",
    conditionalClasses: [
      {
        top: "bottom-[calc(100%+5px)]",
        right: "left-[calc(100%+5px)]",
        left: "right-[calc(100%+5px)]",
        bottom: "top-[calc(100%+5px)]",
        workspaceSidebarRight: "left-[calc(100%-40px)]",
      },
      {
        true: "pointer-events-none",
      },
    ],
    selectedClasses: [direction, blockContent],
  });
}

export function BuildArrow({ direction = "top" }: TooltipProps) {
  return BuildComponent({
    name: "Tooltip Arrow",
    defaultClasses:
      "w-2 -z-10 h-2 bg-white dark:bg-neutral-800 absolute rotate-45",
    conditionalClasses: [
      {
        top: "-bottom-1",
        right: "-left-0.5",
        left: "-right-0.5",
        bottom: "-top-1",
      },
    ],
    selectedClasses: [direction],
  });
}

export function BuildTooltipContainer({
  containerClassName,
  direction = "top",
  noPadding = false,
}: TooltipProps) {
  return BuildComponent({
    name: "Tooltip Container",
    defaultClasses:
      "shadow-xl z-50 relative bg-white dark:bg-neutral-800 dark:shadow-black/60 shadow-neutral-800/30 whitespace-nowrap flex items-center justify-center rounded-xl text-sm shadow-xl text-black dark:text-white",
    extraClasses: containerClassName,
    conditionalClasses: [
      {
        top: "top-0",
        right: "right-0",
        left: "left-0",
        bottom: "bottom-0",
      },
      {
        false: "px-3 py-1",
      },
    ],
    selectedClasses: [direction, noPadding],
  });
}
