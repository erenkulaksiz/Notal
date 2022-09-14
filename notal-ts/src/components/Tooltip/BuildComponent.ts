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

export function BuildArrow({ direction = "top", outline }: TooltipProps) {

  const ArrowDirectionStyles = {
    top: "border-r-2 border-r-neutral-600/20 border-b-2 border-b-neutral-600/20",
    right: "border-l-2 border-l-neutral-600/20 border-b-2 border-b-neutral-600/20",
    left: "border-t-2 border-t-neutral-600/20 border-r-2 border-r-neutral-600/20",
    bottom: "border-t-2 border-t-neutral-600/20 border-l-2 border-l-neutral-600/20",
  }

  return BuildComponent({
    name: "Tooltip Arrow",
    defaultClasses:
      "w-2 -z-40 h-2 bg-white dark:bg-neutral-800 absolute rotate-45",
    conditionalClasses: [
      {
        top: "-bottom-1.5",
        right: "-left-1.5",
        left: "-right-1.5",
        bottom: "-top-1.5",
      },
      {
        true: ArrowDirectionStyles[direction] ?? "border-none",
        default: outline,
      }
    ],
    selectedClasses: [direction, outline],
  });
}

export function BuildTooltipContainer({
  containerClassName,
  direction = "top",
  noPadding = false,
  outline = false,
}: TooltipProps) {
  return BuildComponent({
    name: "Tooltip Container",
    defaultClasses:
      "shadow-xl shadow-neutral-600/30 z-50 relative bg-white dark:bg-neutral-800 dark:shadow-black/60 shadow-neutral-800/30 whitespace-nowrap flex items-center justify-center rounded-xl text-sm shadow-xl text-black dark:text-white",
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
      {
        true: "border-2 border-neutral-600/20",
        default: outline,
      }
    ],
    selectedClasses: [direction, noPadding, outline],
  });
}
