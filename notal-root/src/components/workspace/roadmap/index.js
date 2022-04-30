import {
    ArrowUpIcon,
    DragIcon,
    MoreIcon
} from "@icons";
import { Button } from "@components";

const WorkspaceRoadmap = ({
    roadmap,
    onUpVote,
    isOwner,
}) => {

    return (<div className="group flex flex-row items-center p-2 px-4 w-full bg-white dark:bg-neutral-900 shadow rounded-lg">
        <Button
            size="h-10 w-16 min-w-[55px]"
            className="px-2 items-center justify-center"
            light="border-2 border-solid border-neutral-400 dark:border-neutral-500"
            icon={<ArrowUpIcon size={12} className="fill-neutral-400 dark:fill-neutral-500" style={{ transform: "scale(.6)" }} />}
            onClick={onUpVote}
        >
            <span className="text-neutral-600 dark:text-neutral-500 ml-6">
                {roadmap?.upvotes}
            </span>
        </Button>
        <div className="flex flex-col ml-4">
            <div className="text-sm group-hover:flex hidden text-neutral-600">
                2021/04/30 10:00 - @eren
            </div>
            <h1 className="text-md sm:text-xl font-medium">
                {roadmap?.title}
            </h1>
            {roadmap?.desc && <div className="sm:text-md text-sm text-neutral-400">
                {roadmap.desc}
            </div>}
        </div>
        {isOwner && <div className="flex flex-1 justify-end">
            <button
                className="py-2"
                title="Drag Field"
                aria-label="Drag Field"
            >
                <MoreIcon
                    size={24}
                    className="fill-neutral-800 dark:fill-white"
                    style={{ transform: "scale(.7)" }}
                />
            </button>
            <button
                className="py-2"
                title="Drag Field"
                aria-label="Drag Field"
            >
                <DragIcon
                    size={24}
                    className="fill-neutral-800 dark:fill-white"
                    style={{ transform: "scale(.7)" }}
                />
            </button>
        </div>}
    </div>)
}

export default WorkspaceRoadmap;
