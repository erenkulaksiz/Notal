import { Tooltip, Button } from "@components";

const WorkspaceSidebarItem = ({
    item,
    onClick,
    state, // Icon and text state bool
}) => {
    return (<Tooltip content={item.multi ? item.name[state[item.id]] : item.name} direction="right" allContainerClassName="mb-2">
        <Button
            onClick={() => onClick({ item })}
            className="justify-center"
            size="w-10 h-10"
            rounded="rounded-md"
            light="dark:bg-neutral-700 shadow bg-white hover:dark:bg-neutral-600 hover:bg-neutral-200 active:dark:bg-neutral-500 active:bg-neutral-300 outline-none focus:outline-2"
        >
            {item.multi ? item.icon[state[item.id]] : item.icon}
        </Button>
    </Tooltip>)
}

export default WorkspaceSidebarItem;