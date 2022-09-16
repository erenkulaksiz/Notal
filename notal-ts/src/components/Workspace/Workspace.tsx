import { useState } from "react";

import {
  WorkspaceNotFound,
  WorkspaceSidebar,
  WorkspaceField,
  LoadingOverlay,
  Tab,
} from "@components";
import { useAuth, useWorkspace } from "@hooks";
import { DashboardOutlineIcon, RoadIcon, BookmarkOutlineIcon } from "@icons";
import { NotalRootProps } from "@types";

export function Workspace({
  workspaceLoading,
}: {
  workspaceData?: NotalRootProps["workspace"];
  workspaceLoading: boolean;
  id?: string;
}) {
  const workspace = useWorkspace();
  const auth = useAuth();
  const [workspaceTab, setWorkspaceTab] = useState(0);

  if (workspaceLoading || auth?.authLoading) return <LoadingOverlay />;
  if (workspace.workspaceNotFound) return <WorkspaceNotFound />;

  return (
    <div className="relative flex w-full h-full flex-row bg-white dark:bg-neutral-900 pt-2">
      <Tab
        selected={workspaceTab}
        onSelect={(index) => setWorkspaceTab(index)}
        id="workspaceTab"
        headerClassName="dark:bg-transparent bg-white max-w-[700px]"
        className="flex flex-col w-full"
        headerContainerClassName="px-2"
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
          className="relative flex flex-1 overflow-auto pb-2 gap-2 px-2 flex-row"
        >
          {workspace.isWorkspaceOwner && <WorkspaceSidebar />}
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
    </div>
  );
}
