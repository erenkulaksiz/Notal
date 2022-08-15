import { useState } from "react";
import { motion } from "framer-motion";

import {
  WorkspaceNotFound,
  WorkspaceSidebar,
  LoadingOverlay,
  Tab,
} from "@components";
import { useAuth, useWorkspace } from "@hooks";
import { DashboardOutlineIcon, RoadIcon, BookmarkOutlineIcon } from "@icons";
import { NotalRootProps } from "@types";
import { Log } from "@utils";

export function Workspace({
  workspaceLoading,
  id,
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
    <div className="relative flex flex-row flex-1 bg-white dark:bg-neutral-900 overflow-y-auto w-full pt-2">
      <div className="relative flex flex-1 flex-row overflow-y-auto overflow-x-visible">
        <Tab
          selected={workspaceTab}
          onSelect={(index) => setWorkspaceTab(index)}
          id="workspaceTab"
          headerClassName="dark:bg-transparent bg-white flex-1 max-w-[700px]"
          className="flex-1 flex flex-col"
          headerContainerClassName="pl-2 pr-2"
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
            className="relative flex flex-1 gap-2 pl-2 pr-2 pt-1 pb-2 flex-row overflow-y-auto overflow-x-visible"
          >
            {workspace.isWorkspaceOwner && <WorkspaceSidebar />}
            {workspace.workspace?.data?.data?.fields &&
              workspace.workspace.data.data.fields.map((field, index) => {
                return (
                  <motion.div
                    key={field._id}
                    animate="normal"
                    variants={{
                      collapse: {
                        width: "140px",
                        minWidth: "140px",
                        maxWidth: "140px",
                      },
                      normal: {
                        minWidth: "280px",
                        width: "280px",
                        maxWidth: "280px",
                      },
                    }}
                    className="p-2 rounded-md w-32 flex flex-row dark:bg-neutral-900 bg-white overflow-visible border-2 dark:border-neutral-800"
                  >
                    {field.title}
                  </motion.div>
                );
              })}
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
          ></Tab.TabView>
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
          ></Tab.TabView>
        </Tab>
      </div>
    </div>
  );
}
