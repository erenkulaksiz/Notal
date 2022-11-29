import { useState } from "react";
import dynamic from "next/dynamic";

import { WorkspaceNotFound, LoadingOverlay, Tab } from "@components";
import { useAuth, useWorkspace } from "@hooks";
import { DashboardOutlineIcon, BookmarkOutlineIcon, RoadIcon } from "@icons";

const TabsBoard = dynamic<{}>(() =>
  import("./components/Tabs/Board").then((mod) => mod.default)
);
const TabsRoadmap = dynamic<{}>(() =>
  import("./components/Tabs/Roadmap").then((mod) => mod.default)
);
const TabsBookmarks = dynamic<{}>(() =>
  import("./components/Tabs/Bookmarks").then((mod) => mod.default)
);

export function Workspace() {
  const workspace = useWorkspace();
  const auth = useAuth();
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
        headerClassName="dark:bg-transparent bg-white max-w-[360px]"
        className="flex flex-col overflow-x-auto overflow-y-hidden"
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
          className="items-start flex overflow-auto pb-2 px-2 flex-row"
        >
          <TabsBoard />
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
          <TabsRoadmap />
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
          <TabsBookmarks />
        </Tab.TabView>
      </Tab>
    </div>
  );
}
