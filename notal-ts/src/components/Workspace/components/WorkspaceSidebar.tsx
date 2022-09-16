import { WorkspaceSidebarItem } from "./WorkspaceSidebarItem";

import {
  StarFilledIcon,
  SettingsIcon,
  VisibleIcon,
  VisibleOffIcon,
  StarOutlineIcon,
} from "@icons";
import useWorkspace from "@hooks/useWorkspace";

export function WorkspaceSidebar() {
  const workspace = useWorkspace();

  return (
    <nav className="flex flex-col justify-between items-center p-2 mb-2 ml-2 w-14 pt-2 z-40 border-2 dark:border-neutral-800 rounded-lg dark:bg-neutral-900/50 backdrop-blur-md bg-white border-neutral-500/40">
      <div className="flex flex-col gap-2">
        <WorkspaceSidebarItem
          icon={
            workspace.workspace?.data?.data?.starred ? (
              <StarFilledIcon size={24} fill="#eab308" />
            ) : (
              <StarOutlineIcon
                size={24}
                className="dark:fill-white fill-black"
              />
            )
          }
          title={
            workspace.workspace?.data?.data?.starred
              ? "Remove from favorites"
              : "Add to favorites"
          }
          //onClick={() => }
        />
        <WorkspaceSidebarItem
          icon={
            <SettingsIcon size={24} className="dark:fill-white fill-black" />
          }
          title="Settings"
        />
        <WorkspaceSidebarItem
          icon={
            workspace.workspace?.data?.data?.workspaceVisible ? (
              <VisibleIcon
                width={24}
                height={24}
                className="dark:fill-white fill-black"
              />
            ) : (
              <VisibleOffIcon
                width={24}
                height={24}
                className="dark:fill-white fill-black"
              />
            )
          }
          title={
            workspace.workspace?.data?.data?.workspaceVisible
              ? "Make private"
              : "Make public"
          }
        />
      </div>
      <div></div>
    </nav>
  );
}
