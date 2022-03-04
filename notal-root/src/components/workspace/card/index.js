import { MoreIcon, WarningIcon } from "@icons";
import { Button } from "@components";

const CardColor = ({ color }) => {
    return (<div className="min-w-[.7em] h-full" style={{ backgroundColor: color }} />)
}

const WorkspaceFieldCard = ({ card }) => {
    return (<div className="w-full min-h-min flex dark:bg-neutral-900 bg-white border-solid border-t-2 border-t-neutral-100 dark:border-t-neutral-800">
        <CardColor color={card.color} />
        <div className="flex flex-1 p-2">
            <div className="flex flex-col overflow-ellipsis w-full">
                <div className="flex flex-row justify-between">
                    <span className="text-xl font-medium break-before-left w-full">
                        {card.title}
                    </span>
                    <div className="flex flex-row">
                        {card.color == "#D28519" && <div className="py-1">
                            <WarningIcon size={24} fill="#D28519" style={{ transform: "scale(.7)" }} />
                        </div>}
                        <div className="fill-neutral-200 dark:fill-neutral-600">
                            <Button light size="sm" className="px-1">
                                <MoreIcon size={24} fill="currentFill" style={{ transform: "scale(.7)" }} />
                            </Button>
                        </div>
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