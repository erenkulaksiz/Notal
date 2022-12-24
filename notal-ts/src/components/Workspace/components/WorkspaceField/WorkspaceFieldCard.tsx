import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import dynamic from "next/dynamic";

import { BuildComponent } from "@utils/style";
import { DeleteIcon, DragIcon } from "@icons";
import { useWorkspace } from "@hooks";
import { Log } from "@utils/logger";
import type { CardTypes, OwnerTypes } from "@types";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { ViewCardModalProps } from "@components/Modals/ViewCard/ViewCard.d";

const ViewCardModal = dynamic<ViewCardModalProps>(() =>
  import("../../../Modals/ViewCard").then((mod) => mod.ViewCardModal)
);

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
  const [showViewCardModal, setShowViewCardModal] = useState(false);

  function onCardDelete() {
    workspace.card.delete({ fieldId, id: card._id });
  }

  function getCardOwnerData() {
    if (!workspace?.workspace?.data?.data?.users) return null;
    return workspace.workspace.data.data.users[card?.owner as string];
  }

  return (
    <>
      <Draggable
        draggableId={card?._id ?? "_default"}
        index={index}
        isDragDisabled={!workspace.isWorkspaceOwner || !card?._id}
      >
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            className={
              BuildComponent({
                name: "Workspace Field Card",
                defaultClasses:
                  "bg-white shadow-md dark:bg-neutral-900 relative p-3 w-full flex flex-col rounded-lg mb-2",
                conditionalClasses: [
                  {
                    true: "border-dashed border-2 border-neutral-300 dark:border-neutral-700",
                    false: "border-0 border-transparent",
                  },
                ],
                selectedClasses: [snapshot.isDragging],
              }).classes
            }
            onClick={() => setShowViewCardModal(true)}
            ref={provided.innerRef}
            title={card?.title ? card?.title : card?.desc ? card?.desc : ""}
            {...provided.draggableProps}
          >
            {card?.color && (
              <div
                className="flex absolute left-[.5px] top-[.5px] bottom-[.5px] w-[5px] rounded-bl-lg rounded-tl-lg shadow"
                style={{ backgroundColor: card?.color }}
              />
            )}
            {card?.title && (
              <div className="text-xl w-full break-words">{card?.title}</div>
            )}
            {card?.desc && (
              <div className="break-words text-sm dark:text-neutral-400 text-neutral-600 whitespace-pre-line">
                {card?.desc}
              </div>
            )}
            {card?.image && (
              <img
                src={card?.image?.url}
                className="object-contain rounded-md"
              />
            )}
            {card?._id && workspace.isWorkspaceOwner && (
              <>
                <button
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    onCardDelete();
                  }}
                  className="absolute flex flex-col items-center gap-1 justify-center px-2 left-0 top-0 bottom-0 bg-gradient-to-l from-transparent to-neutral-200/50 dark:to-neutral-700/50 rounded-lg opacity-0 hover:opacity-100 transition-all ease-in-out duration-250"
                >
                  <DeleteIcon
                    size={24}
                    fill="currentColor"
                    className="scale-75"
                  />
                </button>
                <div
                  className="absolute flex items-center justify-center px-2 right-0 top-0 bottom-0 bg-gradient-to-r from-transparent to-neutral-200/50 dark:to-neutral-700/50 rounded-lg opacity-0 hover:opacity-100 transition-all ease-in-out duration-250"
                  {...provided.dragHandleProps}
                >
                  <DragIcon
                    size={24}
                    fill="currentColor"
                    className="scale-75"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Draggable>
      <ViewCardModal
        open={showViewCardModal}
        onClose={() => setShowViewCardModal(false)}
        card={card}
        cardOwner={getCardOwnerData()}
      />
    </>
  );
}
