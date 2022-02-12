
const HomeWorkspaceCard = ({ workspace }) => {
    return (<div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-500 to-[#6d02ab] p-3 flex flex-col justify-end">
        <div className="flex flex-row justify-between">
            <div className="flex justify-end text-2xl flex-col text-white">
                <Link href="/workspace/[pid]" as={`/workspace/${workspace._id}`}>
                    <a className="flex-col flex">
                        <span className="font-bold">
                            {workspace.title}
                        </span>
                        <span className="text-lg">
                            {workspace.desc}
                        </span>
                    </a>
                </Link>
            </div>
            <div>
                <Button className="mb-2 p-3 pt-1 pb-1" light>
                    <StarOutlineIcon size={24} fill="currentColor" />
                </Button>
                <Button className="p-3 pt-1 pb-1" light>
                    <DeleteIcon size={24} fill="currentColor" />
                </Button>
            </div>
        </div>
    </div>)
}

export default HomeWorkspaceCard;