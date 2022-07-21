import { ReactNode } from "react";

import { BuildComponent } from "@utils/style";

interface TabHeaderProps {
  children: ReactNode;
  headerClassName?: string;
  loadingWorkspace: boolean;
}

export default function TabHeader({
  children,
  headerClassName,
  loadingWorkspace,
}: TabHeaderProps) {
  const TabHeaderSkeleton = () => {
    return (
      <div className="w-full h-10 flex flex-row dark:bg-neutral-800 bg-neutral-100 p-2 rounded-lg">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="w-[20%] rounded mr-2 dark:bg-neutral-900 bg-neutral-200 animate-pulse h-full"
          ></div>
        ))}
      </div>
    );
  };

  if (loadingWorkspace) return <TabHeaderSkeleton />;

  const BuildTabHeader = BuildComponent({
    name: "Notal UI Tab Header",
    defaultClasses:
      "h-10 flex flex-1 flex-row relative border-2 border-solid dark:border-neutral-800 border-neutral-200 rounded-lg",
    extraClasses: headerClassName,
  });

  return <nav className={BuildTabHeader.classes}>{children}</nav>;
}
