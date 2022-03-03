import { WarningIcon } from "@icons";

const CardColor = ({ color }) => {
    return (<div className="min-w-[1em] h-full" style={{ backgroundColor: color }} />)
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
                    {card.color == "#D28519" && <div>
                        <WarningIcon size={24} fill="#D28519" style={{ transform: "scale(.7)" }} />
                    </div>}
                </div>
                {card.desc && <span className="dark:text-neutral-300 text-neutral-800 text-sm mt-1 break-all">
                    {card.desc}
                </span>}
            </div>
        </div>
    </div>)
}

export default WorkspaceFieldCard;