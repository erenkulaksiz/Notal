import { AddIcon } from "@icons";

const AddRoadmapButton = ({ onClick }) => {
    return (<a href="#" onClick={onClick} className="hover:opacity-80 active:scale-[98%] transition-all sticky top-0 flex flex-col items-center justify-center p-2 h-[90px] px-4 max-w-[260px] border-2 border-solid border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 shadow rounded-lg">
        <AddIcon size={24} className="fill-blue-600 dark:fill-blue-400" />
        Add Roadmap
    </a>);
}

export default AddRoadmapButton;