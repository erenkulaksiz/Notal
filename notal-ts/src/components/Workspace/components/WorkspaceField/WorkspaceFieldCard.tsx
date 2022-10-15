import { DeleteIcon, DragIcon, SettingsIcon } from "@icons";
import { useWorkspace } from "@hooks";
import type { CardTypes } from "@types";

export function WorkspaceFieldCard({
  card,
  fieldId,
}: {
  card: CardTypes;
  fieldId: string;
}) {
  const workspace = useWorkspace();

  function onCardDelete() {
    workspace.card.delete({ fieldId, id: card._id });
  }

  return (
    <div className="bg-neutral-200 shadow-md dark:bg-neutral-900 relative p-3 w-full flex flex-col rounded-lg">
      {card.color && (
        <div
          className="flex absolute left-[.5px] top-[.5px] bottom-[.5px] w-[5px] rounded-bl-lg rounded-tl-lg shadow"
          style={{ backgroundColor: card.color }}
        />
      )}
      {card?.title && <div className="text-xl">{card?.title}</div>}
      {card?.desc && (
        <div className="text-sm dark:text-neutral-500 text-neutral-600">
          {card?.desc}
        </div>
      )}
      {card?.image && (
        <img src={card?.image?.url} className="object-contain rounded-md" />
      )}
      {card._id && (
        <>
          <div className="absolute flex flex-col items-center gap-1 justify-center px-2 left-0 top-0 bottom-0 bg-gradient-to-l from-transparent to-neutral-400/50 dark:to-neutral-700/50 rounded-lg opacity-0 hover:opacity-100 transition-all ease-in-out duration-250">
            <button onClick={() => onCardDelete()}>
              <DeleteIcon size={24} fill="currentColor" className="scale-75" />
            </button>
          </div>
          <button className="absolute flex items-center justify-center px-2 right-0 top-0 bottom-0 bg-gradient-to-r from-transparent to-neutral-400/50 dark:to-neutral-700/50 rounded-lg opacity-0 hover:opacity-100 transition-all ease-in-out duration-250">
            <DragIcon size={24} fill="currentColor" className="scale-75" />
          </button>
        </>
      )}
    </div>
  );
}
