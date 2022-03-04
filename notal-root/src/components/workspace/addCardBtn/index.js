import { Button, Tooltip } from "@components";
import { AddIcon } from "@icons";

const WorkspaceAddCardButton = ({ onClick, title }) => {
    return (<div className="z-30 sticky bottom-6 w-full h-full flex justify-end items-end">
        <Tooltip content={`Add card to ${title}`} allContainerClassName="mr-4">
            <Button
                light="dark:bg-blue-600/60 bg-blue-600/70 backdrop-blur-sm shadow"
                onClick={onClick}
            >
                <AddIcon size={24} fill="currentColor" />
            </Button>
        </Tooltip>
    </div>)
}

export default WorkspaceAddCardButton;