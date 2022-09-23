import { motion } from "framer-motion";

import { WorkspaceFieldHeader, WorkspaceFieldCard } from "@components";
import type { WorkspaceTypes, CardTypes } from "@types";

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
      className="rounded-md flex items-start border-neutral-300 flex-col dark:bg-neutral-900 bg-white overflow-visible border-2 dark:border-neutral-800"
    >
      <WorkspaceFieldHeader field={field} />
      <div className="flex flex-1 flex-col px-2 gap-2 w-full">
        {Array.isArray(field?.cards) &&
          field?.cards.map((card: CardTypes) => (
            <WorkspaceFieldCard card={card} key={card._id} />
          ))}
      </div>
    </motion.div>
  );
}
