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

    return (<div className="h-full relative z-10 rounded shadow min-w-[280px] flex flex-col items-start dark:bg-neutral-800 bg-neutral-100 mr-2 overflow-y-auto pb-2">
        <div className="z-30 p-2 pr-1 w-full flex flex-row justify-between sticky top-0 backdrop-blur-sm dark:bg-neutral-900/50 bg-white/50 pb-2 shadow-md shadow-neutral-200/50 dark:shadow-neutral-800/50">
            <div className="flex flex-row items-center">
                <FieldCardIndicator count={field?.cards?.length} />
                <span className="ml-2 font-medium">
                    {field.title}
                </span>
            </div>
            <div className="mr-2 flex flex-row relative">
                {/*<Tooltip content="Filter" allContainerClassName="mr-2" direction="top">
                    <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <FilterIcon size={24} className="dark:fill-white fill-black" />
                    </Button>
                </Tooltip>*/}
                <Tooltip content="asdkasj" direction="top">
                    <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <MoreIcon size={24} className="dark:fill-white fill-black" />
                    </Button>
                </Tooltip>
            </div>
        </div>
        {field?.cards && field?.cards.map((card, index) =>
            <WorkspaceFieldCard card={card} key={card._id} />
        )}
        {(field?.cards?.length == 0 || !field?.cards)
            && <WorkspaceAddCardBanner />}

        <WorkspaceAddCardButton title={field.title} />
    </div>)
}

export default WorkspaceField;