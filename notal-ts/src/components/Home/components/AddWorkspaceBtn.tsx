import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { LIMITS } from "@constants/limits";
import { AddIcon } from "@icons";
import useWorkspaces from "@hooks/useWorkspaces";
import useNotalUI from "@hooks/useNotalUI";
import type { WorkspaceTypes } from "@types";
import type { AddWorkspaceModalProps } from "@components/Modals/AddWorkspace/AddWorkspace.d";

const AddWorkspaceModal = dynamic<AddWorkspaceModalProps>(() =>
  import("../../Modals/AddWorkspace").then((mod) => mod.AddWorkspaceModal)
);

export function AddWorkspaceButton({
  onWorkspaceAdd,
}: {
  onWorkspaceAdd?: () => void;
}) {
  const [addWorkspaceModal, setAddWorkspaceModal] = useState(false);
  const NotalUI = useNotalUI();
  const workspaces = useWorkspaces();

  function onAdd(workspace: WorkspaceTypes) {
    if (workspaces.data?.data?.length >= LIMITS.MAX.WORKSPACES) {
      NotalUI.Toast.show({
        title: "Error",
        desc: `You can only have ${LIMITS.MAX.WORKSPACES} workspaces maximum at the moment.`,
        type: "error",
        once: true,
        id: "workspace-limit-toast",
      });
      return;
    }
    workspaces.workspace.add(workspace);
    typeof onWorkspaceAdd == "function" && onWorkspaceAdd();
  }

  return (
    <>
      <motion.div
        variants={{
          hidden: { y: -30, opacity: 0 },
          show: {
            y: 0,
            opacity: 1,
            transition: { delay: 0.03 },
          },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="sticky bottom-4 z-20"
      >
        <button
          onClick={() => setAddWorkspaceModal(true)}
          className="hover:scale-[101%] hover:-translate-y-0.5 filter backdrop-blur-xl w-full h-32 rounded-xl bg-white/50 dark:bg-neutral-800 dark:bg-transparent drop-shadow-2xl border-2 dark:border-blue-500 border-blue-700 p-3 flex justify-center items-center flex-col text-lg text-blue-700 dark:text-blue-500 cursor-pointer active:scale-95 transition-all ease-in-out"
        >
          <AddIcon size={24} fill="currentColor" />
          Add Workspace
        </button>
      </motion.div>
      <AddWorkspaceModal
        open={addWorkspaceModal}
        onClose={() => setAddWorkspaceModal(false)}
        onAdd={(workspace: WorkspaceTypes) => onAdd(workspace)}
      />
    </>
  );
}
