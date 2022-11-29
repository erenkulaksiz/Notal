import { ReactNode } from "react";

import { Tooltip } from "@components";
import { DashboardFilledIcon, StarFilledIcon, VisibleOffIcon } from "@icons";

function Count({
  count,
  text,
  children,
  onClick,
}: {
  count: number;
  text: string;
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Tooltip content={text} direction="bottom" blockContent outline>
      <button
        className="flex gap-1 flex-row items-center dark:bg-neutral-800 bg-white p-1 px-1 pr-2 rounded-lg"
        onClick={onClick}
      >
        {children}
        {count}
      </button>
    </Tooltip>
  );
}

export function HomeNavTitle({
  children,
  title,
  count, // count of workspace data
}: {
  children: ReactNode;
  title: string;
  count: {
    workspaces: number;
    starredWorkspaces: number;
    privateWorkspaces: number;
  };
}) {
  return (
    <div className="flex flex-row min-h-[60px] gap-2 px-4 w-full items-center top-0 z-40 dark:bg-black bg-neutral-200/40 backdrop-blur-sm">
      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 p-2 dark:bg-neutral-800 bg-white rounded-lg">
        <div className="hidden md:flex">{children}</div>
        <div className="flex md:hidden">
          <div style={{ transform: "scale(0.8)" }}>{children}</div>
        </div>
      </div>
      <h1 className="flex items-center text-lg md:text-2xl font-bold">
        {title}
      </h1>
      {count?.workspaces > 0 && (
        <Count count={count?.workspaces} text={"Total Workspaces"}>
          <DashboardFilledIcon
            width={20}
            height={24}
            fill="currentColor"
            style={{ transform: "scale(.8)" }}
          />
        </Count>
      )}
      {count?.privateWorkspaces > 0 || count?.starredWorkspaces ? (
        <div className="w-[1px] h-1/3 bg-neutral-300 dark:bg-neutral-600" />
      ) : null}
      {count?.starredWorkspaces > 0 && (
        <Count count={count?.starredWorkspaces} text={"Favorite Workspaces"}>
          <StarFilledIcon
            width={20}
            height={24}
            fill="currentColor"
            style={{ transform: "scale(.8)" }}
          />
        </Count>
      )}
      {count?.privateWorkspaces > 0 && (
        <Count count={count?.privateWorkspaces} text={"Private Workspaces"}>
          <VisibleOffIcon
            width={24}
            height={24}
            fill="currentColor"
            style={{ transform: "scale(.8)" }}
          />
        </Count>
      )}
    </div>
  );
}
