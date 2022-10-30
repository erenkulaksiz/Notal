import { motion } from "framer-motion";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";

import { BuildComponent } from "@utils/style";
import { WorkspaceFieldHeader, WorkspaceFieldCard } from "@components";
import type { WorkspaceTypes, CardTypes } from "@types";

export function WorkspaceField({
  field,
  index,
}: {
  field: WorkspaceTypes["fields"];
  index: number;
}) {
  return (
    <Draggable draggableId={field._id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
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
          className={
            BuildComponent({
              name: "WorkspaceField",
              defaultClasses:
                "rounded-md group h-full overflow-y-auto overflow-x-hidden max-h-full flex items-start pb-2 flex-col dark:bg-black bg-white hover:bg-neutral-200 dark:hover:bg-neutral-900/40 transition-all ease-in-out",
              conditionalClasses: [
                {
                  true: "border-dashed border-2 border-neutral-300 dark:border-neutral-700",
                  false: "border-0 border-transparent",
                },
              ],
              selectedClasses: [snapshot.isDragging],
            }).classes
          }
        >
          <WorkspaceFieldHeader field={field} {...provided.dragHandleProps} />
          <Droppable droppableId={field._id} type="FIELD" direction="vertical">
            {(
              dropProvided: DroppableProvided,
              dropSnapshot: DroppableStateSnapshot
            ) => (
              <>
                <div
                  className="flex flex-1 flex-col px-2 pt-2 w-full"
                  {...dropProvided.droppableProps}
                  ref={dropProvided.innerRef}
                >
                  {Array.isArray(field?.cards) &&
                    field?.cards.map((card: CardTypes, index: number) => (
                      <WorkspaceFieldCard
                        card={card}
                        fieldId={field._id}
                        key={card._id}
                        index={index}
                      />
                    ))}
                </div>
                {dropProvided.placeholder}
              </>
            )}
          </Droppable>
        </motion.div>
      )}
    </Draggable>
  );
}
