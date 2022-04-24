import { Tab, Button } from "@components";
import { ArrowUpIcon } from "@icons";

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
    loadingWorkspace
}) => {
    if (loadingWorkspace) return <WorkspaceTabRoadmapSkeleton />

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

            {[1, 2, 3].map(item => <div key={item} className="flex flex-row items-center p-2 px-4 w-full bg-white dark:bg-neutral-900 shadow rounded-xl">
                <Button
                    size="h-10 w-16"
                    className="px-2 items-center justify-center "
                    light="border-2 border-solid border-neutral-300 dark:border-neutral-800"
                    icon={<ArrowUpIcon size={12} className="fill-neutral-400 dark:fill-white" style={{ transform: "scale(.6)" }} />}
                >
                    <span className="text-neutral-400 dark:text-white ml-6">
                        0
                    </span>
                </Button>
                <div className="flex flex-col ml-4">
                    <h1 className="text-2xl font-medium">
                        Update on docs 1
                    </h1>
                    <span className="text-neutral-600">
                        LOREM IPSUM DOLOR AMET
                    </span>
                </div>
            </div>)}
        </div>
    </div>)
}

export default WorkspaceTabRoadmap;