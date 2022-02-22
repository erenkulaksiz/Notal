import { motion } from "framer-motion";

import { AddIcon } from "@icons";

const AddWorkspaceButton = ({ onClick }) => {
    return (<motion.div
        variants={{
            hidden: { y: -50, opacity: 0 },
            show: { y: 0, opacity: 1 }
        }}
        transition={{ type: "spring", stiffness: 400, duration: 0.02, damping: 25 }}
        className="sticky bottom-4 z-40"
    >
        <a onClick={onClick} href="#" className="filter backdrop-blur-xl  w-full h-32 rounded-xl bg-transprent border-2 dark:border-blue-500 border-blue-700 p-3 flex justify-center items-center flex-col text-lg text-blue-700 dark:text-blue-500 cursor-pointer active:scale-95 transition-all ease-in-out">
            <AddIcon size={24} fill="currentColor" />
            Add Workspace
        </a>
    </motion.div>)
}

export default AddWorkspaceButton;