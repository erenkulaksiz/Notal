import { motion, LayoutGroup } from "framer-motion";

import type { CurrentPageViewerProps } from "./CurrentPageViewer.d";

export function CurrentPageViewer({
  pages,
  currentPage,
}: CurrentPageViewerProps) {
  return (
    <LayoutGroup id="currentPageViewerLayout">
      <div className="w-full flex flex-row items-center justify-center gap-2">
        {Array.from(Array(pages).keys()).map((page) => {
          return (
            <div
              key={`currentPageViewer-${page}`}
              className="w-2 h-2 bg-neutral-300 dark:bg-neutral-600 rounded-full"
            >
              {page == currentPage && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-neutral-500 dark:bg-neutral-200"
                  transition={{
                    type: "spring",
                    stiffness: 600,
                    duration: 0.005,
                    damping: 100,
                  }}
                  layoutId="currentPageViewerLayout"
                />
              )}
            </div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
