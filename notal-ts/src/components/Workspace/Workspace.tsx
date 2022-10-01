import { useState } from "react";

import {
  WorkspaceNotFound,
  WorkspaceSidebar,
  WorkspaceField,
  LoadingOverlay,
  Tab,
  AddFieldModal,
} from "@components";
import { useAuth, useWorkspace } from "@hooks";
import {
  DashboardOutlineIcon,
  RoadIcon,
  BookmarkOutlineIcon,
  AddIcon,
} from "@icons";
import { WorkspaceSidebarItem } from "./components";

export function Workspace() {
  const workspace = useWorkspace();
  const auth = useAuth();
  const [workspaceTab, setWorkspaceTab] = useState(0);
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);

  if (workspace.workspaceLoading || auth?.authLoading)
    return <LoadingOverlay />;
  if (workspace.workspaceNotFound) return <WorkspaceNotFound />;

  return (
    <div className="relative flex flex-1 overflow-auto w-full flex-row bg-white dark:bg-black pt-2">
      <Tab
        selected={workspaceTab}
        onSelect={(index) => setWorkspaceTab(index)}
        id="workspaceTab"
        headerClassName="dark:bg-transparent bg-white max-w-[700px]"
        className="flex flex-col w-full"
        headerContainerClassName="px-2"
        headerVisible={false}
      >
        <Tab.TabView
          title="Board"
          icon={
            <DashboardOutlineIcon
              size={24}
              className="fill-neutral-800 dark:fill-neutral-200"
              style={{ transform: "scale(.7)" }}
            />
          }
          className="relative w-full flex overflow-auto pb-2 gap-2 px-2 flex-row"
        >
          {workspace.isWorkspaceOwner && (
            <div className="sticky left-0 flex flex-col h-full items-center gap-1 z-40">
              <div className="p-1 rounded-lg backdrop-blur-md dark:bg-black/20 bg-white/20">
                <WorkspaceSidebarItem
                  icon={
                    <AddIcon size={24} className="dark:fill-white fill-black" />
                  }
                  title="Add Field"
                  onClick={async () => setAddFieldModalOpen(true)}
                />
              </div>
              <div className="dark:bg-neutral-900 bg-neutral-200 h-[2px] rounded-full w-1/2" />
              <WorkspaceSidebar />
            </div>
          )}
          {Array.isArray(workspace.workspace?.data?.data?.fields) &&
            workspace.workspace?.data?.data?.fields.map((field) => (
              <WorkspaceField field={field} key={field._id} />
            ))}
        </Tab.TabView>

        <Tab.TabView
          title="Roadmap"
          icon={
            <RoadIcon
              width={24}
              height={24}
              fill="currentColor"
              className="fill-neutral-800 dark:fill-neutral-200"
              style={{ transform: "scale(.6)" }}
            />
          }
          className="relative flex flex-1 overflow-auto pb-2 gap-2 px-2 flex-row"
        >
          {workspace.isWorkspaceOwner && <WorkspaceSidebar />}
        </Tab.TabView>

        <Tab.TabView
          title="Bookmarks"
          icon={
            <BookmarkOutlineIcon
              size={24}
              fill="currentColor"
              className="fill-neutral-800 dark:fill-neutral-200"
              style={{ transform: "scale(.7)" }}
            />
          }
          className="relative flex flex-1 overflow-auto pb-2 gap-2 px-2 flex-row"
        >
          {workspace.isWorkspaceOwner && <WorkspaceSidebar />}
        </Tab.TabView>
      </Tab>
      <AddFieldModal
        open={addFieldModalOpen}
        onClose={() => setAddFieldModalOpen(false)}
        onAdd={(field) => workspace.field.add({ title: field.title })}
        workspaceTitle={workspace.workspace?.data?.data?.title}
      />
    </div>
  );
}
