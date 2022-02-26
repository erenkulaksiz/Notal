import {
    BookmarkFilledIcon
} from '@icons';

const HomeNavBookmarks = () => {
    return (<div className="flex flex-1 px-8 py-4 flex-col">
        <div className="flex flex-row h-10 items-center">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 p-2 dark:bg-neutral-800 bg-neutral-100 mr-3 rounded-lg">
                <div className="hidden md:flex">
                    <BookmarkFilledIcon size={24} fill="currentColor" />
                </div>
                <div className="flex md:hidden">
                    <BookmarkFilledIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />
                </div>
            </div>
            <h1 className="flex items-center text-lg md:text-2xl font-bold">Bookmarks</h1>
        </div>
        <div className="mt-4 flex flex-1">
            {"<3"}
        </div>
    </div>)
}

export default HomeNavBookmarks;