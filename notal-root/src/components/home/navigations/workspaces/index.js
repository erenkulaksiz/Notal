import { useState } from "react";
import { motion } from "framer-motion";

import {
    AddWorkspaceModal,
    Button,
    HomeWorkspaceCard,
    Modal,
    Tooltip
} from '@components';

import {
    DashboardFilledIcon,
    AddIcon
} from '@icons';

const HomeNavWorkspaces = ({ workspaces }) => {

    const [newWorkspaceModal, setNewWorkspaceModal] = useState(false);

    return (<div className="flex flex-1 px-8 py-4 flex-col overflow-x-auto">
        <div className="w-full flex flex-row items-center">
            <div className="p-2 dark:bg-neutral-800 bg-neutral-100 mr-3 rounded-lg">
                <DashboardFilledIcon size={24} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold">Your Workspaces</h1>
        </div>

        <motion.div
            variants={{
                show: {
                    transition: {
                        staggerChildren: 0.05,
                    }
                }
            }}
            initial="hidden"
            animate="show"
            className="mt-4 h-full grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max"
        >
            {workspaces ? workspaces.map((workspace, index) => <HomeWorkspaceCard workspace={workspace} key={index} index={index} />) : <div>
                no workspaces
            </div>}
            <motion.div
                variants={{
                    hidden: { y: -50, opacity: 0 },
                    show: { y: 0, opacity: 1 }
                }}
                transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }}
            >
                <a onClick={() => setNewWorkspaceModal(true)} href="#" className="w-full h-32 rounded-xl bg-transprent border-2 dark:border-blue-500 border-blue-700 p-3 flex justify-center items-center flex-col text-lg text-blue-700 dark:text-blue-500 cursor-pointer active:scale-95 transition-all ease-in-out">
                    <AddIcon size={24} fill="currentColor" />
                    Add Workspace
                </a>
            </motion.div>
        </motion.div>
        <AddWorkspaceModal
            open={newWorkspaceModal}
            onClose={() => setNewWorkspaceModal(false)}
        />
    </div>)
}

export default HomeNavWorkspaces;