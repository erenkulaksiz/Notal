import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { DashboardFilledIcon } from "@icons";
import { HomeWorkspaceCard, AddWorkspaceButton } from "@components";
import { HomeNavTitle } from "./components/NavTitle";
import { useWorkspaces } from "@hooks";
import type { WorkspaceTypes } from "@types";

export function Home() {
  const _workspaces = useWorkspaces();

  const starredWorkspaces =
    useMemo(() => {
      return _workspaces?.data?.data?.filter(
        (workspace: WorkspaceTypes) => !!workspace.starred
      );
    }, [_workspaces?.data?.data]) ?? [];

  const privateWorkspaces =
    useMemo(() => {
      return _workspaces?.data?.data?.filter(
        (workspace: WorkspaceTypes) => !workspace.workspaceVisible
      );
    }, [_workspaces?.data?.data]) ?? [];

  return (
    <>
      <HomeNavTitle
        title="Workspaces"
        count={{
          workspaces: _workspaces.isValidating
            ? 0
            : _workspaces?.data?.data?.length,
          privateWorkspaces: privateWorkspaces.length,
          starredWorkspaces: starredWorkspaces.length,
        }}
      >
        <DashboardFilledIcon size={24} fill="currentColor" />
      </HomeNavTitle>
      <motion.div
        initial="hidden"
        animate="show"
        className="w-full relative pb-4 px-4 mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max"
      >
        {!_workspaces.isValidating && <AddWorkspaceButton />}
        {!_workspaces.isValidating &&
          Array.isArray(_workspaces?.data?.data) &&
          _workspaces?.data?.data.map(
            (workspace: WorkspaceTypes, index: number) => (
              <HomeWorkspaceCard
                workspace={workspace}
                onStar={() => _workspaces.workspace.star(workspace._id)}
                onDelete={() => _workspaces.workspace.delete(workspace._id)}
                key={workspace._id}
                index={index}
              />
            )
          )}
        {_workspaces.isValidating &&
          [1, 2, 3].map((item) => <HomeWorkspaceCard skeleton key={item} />)}
      </motion.div>
    </>
  );
}
