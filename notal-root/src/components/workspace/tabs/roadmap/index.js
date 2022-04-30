import { useState } from "react";
import {
    AddRoadmapButton,
    AddRoadmapModal,
    WorkspaceRoadmap,
} from "@components";
import useNotalUI from "@hooks/notalui";
import {
    ArrowUpIcon,
} from "@icons";

const WorkspaceTabRoadmapSkeleton = () => {
    return (<div className="w-full h-full flex flex-1 flex-col">
        <div className="flex w-full">
            <div className="dark:bg-neutral-800 bg-neutral-100 h-10 w-64 rounded-lg animate-pulse" />
        </div>
        <div className="mt-2 flex flex-col flex-1 h-full bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
            <div className="w-full h-10 bg-white dark:bg-neutral-900 rounded-lg p-1.5 flex gap-2 items-center justify-center">
                {[1, 2, 3].map(item => <div className="bg-neutral-200 dark:bg-neutral-800 rounded w-full h-full flex animate-pulse" key={item}></div>)}
            </div>
            <div className="mt-2 w-full h-full" />
        </div>
    </div>)
}

const WorkspaceTabRoadmap = ({
    loadingWorkspace,
    isOwner,
}) => {
    const NotalUI = useNotalUI();
    const [addRoadmapModal, setAddRoadmapModal] = useState({ visible: false });

    if (loadingWorkspace) return <WorkspaceTabRoadmapSkeleton />

    const Roadmaps = [
        {
            title: "update 1",
            desc: "ddscccccrtipiton",
            added: 1651355162213,
            upvotes: 0,
            upvoted: false,
        },
        {
            title: "update 222",
            desc: "desccssc",
            added: 1651355162213,
            upvotes: 0,
            upvoted: false,
        }
    ]

    return (<div className="w-full h-full flex flex-1 flex-col">
        <div>
            <h1 className="text-2xl">Roadmap Title</h1>
        </div>
        <div className="p-2 mt-2 flex flex-1 flex-col gap-2 h-full bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            {/*<Tab
                id="workspaceRoadmapTab"
                views={[
                    {
                        title: "asdas",
                        id: "asdaasd"
                    }
                ]}
                headerClassName="dark:bg-transparent bg-white flex-1 max-w-[700px]"
                className="flex-1 flex flex-col"
                headerContainerClassName="pl-2 pt-2 pr-2"
            >

            </Tab>*/}

            {isOwner && <div className="w-full p-3 dark:bg-neutral-900 bg-white shadow rounded-xl">
                <AddRoadmapButton
                    onClick={() => setAddRoadmapModal({ ...addRoadmapModal, visible: true })}
                />
            </div>}

            {Roadmaps.map((roadmap, index) => <WorkspaceRoadmap
                key={index}
                roadmap={roadmap}
                isOwner={isOwner}
            />)}

        </div>
        <AddRoadmapModal
            open={addRoadmapModal.visible}
            onClose={() => setAddRoadmapModal({ ...addRoadmapModal, visible: false })}
        />
    </div>)
}

export default WorkspaceTabRoadmap;