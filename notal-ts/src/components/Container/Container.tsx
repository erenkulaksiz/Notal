import type { ContainerProps } from "./Container.d";

export function Container({ children }: ContainerProps) {
  return (
    <div className="container break-words px-8 xl:px-32 z-10 w-full">
      {children}
    </div>
  );
}
