import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DashboardFilledIcon } from "@icons";
import { HomeWorkspaceCard, AddWorkspaceModal } from "@components";
import { HomeNavTitle } from "./components/NavTitle";
import { useAuth, useNotalUI, useWorkspaces } from "@hooks";
import AddWorkspaceButton from "./components/AddWorkspaceBtn";
import type { WorkspaceTypes } from "@types";

export function Home() {
  const auth = useAuth();
  const NotalUI = useNotalUI();
  const _workspaces = useWorkspaces();

  const [addWorkspaceModal, setAddWorkspaceModal] = useState(false);

  const starredWorkspaces = _workspaces.isValidating
    ? []
    : _workspaces?.data?.data?.filter((el: WorkspaceTypes) => !!el.starred);
  const privateWorkspaces = _workspaces.isValidating
    ? []
    : _workspaces?.data?.data?.filter(
        (el: WorkspaceTypes) => !el.workspaceVisible
      );

  return (
    <>
      <HomeNavTitle
        title="Workspaces"
        count={{
          workspaces: _workspaces.isValidating
            ? 0
            : _workspaces?.data?.data?.length,
          privateWorkspaces: privateWorkspaces?.length,
          starredWorkspaces: starredWorkspaces?.length,
        }}
      >
        <DashboardFilledIcon size={24} fill="currentColor" />
      </HomeNavTitle>
      <motion.div
        initial="hidden"
        animate="show"
        className="w-full relative pb-4 px-4 mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max"
      >
        <AnimatePresence>
          {!_workspaces.isValidating && (
            <AddWorkspaceButton
              onClick={() => {
                if (_workspaces.data?.data?.length >= 20) {
                  NotalUI.Toast.show({
                    title: "Error",
                    desc: "You can only have 20 workspaces maximum at the moment.",
                    type: "error",
                    once: true,
                    id: "workspace-limit-toast",
                  });
                  return;
                }
                setAddWorkspaceModal(true);
              }}
            />
          )}
          {!_workspaces.isValidating &&
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
        </AnimatePresence>
      </motion.div>
      <AddWorkspaceModal
        open={addWorkspaceModal}
        onClose={() => setAddWorkspaceModal(false)}
        onAdd={(workspace: WorkspaceTypes) =>
          _workspaces.workspace.add(workspace)
        }
      />
    </>
  );
}
