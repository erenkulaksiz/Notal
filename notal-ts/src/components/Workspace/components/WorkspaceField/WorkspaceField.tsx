import { motion } from "framer-motion";

import { WorkspaceFieldHeader } from "@components";
import type { WorkspaceTypes } from "@types";

export function WorkspaceField({ field }: { field: WorkspaceTypes["fields"] }) {
  return (
    <motion.div
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
      className="rounded-md w-32 flex items-start border-neutral-500/40 flex-col dark:bg-neutral-900 bg-white overflow-visible border-2 dark:border-neutral-800"
    >
      <WorkspaceFieldHeader field={field} />
    </motion.div>
  );
}
