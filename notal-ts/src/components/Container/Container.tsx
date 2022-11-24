import { BuildComponent } from "@utils/style";
import type { ContainerProps } from "./Container.d";

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={
        BuildComponent({
          name: "Container",
          defaultClasses: "container break-words px-8 xl:px-32 w-full z-10",
          extraClasses: className,
        }).classes
      }
    >
      {children}
    </div>
  );
}
