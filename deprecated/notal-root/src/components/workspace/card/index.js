import { useState, useEffect } from "react";
import prettyMilliseconds from "pretty-ms";
import Link from "next/link";
import FsLightbox from 'fslightbox-react';

import { MoreIcon, WarningIcon, SettingsIcon, DeleteIcon, DragIcon } from "@icons";
import { Button, Tooltip } from "@components";
import BuildComponent from "@utils/buildComponent";
import { formatDate } from "@utils";

const CardColor = ({ color }) => {
    if (!color) return null;
    return (<div className="flex min-w-[.4em] rounded-tl rounded-bl shadow" style={{ backgroundColor: color }} />)
}

const CardTag = ({ color, title, small = false }) => {

    const BuildCardTag = BuildComponent({
        name: "Workspace Field Card Tag",
        defaultClasses: "p-1 py-[2px] border-2 flex rounded-lg dark:border-neutral-800 border-neutral-300",
        conditionalClasses: [{ true: "text-[.6em]", false: "text-xs" }],
        selectedClasses: [small]
    });

    return (<div className={BuildCardTag.classes} style={{ borderColor: color }}>
        {title}
    </div>)
}

const WorkspaceFieldCard = ({
    card,
    onDelete,
    onSettings,
    preview,
    isOwner,
    fieldCollapsed,
    cardOwner,
    isDragging,
    provided,
    className,
},) => {
    const [isImageFS, setIsImageFS] = useState(false);

    const BuildTitle = BuildComponent({
        name: "Workspace Field Card Title",
        defaultClasses: "font-medium break-words w-full",
        conditionalClasses: [{ true: "text-xl", false: "text-sm" }],
        selectedClasses: [!fieldCollapsed]
    });

    const BuildCard = BuildComponent({
        name: "Workspace Field Card",
        defaultClasses: "relative w-full rounded-lg group min-h-min flex flex-row dark:bg-neutral-900 bg-white",
        extraClasses: className,
        conditionalClasses: [{
            true: "border-dashed border-2 border-neutral-300 dark:border-neutral-700 shadow-xl",
            false: "border-solid border-b-2 border-b-neutral-200 dark:border-b-neutral-800"
        }],
        selectedClasses: [isDragging]
    });

    return (<div
        className={BuildCard.classes}
        ref={provided?.innerRef}
        key={card._id}
        {...provided?.draggableProps}
    >
        <CardColor color={card.color} />
        <div className="flex flex-1 p-2 px-3 w-full">
            <div className="flex flex-col items-start overflow-ellipsis w-full">
                {card?.tags?.length > 0
                    && Array.isArray(card?.tags)
                    && !fieldCollapsed
                    && <div className="flex flex-row gap-1 flex-wrap mb-1">
                        {card?.tags?.map((tag, index) => tag?.title
                            && <CardTag
                                key={tag._id}
                                color={tag?.color}
                                title={tag?.title}
                            />
                        )}
                    </div>}
                <div className="flex flex-row w-full justify-between items-center">
                    <div className={BuildTitle.classes}>
                        {card?.title}
                    </div>
                    <div className="flex flex-row">
                        {card?.color == "#D28519" && <div className="py-1">
                            <WarningIcon size={24} fill="#D28519" style={{ transform: "scale(.7)" }} />
                        </div>}
                        {(!preview && isOwner) && !fieldCollapsed ? <div className="flex flex-row fill-neutral-200 dark:fill-neutral-600 relative">
                            <Tooltip
                                containerClassName="px-1 p-1"
                                blockContent={false}
                                direction="left"
                                content={<div className="flex flex-row">
                                    <Button size="md" className="px-2" onClick={onSettings} light title="Card Settings" aria-label="Card Settings">
                                        <SettingsIcon size={24} className="fill-neutral-800 dark:fill-white" />
                                    </Button>
                                    <Button size="md" className="px-2 ml-1" onClick={onDelete} light title="Delete Card" aria-label="Delete Card">
                                        <DeleteIcon size={24} className="fill-neutral-800 dark:fill-white" />
                                    </Button>
                                </div>}
                            >
                                <button
                                    //className="pl-2"
                                    title="Drag Card"
                                    aria-label="Drag Card"
                                    {...provided.dragHandleProps}
                                >
                                    <DragIcon
                                        size={24}
                                        className="fill-neutral-800 dark:fill-white"
                                        style={{ transform: "scale(.7)" }}
                                    />
                                </button>
                            </Tooltip>
                        </div> : (!preview && <div className="hidden" {...provided.dragHandleProps} />)}
                    </div>
                </div>
                {card?.desc && !fieldCollapsed && <span className="dark:text-neutral-300 text-neutral-800 w-full text-sm mt-1 mb-1 break-words">
                    {card.desc}
                </span>}
                {card?.image && card?.image?.file && <>
                    <div className="flex items-center justify-center w-full">
                        <img
                            src={card?.image?.file}
                            className="object-cover border-[2px] border-neutral-200 p-[1px] dark:border-neutral-800 rounded-lg w-full cursor-pointer hover:opacity-80 shadow-lg max-w-[250px] max-h-[360px]"
                            alt="card image"
                            onClick={() => setIsImageFS(!isImageFS)}
                        />
                    </div>
                    <FsLightbox
                        toggler={isImageFS}
                        sources={[card?.image?.file]}
                        types={["image"]}
                    />
                </>}
                {card.updatedAt && <span className="mt-1 text-xs dark:text-neutral-600 text-neutral-400 hidden group-hover:flex" title={`Created ${formatDate(card.createdAt)} • Updated ${formatDate(card.updatedAt)}`}>
                    <time dateTime={card.updatedAt}>{`Created ${prettyMilliseconds(Date.now() - card.createdAt, { compact: true })} ago • Updated ${prettyMilliseconds(Date.now() - card.updatedAt, { compact: true })} ago`}</time>
                </span>}
                {card.owner && <Link href="/profile/[username]" as={`/profile/${cardOwner?.username || "not-found"}`} passHref>
                    <a className="items-center flex-row mt-1 hidden group-hover:flex">
                        <div className="p-[2px] w-8 h-8 rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
                            <img
                                src={cardOwner?.avatar}
                                className="w-7 h-7 rounded-full border-[2px] dark:border-black border-white"
                                alt="Avatar"
                            />
                        </div>
                        <div className="flex flex-col ml-1">
                            <span className="h-5">{cardOwner?.fullname ? `${cardOwner?.fullname}` : `@${cardOwner?.username}`}</span>
                            {cardOwner?.fullname && <span className="text-xs dark:text-neutral-500 text-neutral-400">@{cardOwner?.username}</span>}
                        </div>
                    </a>
                </Link>}
                {fieldCollapsed
                    && card?.tags
                    && card?.tags?.length > 0
                    && Array.isArray(card?.tags)
                    && <div className="flex flex-row gap-1 flex-wrap mt-1">
                        {card?.tags?.slice(0, 1).map((tag, index) => tag?.title &&
                            <CardTag
                                key={tag._id || index}
                                color={tag?.color}
                                title={tag?.title}
                                small
                            />
                        )}
                    </div>
                }
            </div>
        </div>
    </div>)
}

export default WorkspaceFieldCard;