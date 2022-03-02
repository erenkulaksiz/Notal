import { Button, Tooltip } from "@components";

import {
    MoreIcon,
    FilterIcon
} from "@icons";

const WorkspaceField = ({ field }) => {
    return (<div className="z-50 rounded shadow min-w-[250px] h-full flex flex-col items-start dark:bg-neutral-800 bg-neutral-100 mr-2">
        <div className="w-full flex flex-row justify-between">
            {field?.cards ? <div className="shadow-md flex mt-2 ml-2 items-center justify-center w-10 h-10 p-2 text-lg font-bold bg-white dark:bg-neutral-900 rounded-lg">
                {field?.cards?.length}
            </div> : <div />}
            <div className="mr-2 mt-2 flex flex-row">
                <Tooltip content="Filter">
                    <Button light size="sm" className="px-2 rounded-md mr-2 active:scale-90">
                        <FilterIcon size={24} fill="currentColor" />
                    </Button>
                </Tooltip>
                <Tooltip content="asdkasj">
                    <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <MoreIcon size={24} fill="currentColor" />
                    </Button>
                </Tooltip>
            </div>
        </div>
    </div>)
}

export default WorkspaceField;