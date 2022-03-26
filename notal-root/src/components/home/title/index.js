import { Tooltip } from "@components";
import { StarFilledIcon, VisibleOffIcon } from "@icons";

const HomeNavTitle = ({
    children,
    title,
    count, // count of workspace data
}) => {
    return (<div className="flex flex-row min-h-[60px] px-4 items-center sticky top-0 z-30 dark:bg-neutral-800/60 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 p-2 dark:bg-neutral-800 bg-neutral-100 mr-3 rounded-lg">
            <div className="hidden md:flex">
                {children}
            </div>
            <div className="flex md:hidden">
                <div style={{ transform: "scale(0.8)" }}>
                    {children}
                </div>
            </div>
        </div>
        <h1 className="flex items-center text-lg md:text-2xl font-bold">{title}</h1>
        {count?.workspaces && count?.workspaces > 0 && <Tooltip
            content="Total workspaces"
            direction="bottom"
            allContainerClassName="ml-2"
        >
            <div className="dark:bg-neutral-800 bg-neutral-100 p-1 px-2 rounded-lg">
                {count?.workspaces}
            </div>
        </Tooltip>}
        {count?.starred && count?.starred > 0 && <Tooltip
            content="Favorite workspaces"
            direction="bottom"
            allContainerClassName="ml-2"
        >
            <div className="flex flex-row items-center dark:bg-neutral-800 bg-neutral-100 p-1 px-1 pr-2 rounded-lg">
                <StarFilledIcon width={20} height={24} fill="currentColor" style={{ transform: "scale(.8)" }} />
                {count?.starred}
            </div>
        </Tooltip>}
        {count?.private && count?.private > 0 && <Tooltip
            content="Private workspaces"
            direction="bottom"
            allContainerClassName="ml-2"
        >
            <div className="flex flex-row items-center dark:bg-neutral-800 bg-neutral-100 p-1 px-1 pr-2 rounded-lg">
                <VisibleOffIcon width={20} height={24} fill="currentColor" style={{ transform: "scale(.8)" }} />
                {count?.private}
            </div>
        </Tooltip>}
    </div>)
}

export default HomeNavTitle;