import { useState } from "react";
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
    FilterIcon,
    DeleteIcon,
    SettingsIcon,
    FoldIcon,
    UnfoldIcon
} from "@icons";

import FieldCardIndicator from "../fieldCardIndicator";

const WorkspaceField = ({
    field,
    skeleton = false,
    onSettings,
    onDelete,
    onCollapse,
    onAddCard,
    onDeleteCard,
    isOwner
}) => {
    const [hovered, setHovered] = useState(false);

    if (skeleton) {
        return (<WorkspaceFieldSkeleton />)
    }

    return (<motion.div // min-w-[280px] 
        className="h-full relative rounded shadow flex flex-col items-start dark:bg-neutral-800 bg-neutral-200 p-0.5 mr-1.5"
        animate={field?.collapsed && !hovered ? "collapse" : "normal"}
        variants={{
            collapse: {
                width: "120px",
                minWidth: "120px"
            },
            normal: {
                minWidth: "280px",
                width: "280px"
            }
        }}
        transition={{ type: "spring", damping: 15, mass: .25 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <div className={`${hovered ? "z-50" : "z-10"} p-2 pr-1 w-full flex flex-row justify-between backdrop-blur-sm dark:bg-neutral-900/50 bg-white/50 pb-2 overflow-visible border-b-2 border-b-neutral-200 dark:border-b-neutral-800`}>
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
                {isOwner && <Tooltip
                    containerClassName="px-1 p-1"
                    blockContent={false}
                    direction="bottom"
                    content={<div className="flex flex-row p-1">
                        <Button size="md" className="px-2">
                            <SettingsIcon size={24} fill="currentColor" />
                        </Button>
                        <Button size="md" className="px-2 ml-1" onClick={onDelete}>
                            <DeleteIcon size={24} fill="currentColor" />
                        </Button>
                        <Button size="md" className="px-2 ml-1" onClick={onCollapse}>
                            {field.collapsed ? <FoldIcon size={24} fill="currentColor" style={{ transform: "rotate(90deg)" }} /> : <UnfoldIcon size={24} fill="currentColor" style={{ transform: "rotate(90deg)" }} />}
                        </Button>
                    </div>}
                >
                    <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <MoreIcon size={24} className="dark:fill-white fill-black" />
                    </Button>
                </Tooltip>}
            </div>
        </div>
        <div className="overflow-auto h-full w-full">
            {field?.cards && field?.cards.map((card, index) =>
                <WorkspaceFieldCard
                    card={card}
                    key={card._id}
                    onDelete={() => onDeleteCard({ id: card._id })}
                    isOwner={isOwner}
                />
            )}
            {(field?.cards?.length == 0 || !field?.cards)
                && <WorkspaceAddCardBanner />}
        </div>
        {isOwner && <WorkspaceAddCardButton
            title={field.title}
            onAddCard={onAddCard}
        />}
    </motion.div>)
}

export default WorkspaceField;