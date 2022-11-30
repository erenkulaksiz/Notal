import { Draggable } from "@hello-pangea/dnd";

import { BuildComponent } from "@utils/style";
import { DeleteIcon, DragIcon } from "@icons";
import { useWorkspace } from "@hooks";
import type { CardTypes } from "@types";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

export interface WorkspaceFieldCardProps {
  card: CardTypes;
  index: number;
  fieldId: string;
}

export function WorkspaceFieldCard({
  card,
  index,
  fieldId,
}: WorkspaceFieldCardProps) {
  const workspace = useWorkspace();

  function onCardDelete() {
    workspace.card.delete({ fieldId, id: card._id });
  }

  return (
    <Draggable draggableId={card._id ?? "_default"} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          className={
            BuildComponent({
              name: "Workspace Field Card",
              defaultClasses:
                "bg-neutral-100 shadow-md dark:bg-neutral-900 relative p-3 w-full flex flex-col rounded-lg mb-2",
              conditionalClasses: [
                {
                  true: "border-dashed border-2 border-neutral-300 dark:border-neutral-700",
                  false: "border-0 border-transparent",
                },
              ],
              selectedClasses: [snapshot.isDragging],
            }).classes
          }
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {card.color && (
            <div
              className="flex absolute left-[.5px] top-[.5px] bottom-[.5px] w-[5px] rounded-bl-lg rounded-tl-lg shadow"
              style={{ backgroundColor: card.color }}
            />
          )}
          {card?.title && (
            <div className="text-xl w-full break-words">{card?.title}</div>
          )}
          {card?.desc && (
            <div className="break-words text-sm dark:text-neutral-400 text-neutral-600">
              {card?.desc}
            </div>
          )}
          {card?.image && (
            <img src={card?.image?.url} className="object-contain rounded-md" />
          )}
          {card._id && workspace.isWorkspaceOwner && (
            <>
              <button
                onClick={() => onCardDelete()}
                className="absolute flex flex-col items-center gap-1 justify-center px-2 left-0 top-0 bottom-0 bg-gradient-to-l from-transparent to-neutral-400/50 dark:to-neutral-700/50 rounded-lg opacity-0 hover:opacity-100 transition-all ease-in-out duration-250"
              >
                <DeleteIcon
                  size={24}
                  fill="currentColor"
                  className="scale-75"
                />
              </button>
              <div
                className="absolute flex items-center justify-center px-2 right-0 top-0 bottom-0 bg-gradient-to-r from-transparent to-neutral-400/50 dark:to-neutral-700/50 rounded-lg opacity-0 hover:opacity-100 transition-all ease-in-out duration-250"
                {...provided.dragHandleProps}
              >
                <DragIcon size={24} fill="currentColor" className="scale-75" />
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}
