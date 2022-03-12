import { MoreIcon, WarningIcon, SettingsIcon, DeleteIcon } from "@icons";
import { Button, Tooltip } from "@components";

const CardColor = ({ color }) => {
    return (<div className="w-[.4em] h-full absolute" style={{ backgroundColor: color }} />)
}

const WorkspaceFieldCard = ({ card, onDelete, onSettings, preview }) => {
    return (<div className="relative w-full min-h-min flex flex-row dark:bg-neutral-900 bg-white border-solid border-b-2 border-b-neutral-100 dark:border-b-neutral-800">
        <CardColor color={card.color} />
        <div className="flex flex-1 p-2 pl-4">
            <div className="flex flex-col overflow-ellipsis w-full">
                <div className="flex flex-row justify-between">
                    <span className="text-xl font-medium break-before-left w-full">
                        {card.title}
                    </span>
                    <div className="flex flex-row">
                        {card.color == "#D28519" && <div className="py-1">
                            <WarningIcon size={24} fill="#D28519" style={{ transform: "scale(.7)" }} />
                        </div>}
                        {!preview && <div className="fill-neutral-200 dark:fill-neutral-600 relative">
                            <Tooltip
                                containerClassName="px-1 p-1"
                                blockContent={false}
                                direction="left"
                                content={<div className="flex flex-row p-1">
                                    <Button size="md" className="px-2" onClick={onSettings}>
                                        <SettingsIcon size={24} fill="currentColor" />
                                    </Button>
                                    <Button size="md" className="px-2 ml-1" onClick={onDelete}>
                                        <DeleteIcon size={24} fill="currentColor" />
                                    </Button>
                                </div>}
                            >
                                <Button light size="sm" className="px-1">
                                    <MoreIcon size={24} fill="currentFill" style={{ transform: "scale(.7)" }} />
                                </Button>
                            </Tooltip>

                        </div>}
                    </div>
                </div>
                {card.desc && <span className="dark:text-neutral-300 text-neutral-800 text-sm mt-1 break-all">
                    {card.desc}
                </span>}
            </div>
        </div>
    </div>)
}

export default WorkspaceFieldCard;