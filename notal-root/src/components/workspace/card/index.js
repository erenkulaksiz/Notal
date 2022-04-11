import prettyMilliseconds from "pretty-ms";
import Link from "next/link";

import { MoreIcon, WarningIcon, SettingsIcon, DeleteIcon } from "@icons";
import { Button, Tooltip } from "@components";
import BuildComponent from "@utils/buildComponent";

const CardColor = ({ color }) => {
    return (<div className="w-[.4em] h-full absolute rounded-tl rounded-bl" style={{ backgroundColor: color }} />)
}

const WorkspaceFieldCard = ({ card, onDelete, onSettings, preview, isOwner, fieldCollapsed, cardOwner }) => {

    const BuildTitle = BuildComponent({
        name: "Workspace Field Card Title",
        defaultClasses: "font-medium break-words w-full",
        conditionalClasses: [{ true: "text-xl", false: "text-sm" }],
        selectedClasses: [!fieldCollapsed]
    })

    return (<div className="relative w-full rounded group min-h-min flex flex-row dark:bg-neutral-900 bg-white border-solid border-b-2 border-b-neutral-100 dark:border-b-neutral-800">
        <CardColor color={card.color} />
        <div className="flex flex-1 p-2 pl-4 min-w-full">
            <div className="flex flex-col overflow-ellipsis w-full">
                <div className="flex flex-row justify-between items-center">
                    <span className={BuildTitle.classes}>
                        {card.title}
                    </span>
                    <div className="flex flex-row">
                        {card?.color == "#D28519" && <div className="py-1">
                            <WarningIcon size={24} fill="#D28519" style={{ transform: "scale(.7)" }} />
                        </div>}
                        {(!preview && isOwner) && !fieldCollapsed && <div className="fill-neutral-200 dark:fill-neutral-600 relative">
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
                                <Button light size="sm" className="px-1" title="Show More Card Options" aria-label="Show More Card Options">
                                    <MoreIcon size={24} className="fill-neutral-800 dark:fill-white" style={{ transform: "scale(.7)" }} />
                                </Button>
                            </Tooltip>
                        </div>}
                    </div>
                </div>
                {card?.desc && !fieldCollapsed && <span className="dark:text-neutral-300 text-neutral-800 text-sm mt-1 break-words">
                    {card.desc}
                </span>}
                {card.updatedAt && <span className="text-xs dark:text-neutral-600 text-neutral-400 mt-2 group-hover:flex hidden" title={`Created ${new Date(card.createdAt).getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(card.createdAt).getMonth()]}, ${new Date(card.createdAt).getFullYear()} ${new Date(card.createdAt).getHours().toString().padStart(2, '0')}:${new Date(card.createdAt).getMinutes().toString().padStart(2, '0')} • Updated ${new Date(card.updatedAt).getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(card.updatedAt).getMonth()]}, ${new Date(card.updatedAt).getFullYear()} ${new Date(card.updatedAt).getHours().toString().padStart(2, '0')}:${new Date(card.updatedAt).getMinutes().toString().padStart(2, '0')}`}>
                    <time dateTime={card.updatedAt}>{`Created ${prettyMilliseconds(Date.now() - card.createdAt, { compact: true })} ago • Updated ${prettyMilliseconds(Date.now() - card.updatedAt, { compact: true })} ago`}</time>
                </span>}
                {card.owner && <Link href="/profile/[username]" as={`/profile/${cardOwner?.username || "not-found"}`} passHref>
                    <a className="items-center flex-row group-hover:flex hidden">
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
            </div>
        </div>
    </div>)
}

export default WorkspaceFieldCard;