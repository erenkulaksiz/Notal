
import { WorkspaceSidebarItem } from "@components";
import { WorkspaceButtons } from "@utils/constants";

const WorkspaceSidebar = ({
    onStarred,
    onSettings,
    onVisible,
    onDelete,
    onAddField,
    workspaceStarred,
    workspaceVisible,
}) => {
    const action = {
        favorite: () => onStarred(),
        settings: () => onSettings(),
        visible: () => onVisible(),
        delete: () => onDelete(),
        addfield: () => onAddField(),
    }

    return (<div className="flex flex-col items-center py-2 h-full sticky backdrop-blur-md top-0 w-14 dark:bg-neutral-800/50 bg-white/50 shadow-xl dark:shadow-neutral-800 shadow-neutral-300 pt-2 z-40">
        {WorkspaceButtons.map((item, index) => (<WorkspaceSidebarItem
            item={item}
            key={index}
            onClick={action[item.id]}
            state={{
                visible: workspaceVisible || false,
                favorite: workspaceStarred || false,
            }}
        />))}
    </div>)
}

export default WorkspaceSidebar;