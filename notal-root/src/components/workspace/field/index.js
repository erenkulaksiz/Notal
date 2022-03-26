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
import BuildComponent from "@utils/buildComponent";

const WorkspaceField = ({
    field,
    skeleton = false,
    onSettings,
    onDelete,
    onCollapse,
    onAddCard,
    onDeleteCard,
    isOwner,
    workspaceUsers
}) => {
    const [hovered, setHovered] = useState(false);

    if (skeleton) {
        return (<WorkspaceFieldSkeleton />)
    }

    const BuildFieldTitle = BuildComponent({
        name: "Workspace Field",
        defaultClasses: "p-2 pr-1 w-full flex flex-row backdrop-blur-sm dark:bg-neutral-900/50 bg-white/50 pb-2 overflow-visible border-b-2 border-b-neutral-100 dark:border-b-neutral-800",
        conditionalClasses: [{ true: "z-50", false: "z-10" }],
        selectedClasses: [hovered],
    });

    const BuildTitleContainer = BuildComponent({
        name: "Workspace Title Container",
        defaultClasses: "flex items-center w-full",
        conditionalClasses: [{ true: "flex-col", false: "flex-row" }],
        selectedClasses: [!!field?.collapsed && !hovered]
    });

    const BuildTitle = BuildComponent({
        name: "Workspace Title",
        defaultClasses: "break-words text-center font-medium",
        conditionalClasses: [{ true: "mt-1 text-sm", false: "ml-2 text-md" }],
        selectedClasses: [!!field?.collapsed && !hovered]
    })

    return (<motion.div // min-w-[280px] 
        className="h-full relative rounded shadow flex flex-col items-start dark:bg-neutral-800 bg-neutral-100 p-0.5 mr-1.5"
        animate={field?.collapsed && !hovered ? "collapse" : "normal"}
        variants={{
            collapse: {
                width: "140px",
                minWidth: "140px",
                maxWidth: "140px"
            },
            normal: {
                minWidth: "280px",
                width: "280px",
                maxWidth: "280px",
            }
        }}
        transition={{ type: "spring", damping: 15, mass: .25 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    //onClick={() => setHovered(!hovered)}
    >
        <div className={BuildFieldTitle.classes}>
            <div className={BuildTitleContainer.classes}>
                <FieldCardIndicator cardCount={field?.cards?.length} />
                <span className={BuildTitle.classes}>
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
                    content={<div className="flex flex-row">
                        <Button size="md" className="px-2" light>
                            <SettingsIcon size={24} className="fill-neutral-800 dark:fill-white" />
                        </Button>
                        <Button size="md" className="px-2 ml-1" onClick={onDelete} light>
                            <DeleteIcon size={24} className="fill-neutral-800 dark:fill-white" />
                        </Button>
                        <Button size="md" className="px-2 ml-1" onClick={onCollapse} light>
                            {field.collapsed ?
                                <FoldIcon size={24} className="fill-neutral-800 dark:fill-white" style={{ transform: "rotate(90deg)" }} />
                                :
                                <UnfoldIcon size={24} className="fill-neutral-800 dark:fill-white" style={{ transform: "rotate(90deg)" }} />}
                        </Button>
                    </div>}
                >
                    {(hovered || !field?.collapsed) && <Button light size="sm" className="px-2 rounded-md active:scale-90">
                        <MoreIcon size={24} className="dark:fill-white fill-black" />
                    </Button>}
                </Tooltip>}
            </div>
        </div>
        <div className="overflow-auto h-full w-full">
            {field?.cards && field?.cards.map((card, index) =>
                <WorkspaceFieldCard
                    card={card}
                    fieldCollapsed={!!field?.collapsed && !hovered}
                    key={card._id}
                    onDelete={() => onDeleteCard({ id: card._id })}
                    isOwner={isOwner}
                    cardOwner={workspaceUsers.filter(el => el.uid == card.owner)[0]}
                />
            )}
            {(field?.cards?.length == 0 || !field?.cards)
                && <WorkspaceAddCardBanner />}
        </div>
        {isOwner && (hovered || !field?.collapsed) && <WorkspaceAddCardButton
            title={field.title}
            onAddCard={onAddCard}
        />}
    </motion.div>)
}

export default WorkspaceField;