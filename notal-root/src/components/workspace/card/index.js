
const CardColor = ({ color }) => {
    return (<div className="min-w-[1em] h-full" style={{ backgroundColor: color }} />)
}

const WorkspaceFieldCard = ({ card }) => {
    return (<div className="w-full min-h-min flex dark:bg-neutral-900 bg-white border-solid border-t-2 border-t-neutral-100 dark:border-t-neutral-800">
        <CardColor color={card.color} />
        <div className="flex flex-1 p-2">
            <div className="flex flex-col overflow-ellipsis">
                <span className="text-xl font-medium break-before-left">
                    {card.title}
                </span>
                {card.desc && <span className="dark:text-neutral-300 text-neutral-800 text-sm mt-1 break-all">
                    {card.desc}
                </span>}
            </div>
        </div>
    </div>)
}

export default WorkspaceFieldCard;