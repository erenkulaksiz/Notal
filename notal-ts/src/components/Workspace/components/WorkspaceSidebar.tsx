import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

import { WorkspaceSidebarItem } from "./WorkspaceSidebarItem";
import { Button, AddFieldModal, Tooltip, Avatar } from "@components";
import {
  StarFilledIcon,
  VisibleIcon,
  VisibleOffIcon,
  StarOutlineIcon,
  DeleteIcon,
  CrossIcon,
  CheckIcon,
  AddIcon,
} from "@icons";
import { useNotalUI, useWorkspace } from "@hooks";
import { LIMITS } from "@constants/limits";
import { Log } from "@utils";
import { OwnerTypes } from "@types";

interface WorkspaceUsers extends OwnerTypes {
  owner?: boolean;
}

export function WorkspaceSidebar() {
  const { workspace, starWorkspace, visibilityToggle, deleteWorkspace, field } =
    useWorkspace();
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  const NotalUI = useNotalUI();
  const router = useRouter();

  function getWorkspaceUsers() {
    if (typeof workspace?.data?.data?.users === "object") {
      return Object.keys(workspace?.data?.data?.users).map((userId: string) => {
        if (userId == workspace?.data?.data?.owner?.uid)
          return {
            owner: true,
            ...workspace?.data?.data?.users?.[userId],
          } as WorkspaceUsers;
        return workspace?.data?.data?.users?.[userId] as WorkspaceUsers;
      });
    }
    return [];
  }

  const users = getWorkspaceUsers();

  Log.debug(users);

  async function onDelete() {
    await deleteWorkspace();
    NotalUI.Alert.close();
    router.push("/");
  }

  return (
    <nav className="flex flex-col justify-between items-center sticky left-0 pb-6 p-1 top-0 z-40 backdrop-blur-md">
      <div className="flex flex-col gap-2">
        {workspace?.data?.data?.fields.length <=
          LIMITS.MAX.WORKSPACE_FIELD_LENGTH && (
          <WorkspaceSidebarItem
            icon={<AddIcon size={24} className="dark:fill-white fill-black" />}
            title="Add Field"
            onClick={() => setAddFieldModalOpen(true)}
          />
        )}
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
      <div className="flex flex-col gap-1">
        {users.map((user: WorkspaceUsers, index: number) => (
          <Tooltip
            containerClassName="px-2"
            key={`sidebarWorkspaceUsers_${user.uid}`}
            content={
              <div className="items-center flex-row flex">
                <div className="flex flex-col">
                  {user?.owner && (
                    <div className="text-[.6em] -mb-2 text-neutral-400">
                      Workspace Owner
                    </div>
                  )}
                  <span className="h-4">
                    {user.fullname ? user.fullname : `@${user.username}`}
                  </span>
                  {user.fullname && (
                    <span className="text-xs dark:text-neutral-500 text-neutral-400">
                      {`@${user.username}`}
                    </span>
                  )}
                </div>
              </div>
            }
            direction="right"
          >
            <Link
              href="/profile/[username]"
              as={`/profile/${user?.username || "not-found"}`}
              passHref
            >
              <a target="_blank">
                <Avatar src={user?.avatar} size="xl" />
              </a>
            </Link>
          </Tooltip>
        ))}
      </div>
      <AddFieldModal
        open={addFieldModalOpen}
        onClose={() => setAddFieldModalOpen(false)}
        onAdd={(_field) => field.add({ title: _field.title })}
        workspaceTitle={workspace?.data?.data?.title}
      />
    </nav>
  );
}
