import { WorkspaceSidebarItem } from "./WorkspaceSidebarItem";

import { StarFilledIcon, SettingsIcon, VisibleIcon } from "@icons";

export function WorkspaceSidebar() {
  return (
    <nav className="flex flex-col justify-between items-center p-2 sticky top-0 left-0 w-14 pt-2 z-40 border-2 dark:border-neutral-800 rounded-lg dark:bg-neutral-900/50 backdrop-blur-md bg-white">
      <div>
        <WorkspaceSidebarItem
          icon={<StarFilledIcon size={24} fill="#eab308" />}
          title="Add to favorites"
        />
        <WorkspaceSidebarItem
          icon={
            <SettingsIcon size={24} className="dark:fill-white fill-black" />
          }
          title="Settings"
        />
        <WorkspaceSidebarItem
          icon={
            <VisibleIcon
              width={20}
              height={20}
              className="dark:text-white text-black"
            />
          }
          title="Workspace visible"
        />
      </div>
      <div></div>
    </nav>
  );
}
