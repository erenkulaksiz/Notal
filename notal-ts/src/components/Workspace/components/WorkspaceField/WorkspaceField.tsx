import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";

import { BuildComponent } from "@utils/style";
import { WorkspaceFieldHeader } from "@components";
import { AddCardButton } from "./AddCardButton";
import { useWorkspace } from "@hooks";
import { LIMITS } from "@constants/limits";
import type { WorkspaceTypes, CardTypes } from "@types";
import type { WorkspaceFieldCardProps } from "./WorkspaceFieldCard";

const WorkspaceFieldCard = dynamic<WorkspaceFieldCardProps>(() =>
  import("./WorkspaceFieldCard").then((mod) => mod.WorkspaceFieldCard)
);

export interface WorkspaceFieldProps {
  field: WorkspaceTypes["fields"];
  index: number;
}

export function WorkspaceField({ field, index }: WorkspaceFieldProps) {
  const workspace = useWorkspace();

  return (
    <Draggable
      draggableId={field._id}
      index={index}
      isDragDisabled={!workspace.isWorkspaceOwner && !workspace.isWorkspaceUser}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <motion.div
          {...provided.draggableProps}
          ref={provided.innerRef}
          animate="normal"
          title={field?.title}
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
              name: "Workspace Field",
              defaultClasses:
                "rounded-md group h-full overflow-hidden max-h-full flex items-start flex-col dark:bg-black/70 bg-white/70 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/40 transition-all ease-in-out",
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
                  className={
                    BuildComponent({
                      name: "Workspace Field Card Container",
                      defaultClasses:
                        "flex flex-col px-2 pt-2 h-full w-full overflow-y-auto overflow-x-hidden",
                      conditionalClasses: [
                        {
                          true: "border-dashed border-2 border-neutral-300 dark:border-neutral-700",
                          false: "border-0 border-transparent",
                        },
                      ],
                      selectedClasses: [dropSnapshot.isDraggingOver],
                    }).classes
                  }
                  {...dropProvided.droppableProps}
                  ref={dropProvided.innerRef}
                >
                  {Array.isArray(field?.cards) &&
                    field?.cards.map((card: CardTypes, index: number) =>
                      card ? (
                        <WorkspaceFieldCard
                          card={card}
                          fieldId={field?._id}
                          key={card?._id}
                          index={index}
                        />
                      ) : null
                    )}
                  {dropProvided.placeholder}
                  {(workspace.isWorkspaceOwner || workspace.isWorkspaceUser) &&
                    field.cards.length < LIMITS.MAX.WORKSPACE_CARD_LENGTH && (
                      <AddCardButton fieldId={field._id} />
                    )}
                </div>
              </>
            )}
          </Droppable>
        </motion.div>
      )}
    </Draggable>
  );
}
