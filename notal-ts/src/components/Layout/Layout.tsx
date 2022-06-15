import type { LayoutProps } from "./Layout.d";
import { AcceptCookies } from "@components";

export function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto transition-all ease-in-out duration-300 overflow-auto dark:bg-black/50 bg-white h-full items-start w-full flex flex-col dark:text-white text-black">
      {children}
      <AcceptCookies />
    </div>
  );
}
