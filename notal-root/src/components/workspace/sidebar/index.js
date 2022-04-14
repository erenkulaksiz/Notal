import Link from "next/link";
import { WorkspaceSidebarItem, Tooltip } from "@components";
import { WorkspaceButtons } from "@utils/constants";

const WorkspaceSkeletonSidebar = () => {
    const SkeletonButton = () => {
        return (<div className="flex items-center justify-center w-10 h-10 animate-pulse dark:bg-neutral-800 bg-neutral-200 rounded-lg mt-2">
        </div>)
    }

    return (<div className="flex flex-col items-center w-14 h-full dark:bg-neutral-800/50 bg-white/50">
        {WorkspaceButtons.map((el, index) => <SkeletonButton key={index} />)}
    </div>)
}

const WorkspaceSidebar = ({
    onStarred,
    onSettings,
    onVisible,
    onDelete,
    onAddField,
    workspaceStarred,
    workspaceVisible,
    workspaceUsers,
    loadingWorkspace,
    error,
    isOwner
}) => {

    if (loadingWorkspace) return <WorkspaceSkeletonSidebar />
    if (error || !isOwner) return null;

    const action = {
        favorite: () => onStarred(),
        settings: () => onSettings(),
        visible: () => onVisible(),
        delete: () => onDelete(),
        addfield: () => onAddField(),
    }

    return (<nav className="flex flex-col justify-between items-center py-2 h-full sticky top-0 w-14 dark:bg-neutral-800/50 bg-white/50 pt-2 z-40">
        <div>
            {WorkspaceButtons.map((item, index) => (<WorkspaceSidebarItem
                item={item}
                key={index}
                onClick={action[item.id]}
                state={{
                    visible: workspaceVisible || false,
                    favorite: workspaceStarred || false,
                }}
            />))}
        </div>
        <div className="h-full flex flex-col justify-end relative">
            {workspaceUsers && workspaceUsers.map((user, index) => <Tooltip
                content={
                    <div className="items-center flex-row flex">
                        <div className="p-[2px] w-8 h-8 rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
                            <img
                                src={user?.avatar}
                                className="w-7 h-7 rounded-full border-[2px] dark:border-black border-white"
                                alt="Avatar"
                            />
                        </div>
                        <div className="flex flex-col ml-1">
                            <span className="h-4">{user.fullname ? `${user.fullname}` : `@${user.username}`}</span>
                            {user.fullname && <span className="text-xs dark:text-neutral-500 text-neutral-400">@{user.username}</span>}
                        </div>
                    </div>
                }
                hideArrow
                key={index}
                direction="workspaceSidebarRight"
                containerClassName="px-2"
                allContainerClassName="absolute flex h-8 hover:z-40"
                style={{ bottom: index * 12 }}
            >
                <Link href="/profile/[username]" as={`/profile/${user?.username || "not-found"}`} passHref>
                    <a className="w-8 h-8 flex items-center justify-center border-2 border-solid rounded-full border-white dark:border-neutral-800">
                        <img
                            src={user?.avatar}
                            className="w-7 h-7 cursor-pointer rounded-full"
                            alt="Avatar"
                        />
                    </a>
                </Link>
            </Tooltip>)}
        </div>
    </nav>)
}

export default WorkspaceSidebar;