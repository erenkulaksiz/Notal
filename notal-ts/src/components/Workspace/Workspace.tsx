import { useState } from "react";
import dynamic from "next/dynamic";
import { Droppable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { useTheme } from "next-themes";

import {
  WorkspaceNotFound,
  WorkspaceSidebar,
  LoadingOverlay,
  Tab,
} from "@components";
import { useAuth, useWorkspace } from "@hooks";
import { DashboardOutlineIcon, RoadIcon, BookmarkOutlineIcon } from "@icons";
import type { WorkspaceFieldProps } from "./components/WorkspaceField/WorkspaceField";

const WorkspaceField = dynamic<WorkspaceFieldProps>(() =>
  import("./components/WorkspaceField/WorkspaceField").then(
    (mod) => mod.WorkspaceField
  )
);

export function Workspace() {
  const workspace = useWorkspace();
  const auth = useAuth();
  const { resolvedTheme } = useTheme();
  const [workspaceTab, setWorkspaceTab] = useState(0);

  if (workspace.workspaceLoading || auth?.authLoading)
    return <LoadingOverlay />;
  if (workspace.workspaceNotFound) return <WorkspaceNotFound />;

  return (
    <div className="relative flex flex-1 overflow-auto w-full flex-row bg-white dark:bg-black">
      <Tab
        selected={workspaceTab}
        onSelect={(index) => setWorkspaceTab(index)}
        id="workspaceTab"
        headerClassName="dark:bg-transparent bg-white max-w-[700px]"
        className="flex flex-col w-full"
        headerContainerClassName="px-3"
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
          className="h-full flex overflow-auto pb-2 px-2 flex-row"
        >
          {workspace.isWorkspaceOwner && (
            <div className="sticky left-0 flex flex-col h-full items-center gap-1 z-40">
              <WorkspaceSidebar />
            </div>
          )}
          <Droppable droppableId="BOARD" type="BOARD" direction="horizontal">
            {(
              provided: DroppableProvided,
              snapshot: DroppableStateSnapshot
            ) => (
              <div
                className="flex flex-row w-full h-full pl-1"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {Array.isArray(workspace.workspace?.data?.data?.fields) &&
                  workspace.workspace?.data?.data?.fields.length == 0 && (
                    <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                      {resolvedTheme == "light" ? (
                        <img
                          src="/empty_state_workspace_light.png"
                          className="object-contain w-[200px]"
                        />
                      ) : (
                        <img
                          src="/empty_state_workspace_dark.png"
                          className="object-contain w-[200px]"
                        />
                      )}
                      <span>This workspace is empty :(</span>
                    </div>
                  )}
                {Array.isArray(workspace.workspace?.data?.data?.fields) &&
                  workspace.workspace?.data?.data?.fields.map(
                    (field, index: number) => (
                      <WorkspaceField
                        field={field}
                        key={field._id}
                        index={index}
                      />
                    )
                  )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
