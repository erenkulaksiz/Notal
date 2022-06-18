
const HomeBookmarkItem = ({ bookmark }) => {
    return (<div className="w-full flex h-10 dark:bg-neutral-900 bg-white border-2 border-solid border-neutral-200 dark:border-neutral-700 p-2 rounded-lg">
        {bookmark?.url}
    </div>)
}

export default HomeBookmarkItem;