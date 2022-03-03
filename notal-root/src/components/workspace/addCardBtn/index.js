import { Button, Tooltip } from "@components";
import { AddIcon } from "@icons";

const WorkspaceAddCardButton = ({ onClick }) => {
    return (<div className="sticky bottom-0 w-full h-full flex justify-end items-end">
        <Tooltip content="Add Card to Field" allContainerClassName="mr-4">
            <Button
                light="dark:bg-blue-600/60 bg-blue-600/80 backdrop-blur-sm shadow"
                onClick={onClick}
            >
                <AddIcon size={24} fill="currentColor" />
            </Button>
        </Tooltip>
    </div>)
}

export default WorkspaceAddCardButton;