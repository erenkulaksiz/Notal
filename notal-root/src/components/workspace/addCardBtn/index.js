import { Button, Tooltip } from "@components";
import { AddIcon } from "@icons";

const WorkspaceAddCardButton = ({ onClick, title }) => {
    return (<div className="z-30 absolute bottom-2 right-2 w-full flex justify-end items-end">
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