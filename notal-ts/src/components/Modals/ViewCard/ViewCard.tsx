import Link from "next/link";

import { Modal, Tooltip, Avatar, Input, Button } from "@components";
import { formatDateToHuman } from "@utils";
import { AddIcon } from "@icons";
import type { ViewCardModalProps } from "./ViewCard.d";

export function ViewCardModal({
  open,
  onClose,
  card,
  cardOwner,
}: ViewCardModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      animate
      className="w-[100%] h-full sm:h-auto sm:w-[60%] md:w-[40%] max-w-[1900px] rounded-none sm:rounded-lg px-4 pt-4 py-4"
    >
      {card?.color && (
        <div
          className="flex absolute left-0 top-0 bottom-0 w-[5px] sm:rounded-bl-lg sm:rounded-tl-lg rounded-none shadow"
          style={{ backgroundColor: card.color }}
        />
      )}
      {cardOwner && (
        <div className="flex flex-col items-start">
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-col items-start">
              <div className="uppercase text-xs dark:text-neutral-600 text-neutral-400 font-semibold">
                author
              </div>
              <Tooltip content={`@${cardOwner.username}`}>
                <Link
                  href="/profile/[username]"
                  as={`/profile/${cardOwner?.username || "not-found"}`}
                  passHref
                >
                  <a target="_blank">
                    <Avatar src={cardOwner.avatar} size="xl" />
                  </a>
                </Link>
              </Tooltip>
            </div>
            <div className="flex flex-col">
              <div className="uppercase text-xs dark:text-neutral-600 text-neutral-400 font-semibold">
                created at
              </div>
              <div>
                {formatDateToHuman({
                  date: card?.createdAt ?? 0,
                  output:
                    "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="uppercase text-xs dark:text-neutral-600 text-neutral-400 font-semibold">
                updated at
              </div>
              <div>
                {formatDateToHuman({
                  date: card?.updatedAt ?? 0,
                  output:
                    "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        {card?.title && (
          <div className="flex flex-col">
            <div className="uppercase text-xs dark:text-neutral-600 text-neutral-400 font-semibold">
              title
            </div>
            <h1 className="text-2xl break-words">{card.title}</h1>
          </div>
        )}
        {card?.desc && (
          <div className="flex flex-col">
            <div className="uppercase text-xs dark:text-neutral-600 text-neutral-400 font-semibold">
              description
            </div>
            <span className="break-words whitespace-pre-line">{card.desc}</span>
          </div>
        )}
        {/*<div className="flex flex-col gap-1">
          <div className="uppercase text-xs dark:text-neutral-600 text-neutral-400 font-semibold">
            comments
          </div>
          <div className="w-full rounded-xl p-2 border-2 border-neutral-500/40 dark:border-neutral-700">
            akdasjj
          </div>
          <Input
            placeholder=""
            onChange={(e) => {}}
            textarea
            height="h-20"
            className="py-2 px-2"
          />
          <div className="flex w-full justify-end mt-2">
            <Button>
              <AddIcon size={24} fill="currentColor" />
              <span className="uppercase">add comment</span>
            </Button>
          </div>
        </div>*/}
      </div>
    </Modal>
  );
}
