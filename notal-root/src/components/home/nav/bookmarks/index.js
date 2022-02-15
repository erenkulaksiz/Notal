import {
    BookmarkFilledIcon
} from '@icons';

const HomeNavBookmarks = () => {
    return (<div className="flex flex-1 px-8 py-4 flex-col">
        <div className="w-full flex flex-row items-center">
            <div className="p-2 dark:bg-neutral-800 bg-neutral-100 mr-3 rounded-lg">
                <BookmarkFilledIcon size={24} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        </div>
        <div className="mt-4 dark:bg-neutral-800 bg-neutral-100 rounded-lg p-4 h-full">
            {"<3"}
        </div>
    </div>)
}

export default HomeNavBookmarks;