import type { ContainerProps } from "./Container.d";

export function Container({ children }: ContainerProps) {
  return (
    <div className="container break-words px-8 xl:px-32 w-full z-10">
      {children}
    </div>
  );
}
