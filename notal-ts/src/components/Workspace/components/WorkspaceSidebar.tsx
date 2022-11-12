import { useRouter } from "next/router";

import { WorkspaceSidebarItem } from "./WorkspaceSidebarItem";
import { Button } from "@components";
import {
  StarFilledIcon,
  SettingsIcon,
  VisibleIcon,
  VisibleOffIcon,
  StarOutlineIcon,
  DeleteIcon,
  CrossIcon,
  CheckIcon,
} from "@icons";
import { useNotalUI, useWorkspace } from "@hooks";
export function WorkspaceSidebar() {
  const { workspace, starWorkspace, visibilityToggle, deleteWorkspace } =
    useWorkspace();
  const NotalUI = useNotalUI();
  const router = useRouter();

  async function onDelete() {
    await deleteWorkspace();
    NotalUI.Alert.close();
    router.push("/");
  }

  return (
    <nav className="flex flex-col justify-between items-center sticky left-0 p-1 z-40 rounded-lg backdrop-blur-md">
      <div className="flex flex-col gap-2">
        <WorkspaceSidebarItem
          icon={
            workspace?.data?.data?.starred ? (
              <StarFilledIcon size={24} fill="#eab308" />
            ) : (
              <StarOutlineIcon
                size={24}
                className="dark:fill-white fill-black"
              />
            )
          }
          title={
            workspace?.data?.data?.starred
              ? "Remove from favorites"
              : "Add to favorites"
          }
          onClick={async () => await starWorkspace()}
        />
        {/*<WorkspaceSidebarItem
          icon={
            <SettingsIcon size={24} className="dark:fill-white fill-black" />
          }
          title="Workspace Settings"
        />*/}
        <WorkspaceSidebarItem
          icon={
            workspace?.data?.data?.workspaceVisible ? (
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
            workspace?.data?.data?.workspaceVisible
              ? "Set workspace private"
              : "Set workspace public"
          }
          onClick={async () => await visibilityToggle()}
        />
        <WorkspaceSidebarItem
          icon={
            <DeleteIcon
              width={24}
              height={24}
              className="dark:fill-white fill-black"
            />
          }
          title="Delete Workspace"
          onClick={() =>
            NotalUI.Alert.show({
              title: "Delete Workspace",
              titleIcon: <DeleteIcon size={24} fill="currentColor" />,
              desc: (
                <div className="text-center w-full">
                  Are you sure want to delete this workspace?
                </div>
              ),
              showCloseButton: false,
              notCloseable: false,
              buttons: [
                <Button
                  light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
                  onClick={() => NotalUI.Alert.close()}
                  key={1}
                  fullWidth="w-[49%]"
                >
                  <CrossIcon size={24} fill="currentColor" />
                  Cancel
                </Button>,
                <Button onClick={() => onDelete()} key={2} fullWidth="w-[49%]">
                  <CheckIcon size={24} fill="currentColor" />
                  Delete
                </Button>,
              ],
            })
          }
        />
      </div>
      <div></div>
    </nav>
  );
}
