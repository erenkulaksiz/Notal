const HomeWorkspaceCardSkeleton = () => {
    return (<div className="w-full h-32 flex flex-col justify-end shadow-2xl rounded-xl bg-white dark:bg-neutral-800 overflow-hidden">
        <div className="animate-pulse w-full h-18 px-4 pb-4">
            <div className="w-[65%] h-6 bg-neutral-300 dark:bg-neutral-700" />
            <div className="w-[80%] mt-2 h-4 bg-neutral-300 dark:bg-neutral-700" />
        </div>
    </div>)
}

export default HomeWorkspaceCardSkeleton;