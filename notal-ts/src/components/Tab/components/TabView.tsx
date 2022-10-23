import { ReactNode, Ref } from "react";

import { BuildComponent } from "@utils/style";

export default function TabView({
  children,
  className,
  _ref,
  ...props
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  _ref?: Ref<HTMLDivElement>;
}) {
  const BuildTabView = BuildComponent({
    name: "Notal UI Tab View",
    defaultClasses: "w-full",
    extraClasses: className,
  });

  return (
    <div className={BuildTabView.classes} {...props} ref={_ref}>
      {children}
    </div>
  );
}
