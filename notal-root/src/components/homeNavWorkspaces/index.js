import Link from 'next/link';

import {
    Button
} from '@components';

import {
    DashboardFilledIcon,
    StarOutlineIcon,
    DeleteIcon,
    AddIcon
} from '@icons';

const HomeNavWorkspaces = ({ workspaces, onAddWorkspace }) => {

    return (<div className="flex flex-1 px-8 py-4 flex-col">
        <div className="w-full flex flex-row items-center">
            <div className="p-2 dark:bg-neutral-800 bg-neutral-100 mr-3 rounded-lg">
                <DashboardFilledIcon size={24} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold">Your Workspaces</h1>
        </div>
        <div className="mt-4 dark:bg-neutral-800 bg-neutral-100 rounded-lg p-4 h-full grid gap-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-6 items-start">
            {workspaces ? workspaces.map((workspace, index) => {
                return (<div key={index} className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-500 to-[#6d02ab] p-3 flex flex-col justify-end">
                    <div className="flex flex-row justify-between">
                        <div className="flex justify-end text-2xl flex-col text-white">
                            <Link href="/workspace/[pid]" as={`/workspace/${workspace._id}`}>
                                <a className="flex-col flex">
                                    <span className="font-bold">
                                        {workspace.title}
                                    </span>
                                    <span className="text-lg">
                                        {workspace.desc}
                                    </span>
                                </a>
                            </Link>
                        </div>
                        <div>
                            <Button className="mb-2 p-3 pt-1 pb-1" light>
                                <StarOutlineIcon size={24} fill="currentColor" />
                            </Button>
                            <Button className="p-3 pt-1 pb-1" light>
                                <DeleteIcon size={24} fill="currentColor" />
                            </Button>
                        </div>
                    </div>
                </div>)
            }) : <div>
                no workspaces
            </div>}
            <a onClick={onAddWorkspace} href="#" className="w-full h-32 rounded-lg bg-transprent border-2 dark:border-blue-500 border-blue-700 p-3 flex justify-center items-center flex-col text-lg text-blue-700 dark:text-blue-500 cursor-pointer active:scale-95 transition-all ease-in-out">
                <AddIcon size={24} fill="currentColor" />
                Add Workspace
            </a>
        </div>
    </div>)
}

export default HomeNavWorkspaces;