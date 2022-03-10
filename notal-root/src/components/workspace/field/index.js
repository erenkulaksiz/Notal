import { motion } from "framer-motion";

import {
    Button,
    Tooltip,
    WorkspaceFieldCard,
    WorkspaceAddCardButton,
    WorkspaceAddCardBanner,
    WorkspaceFieldSkeleton
} from "@components";

import {
    MoreIcon,
    EditIcon,
    FilterIcon
} from "@icons";

import FieldCardIndicator from "../fieldCardIndicator";

const WorkspaceField = ({
    field,
    skeleton = false,
    onCollapse,
    collapsed,
}) => {

    if (skeleton) {
        return (<WorkspaceFieldSkeleton />)
    }

    return (<motion.div

        className="h-full relative rounded shadow min-w-[280px] flex flex-col items-start dark:bg-neutral-800 bg-neutral-100 mr-2"
    >
        <div className="z-20 p-2 pr-1 w-full flex flex-row justify-between backdrop-blur-sm dark:bg-neutral-900/50 bg-white/50 pb-2 shadow-md shadow-neutral-200/50 dark:shadow-neutral-800/50 overflow-visible">
            <div className="flex flex-row items-center">
                <FieldCardIndicator cardCount={field?.cards?.length} />
                <span className="ml-2 font-medium">
                    {field.title}
                </span>
            </div>
            <div className="mr-2 flex flex-row">
                {/*<Tooltip content="Filter" allContainerClassName="mr-2" direction="top">
                    <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <FilterIcon size={24} className="dark:fill-white fill-black" />
                    </Button>
                </Tooltip>*/}
                <Tooltip
                    containerClassName="px-1 p-1"
                    blockContent={false}
                    direction="bottom"
                    content={<div className="flex flex-row p-1">
                        <Button size="md" className="px-2">
                            <EditIcon size={24} fill="currentColor" />
                        </Button>
                        <Button size="md" className="px-2 ml-1">
                            <FilterIcon size={24} fill="currentColor" />
                        </Button>
                    </div>}
                >
                    <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <MoreIcon size={24} className="dark:fill-white fill-black" />
                    </Button>
                </Tooltip>
            </div>
        </div>
        <div className="overflow-auto h-full">
            {field?.cards && field?.cards.map((card, index) =>
                <WorkspaceFieldCard card={card} key={card._id} />
            )}
            {(field?.cards?.length == 0 || !field?.cards)
                && <WorkspaceAddCardBanner />}
        </div>
        <WorkspaceAddCardButton title={field.title} />

    </motion.div>)
}

export default WorkspaceField;