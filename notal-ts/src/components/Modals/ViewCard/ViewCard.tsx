import { Modal, Tooltip, Avatar } from "@components";
import type { ViewCardModalProps } from "./ViewCard.d";
import { Log } from "@utils/logger";

export function ViewCardModal({
  open,
  onClose,
  card,
  cardOwner,
}: ViewCardModalProps) {
  Log.debug("Cardownerdata", cardOwner);

  return (
    <Modal
      open={open}
      onClose={onClose}
      animate
      className="w-[100%] h-full sm:h-auto sm:w-[60%] md:w-[60%] max-w-[1900px] rounded-none sm:rounded-lg px-4 pt-4 py-4"
    >
      {card.color && (
        <div
          className="flex absolute left-0 top-0 bottom-0 w-[5px] sm:rounded-bl-lg sm:rounded-tl-lg rounded-none shadow"
          style={{ backgroundColor: card.color }}
        />
      )}
      {cardOwner && (
        <div className="flex flex-col items-start mb-1">
          <div className="uppercase text-xs dark:text-neutral-600 text-neutral-300">
            author
          </div>
          <Tooltip content={`@${cardOwner.username}`}>
            <Avatar src={cardOwner.avatar} size="xl" />
          </Tooltip>
        </div>
      )}
      <div className="flex flex-row justify-between relative">
        <div className="flex flex-col gap-1">
          {card.title && (
            <div className="flex flex-col">
              <div className="uppercase text-xs dark:text-neutral-600 text-neutral-300 h-3">
                title
              </div>
              <h1 className="text-2xl break-words">{card.title}</h1>
            </div>
          )}
          {card.desc && (
            <div className="flex flex-col">
              <div className="uppercase text-xs dark:text-neutral-600 text-neutral-300 h-3">
                description
              </div>
              <span className="break-words whitespace-pre-line">
                {card.desc}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
