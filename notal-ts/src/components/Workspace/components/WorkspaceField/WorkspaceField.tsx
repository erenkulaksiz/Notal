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
      className="rounded-md group h-full overflow-y-auto overflow-x-hidden max-h-full flex items-start pb-2 border-neutral-300 flex-col dark:bg-black bg-white hover:bg-neutral-200 dark:hover:bg-neutral-900/40 transition-all ease-in-out"
    >
      <WorkspaceFieldHeader field={field} />
      <div className="flex flex-1 flex-col px-2 pt-2 gap-2 w-full">
        {Array.isArray(field?.cards) &&
          field?.cards.map((card: CardTypes) => (
            <WorkspaceFieldCard
              card={card}
              fieldId={field._id}
              key={card._id}
            />
          ))}
      </div>
    </motion.div>
  );
}
