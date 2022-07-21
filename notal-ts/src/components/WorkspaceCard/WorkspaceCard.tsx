import { motion } from "framer-motion";
import Link from "next/link";

import { Button, Tooltip } from "@components";
import type { WorkspaceTypes } from "@types";

import {
  StarOutlineIcon,
  DeleteIcon,
  VisibleOffIcon,
  StarFilledIcon,
} from "@icons";

export function HomeWorkspaceCard({
  workspace,
  onStar,
  onDelete,
  skeleton = false,
  preview = false,
  index = 0,
}: {
  workspace?: WorkspaceTypes;
  onStar?: Function;
  onDelete?: Function;
  skeleton?: boolean;
  preview?: boolean;
  index?: number;
}) {
  if (skeleton)
    return (
      <motion.div
        variants={{
          hidden: { y: -30, opacity: 0 },
          show: { y: 0, opacity: 1 },
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          duration: 0.02,
          damping: 25,
        }}
        className="w-full h-32 flex flex-col justify-end shadow-2xl rounded-xl bg-white dark:bg-neutral-800 overflow-hidden"
      >
        <div className="animate-pulse w-full h-18 px-4 pb-4">
          <div className="w-[65%] h-6 bg-neutral-300 dark:bg-neutral-700" />
          <div className="w-[80%] mt-2 h-4 bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </motion.div>
    );

  return (
    <div className="relative hover:z-40 active:scale-[98%] hover:scale-[101%] hover:-translate-y-0.5 group transition-all ease-in-out">
      <motion.div
        variants={{
          hidden: { y: -30, opacity: 0 },
          show: {
            y: 0,
            opacity: 1,
            transition: { delay: 0.035 * (index + 1) },
          },
        }}
        //exit={{ y: -30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative xl:max-w-[500px] w-full h-32 shadow-xl rounded-xl p-3 flex flex-col justify-end"
      >
        <div className="flex flex-row justify-between group-hover:scale-[97%] transition-all ease-in-out z-20 pointer-events-none">
          <div className="flex items-start justify-end flex-col text-white max-w-[calc(100%-60px)]">
            <div className="flex flex-row item-center pointer-events-auto">
              {!workspace?.workspaceVisible && (
                <Tooltip content="Private workspace">
                  <VisibleOffIcon width={24} height={24} fill="white" />
                </Tooltip>
              )}
              {workspace?.starred && preview && (
                <Tooltip content="Favorite workspace">
                  {workspace?.starred ? (
                    <StarFilledIcon size={24} fill="currentColor" />
                  ) : (
                    <StarOutlineIcon size={24} fill="currentColor" />
                  )}
                </Tooltip>
              )}
            </div>
            {!preview ? (
              <Link
                href="/workspace/[id]"
                as={`/workspace/${workspace?.id ?? "not-found"}`}
                passHref
              >
                <a className="flex-col flex w-full">
                  <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap drop-shadow break-words">
                    {workspace?.title}
                  </span>
                  {workspace?.desc && (
                    <span className="text-sm drop-shadow-lg break-words">
                      {workspace?.desc}
                    </span>
                  )}
                </a>
              </Link>
            ) : (
              <div className="flex-col flex w-full">
                {workspace?.title && (
                  <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap drop-shadow-xl break-words">
                    {workspace.title}
                  </span>
                )}
                {workspace?.desc && (
                  <span className="text-sm drop-shadow-lg break-words">
                    {workspace.desc}
                  </span>
                )}
              </div>
            )}
          </div>
          {!preview && (
            <div className="flex flex-col justify-end pointer-events-auto drop-shadow">
              <Tooltip
                content={
                  workspace?.starred
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Button className="mb-2 p-3 pt-1 pb-1" light onClick={onStar}>
                  {workspace?.starred ? (
                    <StarFilledIcon size={24} fill="currentColor" />
                  ) : (
                    <StarOutlineIcon size={24} fill="currentColor" />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content="Delete this workspace">
                <Button className="p-3 pt-1 pb-1" light onClick={onDelete}>
                  <DeleteIcon size={24} fill="currentColor" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
        {/*(workspace?.thumbnail && workspace?.thumbnail?.type == "image") && (!preview ? <Link href="/workspace/[id]" as={`/workspace/${workspace.id || "not-found"}`} passHref>
                    <a className="cursor-pointer bg-gradient-to-t from-black/30 dark:from-black/90 dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
            </Link> : <div className="bg-gradient-to-t from-black/50 dark:from-black dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />)*/}
        {workspace?.thumbnail && workspace?.thumbnail?.type == "image" && (
          <div className="absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0">
            {!preview && (
              <Link
                href="/workspace/[id]"
                as={`/workspace/${workspace.id || "not-found"}`}
                passHref
              >
                <a className="cursor-pointer bg-gradient-to-t from-black/30 dark:from-black/90 dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 z-10" />
              </Link>
            )}
            {preview && (
              <div className="cursor-pointer bg-gradient-to-t from-black/30 dark:from-black/90 dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 z-10" />
            )}
            <img
              // @ts-ignore
              // src will be always a string here, no need to check its type
              src={workspace?.thumbnail?.file}
              className="w-full min-w-[200px] h-full object-cover"
              alt="Workspace Image"
              onError={(e) => {
                e.currentTarget.src = "/no-image.png";
              }}
            />
          </div>
        )}
        {workspace?.thumbnail && workspace?.thumbnail?.type == "singleColor" && (
          <div
            className="absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0"
            style={{ backgroundColor: workspace?.thumbnail?.color }}
          >
            {!preview && (
              <Link
                href="/workspace/[id]"
                as={`/workspace/${workspace.id || "not-found"}`}
                passHref
              >
                <a className="cursor-pointer transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
              </Link>
            )}
          </div>
        )}
        {workspace?.thumbnail && workspace?.thumbnail?.type == "gradient" && (
          <div
            className={`absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0 bg-gradient-to-t`}
            style={{
              backgroundImage: `linear-gradient(to top, ${workspace?.thumbnail?.colors?.end}, ${workspace?.thumbnail?.colors?.start})`,
            }}
          >
            {!preview && (
              <Link
                href="/workspace/[id]"
                as={`/workspace/${workspace?.id ?? "not-found"}`}
                passHref
              >
                <a className="cursor-pointer transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
              </Link>
            )}
          </div>
        )}
        {!workspace?.thumbnail && (
          <div className="absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0 bg-neutral-600">
            {!preview && (
              <Link
                href="/workspace/[id]"
                as={`/workspace/${workspace?.id ?? "not-found"}`}
                passHref
              >
                <a className="cursor-pointer transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
