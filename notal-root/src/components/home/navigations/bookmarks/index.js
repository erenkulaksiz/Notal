import {
    AddIcon,
    BookmarkFilledIcon
} from '@icons';

import {
    HomeNavTitle,
    Input,
    Button
} from '@components';

const HomeNavBookmarks = () => {
    return (<div className="flex flex-1 px-8 py-4 flex-col">
        <HomeNavTitle title="Bookmarks">
            <BookmarkFilledIcon size={24} fill="currentColor" />
        </HomeNavTitle>
        <div className="mt-4 flex flex-1">
            <div className="flex flex-row items-start w-full">
                <Input
                    placeholder="Paste Bookmark"
                    className="w-full"
                    fullWidth
                />
                <Button className="ml-2">
                    <AddIcon size={24} fill="currentColor" />
                </Button>
            </div>
        </div>
    </div>)
}

export default HomeNavBookmarks;