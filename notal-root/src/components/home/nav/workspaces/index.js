import { motion } from "framer-motion";

import {
    Button,
    HomeWorkspaceCard,
} from '@components';

import {
    DashboardFilledIcon,
    AddIcon
} from '@icons';

const HomeNavWorkspaces = ({ workspaces, onAddWorkspace }) => {

    return (<div className="flex flex-1 px-8 py-4 flex-col overflow-x-auto">
        <div className="w-full flex flex-row items-center">
            <div className="p-2 dark:bg-neutral-800 bg-neutral-200 mr-3 rounded-lg">
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
            className="mt-4 dark:bg-neutral-800 bg-neutral-200 rounded-lg p-4 h-full grid gap-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-6 items-start auto-rows-max"
        >
            {workspaces ? workspaces.map((workspace, index) => <HomeWorkspaceCard workspace={workspace} key={index} index={index} />) : <div>
                no workspaces
            </div>}
            <motion.div
                variants={{
                    hidden: { y: -30, opacity: 0 },
                    show: { y: 0, opacity: 1 }
                }}
                transition={{ type: "tween", stiffness: 70 }}
            >
                <a onClick={onAddWorkspace} href="#" className="w-full h-32 rounded-lg bg-transprent border-2 dark:border-blue-500 border-blue-700 p-3 flex justify-center items-center flex-col text-lg text-blue-700 dark:text-blue-500 cursor-pointer active:scale-95 transition-all ease-in-out">
                    <AddIcon size={24} fill="currentColor" />
                    Add Workspace
                </a>
            </motion.div>
        </motion.div>
    </div>)
}

export default HomeNavWorkspaces;