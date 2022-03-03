import {
    Button,
    Tooltip,
    WorkspaceFieldCard,
    WorkspaceAddCardButton,
    WorkspaceAddCardBanner
} from "@components";

import {
    MoreIcon,
    FilterIcon
} from "@icons";

import FieldCardIndicator from "../fieldCardIndicator";
import FieldSkeleton from "./skeleton";

const WorkspaceField = ({ field, skeleton }) => {

    if (skeleton) {
        return (<FieldSkeleton />)
    }

    return (<div className="h-full relative z-10 rounded shadow min-w-[280px] flex flex-col items-start dark:bg-neutral-800 bg-neutral-100 mr-2 overflow-y-auto overflow-x-clip pb-2">
        <div className="w-full flex flex-row justify-between sticky top-0 backdrop-blur-sm dark:bg-neutral-900/50 bg-white/50 pb-2">
            <FieldCardIndicator count={field?.cards?.length} />
            <div className="mr-2 mt-2 flex flex-row relative">
                <Tooltip content="Filter" allContainerClassName="mr-2" direction="top">
                    <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <FilterIcon size={24} className="dark:fill-white fill-black" />
                    </Button>
                </Tooltip>
                <Tooltip content="asdkasj" direction="bottom">
                    <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <MoreIcon size={24} className="dark:fill-white fill-black" />
                    </Button>
                </Tooltip>
            </div>
        </div>
        {field?.cards && field?.cards.map((card, index) =>
            <WorkspaceFieldCard card={card} key={card._id} />
        )}
        {(field?.cards?.length == 0 || !field?.cards) && <WorkspaceAddCardBanner />}

        <WorkspaceAddCardButton />
    </div>)
}

export default WorkspaceField;