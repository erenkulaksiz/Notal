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

const HomeWorkspaceCard = ({ workspace, onStar, onDelete, index, skeleton = false }) => {

    if (skeleton) return <HomeWorkspaceCardSkeleton />

    return (
        <div className="relative hover:z-40 hover:scale-[101%] hover:-translate-y-0.5 group transition-all ease-in-out">
            <motion.div
                variants={{
                    hidden: { y: -30, opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { delay: .02 * index } },
                }}
                //exit={{ y: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }}
                className="relative xl:max-w-[500px] w-full h-32 shadow-xl rounded-xl p-3 flex flex-col justify-end"
            >
                <div className="flex flex-row justify-between group-hover:scale-[97%] transition-all ease-in-out z-20">
                    <div className="flex items-start justify-end text-xl flex-col text-white max-w-[calc(100%-60px)]">
                        {!workspace?.workspaceVisible && <Tooltip content="Private workspace">
                            <VisibleOffIcon width={24} height={24} fill="white" />
                        </Tooltip>}
                        <Link href="/workspace/[id]" as={`/workspace/${workspace._id || "not-found"}`} passHref>
                            <a className="flex-col flex">
                                <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap drop-shadow-xl">
                                    {workspace.title}
                                </span>
                                <span className="text-sm drop-shadow-lg">
                                    {workspace.desc}
                                </span>
                            </a>
                        </Link>
                    </div>
                    <div>
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
                    </div>
                </div>
                <Link href="/workspace/[id]" as={`/workspace/${workspace._id || "not-found"}`} passHref>
                    <a className="cursor-pointer bg-gradient-to-t from-black/90 dark:from-black dark:to-trasparent to-black/30 group-hover:opacity-0 opacity-100 transition-all ease-in-out absolute left-0 right-0 top-0 bottom-0 rounded-xl z-10" />
                </Link>
                <div className="absolute left-0 right-0 top-0 bottom-0 rounded-xl overflow-hidden z-0">
                    <img
                        src="https://cdn.theculturetrip.com/wp-content/uploads/2018/01/screen-shot-2018-01-17-at-13-03-17-650x364.png"
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>
        </div>
    )
}

export default HomeWorkspaceCard;