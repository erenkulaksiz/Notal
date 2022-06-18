import { Tooltip, Button } from "@components";

const WorkspaceSidebarItem = ({
    item,
    onClick,
    state, // Icon and text state bool
}) => {
    return (<Tooltip
        content={item.multi ? item.name[state[item.id]] : item.name}
        direction="right"
        allContainerClassName="mb-2 w-10"
    >
        <Button
            onClick={() => onClick({ item })}
            className="justify-center"
            size="h-10"
            rounded="rounded-md"
            light="outline-none focus:outline-2 bg-neutral-100 dark:bg-neutral-800 backdrop-blur-sm"
            title={item.multi ? item.name[state[item.id]] : item.name}
            aria-label={item.multi ? item.name[state[item.id]] : item.name}
        >
            {item.multi ? item.icon[state[item.id]] : item.icon}
        </Button>
    </Tooltip>)
}

export default WorkspaceSidebarItem;