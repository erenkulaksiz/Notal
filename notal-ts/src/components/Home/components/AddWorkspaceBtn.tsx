import { motion } from "framer-motion";
import { AddIcon } from "@icons";

const AddWorkspaceButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div
      variants={{
        hidden: { y: -30, opacity: 0 },
        show: {
          y: 0,
          opacity: 1,
          transition: { delay: 0.03 },
        },
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="sticky bottom-4 z-20"
    >
      <button
        onClick={() => onClick()}
        className="hover:scale-[101%] hover:-translate-y-0.5 filter backdrop-blur-xl w-full h-32 rounded-xl bg-white/50 dark:bg-neutral-800 dark:bg-transparent drop-shadow-2xl border-2 dark:border-blue-500 border-blue-700 p-3 flex justify-center items-center flex-col text-lg text-blue-700 dark:text-blue-500 cursor-pointer active:scale-95 transition-all ease-in-out"
      >
        <AddIcon size={24} fill="currentColor" />
        Add Workspace
      </button>
    </motion.div>
  );
};

export default AddWorkspaceButton;
