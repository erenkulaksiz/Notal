import { useState } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';

import {
    Button,
    Tooltip,
    HomeWorkspaceCardSkeleton
} from '@components';

import {
    StarOutlineIcon,
    DeleteIcon,
    VisibleOffIcon,
    StarFilledIcon,
} from '@icons';

const HomeWorkspaceCard = ({ workspace, onStar, onDelete, index, skeleton = false, preview = false }) => {

    if (skeleton) return <HomeWorkspaceCardSkeleton />

    return (
        <div className="relative hover:z-40 hover:scale-[101%] hover:-translate-y-0.5 group transition-all ease-in-out">
            <motion.div
                variants={{
                    hidden: { y: -30, opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { delay: .015 * (index + 1) } },
                }}
                //exit={{ y: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative xl:max-w-[500px] w-full h-32 shadow-xl rounded-xl p-3 flex flex-col justify-end"
            >
                <div className="flex flex-row justify-between group-hover:scale-[97%] transition-all ease-in-out z-20 pointer-events-none">
                    <div className="flex items-start justify-end flex-col text-white max-w-[calc(100%-60px)]">
                        <div className="flex flex-row item-center pointer-events-auto">
                            {!workspace?.workspaceVisible && <Tooltip content="Private workspace">
                                <VisibleOffIcon width={24} height={24} fill="white" />
                            </Tooltip>}
                            {(workspace?.starred && preview) && <Tooltip content="Favorite workspace">
                                {workspace?.starred ? <StarFilledIcon size={24} fill="currentColor" /> : <StarOutlineIcon size={24} fill="currentColor" />}
                            </Tooltip>}
                        </div>
                        {!preview ? <Link href="/workspace/[id]" as={`/workspace/${workspace.id || "not-found"}`} passHref>
                            <a className="flex-col flex w-full">
                                <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap drop-shadow-xl break-words">
                                    {workspace.title}
                                </span>
                                <span className="text-sm drop-shadow-lg break-words">
                                    {workspace.desc}
                                </span>
                            </a>
                        </Link> : <div className="flex-col flex w-full">
                            <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap drop-shadow-xl break-words">
                                {workspace.title}
                            </span>
                            <span className="text-sm drop-shadow-lg break-words">
                                {workspace.desc}
                            </span>
                        </div>}
                    </div>
                    {!preview && <div className="flex flex-col justify-end pointer-events-auto">
                        <Tooltip content={workspace?.starred ? "Remove from favorites" : "Add to favorites"}>
                            <Button className="mb-2 p-3 pt-1 pb-1" light onClick={onStar}>
                                {workspace?.starred ? <StarFilledIcon size={24} fill="currentColor" /> : <StarOutlineIcon size={24} fill="currentColor" />}
                            </Button>
                        </Tooltip>
                        <Tooltip content="Delete this workspace">
                            <Button className="p-3 pt-1 pb-1" light onClick={onDelete}>
                                <DeleteIcon size={24} fill="currentColor" />
                            </Button>
                        </Tooltip>
                    </div>}
                </div>
                {/*(workspace?.thumbnail && workspace?.thumbnail?.type == "image") && (!preview ? <Link href="/workspace/[id]" as={`/workspace/${workspace.id || "not-found"}`} passHref>
                    <a className="cursor-pointer bg-gradient-to-t from-black/30 dark:from-black/90 dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
            </Link> : <div className="bg-gradient-to-t from-black/50 dark:from-black dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />)*/}
                {(workspace?.thumbnail && workspace?.thumbnail?.type == "image") && <div className="absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0">
                    {!preview && <Link href="/workspace/[id]" as={`/workspace/${workspace.id || "not-found"}`} passHref>
                        <a className="cursor-pointer bg-gradient-to-t from-black/30 dark:from-black/90 dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
                    </Link>}
                    {preview && <div className="cursor-pointer bg-gradient-to-t from-black/30 dark:from-black/90 dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />}
                    <img
                        src={workspace?.thumbnail.file}
                        className="w-full h-full object-cover"
                        alt="Workspace Image"
                    />
                </div>}
                {(workspace?.thumbnail && workspace?.thumbnail?.type == "singleColor") && <div className="absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0" style={{ backgroundColor: workspace?.thumbnail?.color }}>
                    {!preview && <Link href="/workspace/[id]" as={`/workspace/${workspace.id || "not-found"}`} passHref>
                        <a className="cursor-pointer transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
                    </Link>}
                </div>}
                {(workspace?.thumbnail && workspace?.thumbnail?.type == "gradient") && <div className={`absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0 bg-gradient-to-t`} style={{ backgroundImage: `linear-gradient(to top, ${workspace?.thumbnail?.colors?.end}, ${workspace?.thumbnail?.colors?.start})`, }}>
                    {!preview && <Link href="/workspace/[id]" as={`/workspace/${workspace.id || "not-found"}`} passHref>
                        <a className="cursor-pointer transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
                    </Link>}
                </div>}
                {!workspace?.thumbnail && <div className="absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0 bg-neutral-600">
                    {!preview && <Link href="/workspace/[id]" as={`/workspace/${workspace.id || "not-found"}`} passHref>
                        <a className="cursor-pointer transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
                    </Link>}
                </div>}
            </motion.div>
        </div>
    )
}

export default HomeWorkspaceCard;