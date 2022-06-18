import { useState } from "react";
import { motion } from "framer-motion";
import { Draggable } from 'react-beautiful-dnd';

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
    UnfoldIcon,
    DragIcon
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
    onEditCard,
    onDeleteCard,
    isOwner,
    workspaceUsers,
    provided,
    //fieldDraggableProvided,
}) => {
    const [hovered, setHovered] = useState(false);

    if (skeleton) return <WorkspaceFieldSkeleton />;

    const BuildFieldTitle = BuildComponent({
        name: "Workspace Field",
        defaultClasses: "p-2 pr-1 rounded-md w-full flex flex-row dark:bg-neutral-900 bg-white pb-2 overflow-visible border-b-2 border-b-neutral-200 dark:border-b-neutral-800",
        conditionalClasses: [{ true: "z-40", false: "z-10" }],
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
        className="h-full relative rounded-lg shadow flex flex-col items-start dark:bg-neutral-800 bg-neutral-200 p-0.5"
        animate={field?.collapsed && !hovered ? "collapse" : "normal"}
        key={field._id}
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
        onBlur={() => setHovered(false)}
    //{...fieldDraggableProvided.draggableProps}
    //ref={fieldDraggableProvided.innerRef}
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
                        <Button size="md" className="px-2" onClick={onSettings} light title="Field Settings" aria-label="Field Settings">
                            <SettingsIcon size={24} className="fill-neutral-800 dark:fill-white" />
                        </Button>
                        <Button size="md" className="px-2 ml-1" onClick={onDelete} light title="Delete Field" aria-label="Delete Field">
                            <DeleteIcon size={24} className="fill-neutral-800 dark:fill-white" />
                        </Button>
                        <Button size="md" className="px-2 ml-1" onClick={onCollapse} light title={field?.collapsed ? "Uncollapse Field" : "Collapse Field"} aria-label={field?.collapsed ? "Uncollapse Field" : "Collapse Field"}>
                            {field?.collapsed ? <FoldIcon size={24} className="fill-neutral-800 dark:fill-white" style={{ transform: "rotate(90deg)" }} />
                                : <UnfoldIcon size={24} className="fill-neutral-800 dark:fill-white" style={{ transform: "rotate(90deg)" }} />}
                        </Button>
                    </div>}
                >
                    {(hovered || !field?.collapsed) && <button
                        className="py-2"
                        title="Drag Field"
                        aria-label="Drag Field"
                    //{...fieldDraggableProvided.dragHandleProps}
                    >
                        <DragIcon
                            size={24}
                            className="fill-neutral-800 dark:fill-white"
                            style={{ transform: "scale(.7)" }}
                        />
                    </button>}
                </Tooltip>}
            </div>
        </div>
        <div
            className="overflow-auto h-full w-full flex flex-col"
            {...provided.droppableProps}
            ref={provided.innerRef}
        >
            {field?.cards && field?.cards.map((card, index) =>
                <Draggable
                    index={index}
                    draggableId={card._id}
                    isDragDisabled={!isOwner && (hovered || !field?.collapsed)}
                    key={card._id}
                >
                    {(provided, snapshot) => (
                        <>
                            <WorkspaceFieldCard
                                provided={provided}
                                card={card}
                                fieldCollapsed={!!field?.collapsed && !hovered && !snapshot.isDragging}
                                onDelete={() => onDeleteCard({ id: card._id })}
                                isOwner={isOwner}
                                cardOwner={workspaceUsers.filter(el => el.uid == card.owner)[0]}
                                onSettings={() => onEditCard({ card })}
                                isDragging={snapshot.isDragging}
                            />
                            {provided.placeholder}
                        </>
                    )}
                </Draggable>
            )}
            {(field?.cards?.length == 0 || !field?.cards) && <WorkspaceAddCardBanner />}
        </div>
        {isOwner && (hovered || !field?.collapsed) && <WorkspaceAddCardButton
            title={field.title}
            onAddCard={onAddCard}
        />}
    </motion.div>)
}

export default WorkspaceField;