import { ReactNode } from "react";

import { BuildComponent } from "@utils/style";

export default function TabView({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
}) {
  const BuildTabView = BuildComponent({
    name: "Notal UI Tab View",
    defaultClasses: "w-full",
    extraClasses: className,
  });

  return <div className={BuildTabView.classes}>{children}</div>;
}
