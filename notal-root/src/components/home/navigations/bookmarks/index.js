import {
    BookmarkFilledIcon
} from '@icons';

import {
    HomeNavTitle
} from '@components';

const HomeNavBookmarks = () => {
    return (<div className="flex flex-1 px-8 py-4 flex-col">
        <HomeNavTitle title="Bookmarks">
            <BookmarkFilledIcon size={24} fill="currentColor" />
        </HomeNavTitle>
        <div className="mt-4 flex flex-1">
            {"<3"}
        </div>
    </div>)
}

export default HomeNavBookmarks;