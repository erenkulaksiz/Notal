import { motion } from "framer-motion";
import Link from 'next/link';

import {
    Button,
    Tooltip
} from '@components';

import {
    StarOutlineIcon,
    DeleteIcon,
} from '@icons';

const HomeWorkspaceCard = ({ workspace, index }) => {
    return (<motion.div
        variants={{
            hidden: { y: -50, opacity: 0 },
            show: { y: 0, opacity: 1 }
        }}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }}
        className="w-full h-32 shadow-lg rounded-xl bg-gradient-to-br from-blue-500 to-[#6d02ab] p-3 flex flex-col justify-end"
    >
        <div className="flex flex-row justify-between">
            <div className="flex justify-end text-xl flex-col text-white max-w-[calc(100%-60px)]">
                <Link href="/workspace/[pid]" as={`/workspace/${workspace._id}`}>
                    <a className="flex-col flex">
                        <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                            {workspace.title}
                        </span>
                        <span className="text-sm">
                            {workspace.desc}
                        </span>
                    </a>
                </Link>
            </div>
            <div>
                <Tooltip content={workspace?.starred ? "Remove from favorites" : "Add to favorites"}>
                    <Button className="mb-2 p-3 pt-1 pb-1" light>
                        <StarOutlineIcon size={24} fill="currentColor" />
                    </Button>
                </Tooltip>
                <Button className="p-3 pt-1 pb-1" light>
                    <DeleteIcon size={24} fill="currentColor" />
                </Button>
            </div>
        </div>
    </motion.div>)
}

export default HomeWorkspaceCard;