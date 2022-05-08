import {
    ArrowUpIcon,
    DragIcon,
    SettingsIcon,
    DeleteIcon,
} from "@icons";
import {
    Button,
    Tooltip
} from "@components";
import BuildComponent from "@utils/buildComponent";
import { formatDate } from "@utils";

const WorkspaceRoadmap = ({
    roadmap,
    onUpVote,
    onDelete,
    onSettings,
    isOwner,
}) => {

    const BuildRoadmapButton = BuildComponent({
        name: "Workspace Roadmap Button",
        defaultClasses: "border-2 border-solid",
        conditionalClasses: [{
            false: "border-neutral-400 dark:border-neutral-500",
            true: "border-blue-600 dark:border-blue-500"
        }],
        selectedClasses: [roadmap?.upvoted ?? false]
    });

    const BuildRoadmapUpvoteIcon = BuildComponent({
        name: "Workspace Roadmap Button Icon",
        conditionalClasses: [{
            false: "fill-neutral-400 dark:fill-neutral-500 ",
            true: "fill-blue-600 dark:fill-blue-500"
        }],
        selectedClasses: [roadmap?.upvoted ?? false],
    });

    const BuildRoadmapUpvoteText = BuildComponent({
        name: "Workspace Roadmap Button Text",
        defaultClasses: "ml-6",
        conditionalClasses: [{
            false: "text-neutral-400 dark:text-neutral-500",
            true: "text-blue-600 dark:text-blue-500"
        }],
        selectedClasses: [roadmap?.upvoted ?? false],
    })

    return (<div className="group flex flex-row p-2 px-4 w-full bg-white dark:bg-neutral-900 shadow rounded-lg">
        <Button
            size="h-10 w-16 min-w-[55px] mt-1"
            className="px-2 items-center justify-center"
            light={BuildRoadmapButton.classes}
            icon={<ArrowUpIcon size={12} className={BuildRoadmapUpvoteIcon.classes} style={{ transform: "scale(.6)" }} />}
            onClick={onUpVote}
        >
            <span className={BuildRoadmapUpvoteText.classes}>
                {roadmap?.upvotes}
            </span>
        </Button>
        <div className="flex flex-1 flex-col ml-4">
            <div className="text-sm text-neutral-600">
                {formatDate(roadmap.createdAt)} - @{roadmap.owner.username}
            </div>
            <h1 className="text-md sm:text-xl font-medium">
                {roadmap?.title}
            </h1>
            {roadmap?.desc && <div className="sm:text-md text-sm text-neutral-400">
                {roadmap.desc}
            </div>}
        </div>
        {isOwner && <Tooltip
            containerClassName="px-1 p-1"
            blockContent={false}
            direction="left"
            content={<div className="flex flex-row">
                <Button size="md" className="px-2" onClick={onSettings} light title="Roadmap Settings" aria-label="Roadmap Settings">
                    <SettingsIcon size={24} className="fill-neutral-800 dark:fill-white" />
                </Button>
                <Button size="md" className="px-2 ml-1" onClick={onDelete} light title="Delete Roadmap" aria-label="Delete Roadmap">
                    <DeleteIcon size={24} className="fill-neutral-800 dark:fill-white" />
                </Button>
            </div>}
        >
            <button
                //className="pl-2"
                title="Drag Roadmap"
                aria-label="Drag Roadmap"
            >
                <DragIcon
                    size={24}
                    className="fill-neutral-800 dark:fill-white"
                    style={{ transform: "scale(.7)" }}
                />
            </button>
        </Tooltip>
        }
    </div>)
}

export default WorkspaceRoadmap;
