import { useState } from 'react';
import {
    AddIcon,
    BookmarkFilledIcon
} from '@icons';

import {
    HomeNavTitle,
    HomeBookmarkItem,
    Input,
    Button,
    Tab
} from '@components';

const HomeNavBookmarks = () => {
    const [currBookmark, setCurrBookmark] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [tab, setTab] = useState(0);

    const add = () => {
        setBookmarks([...bookmarks, { url: currBookmark }]);
    }

    return (<div className="flex flex-1 flex-col relative">
        <HomeNavTitle title="Bookmarks">
            <BookmarkFilledIcon size={24} fill="currentColor" />
        </HomeNavTitle>
        <div className="mt-2 flex flex-1 flex-col px-4">
            <div className="flex mb-2 flex-1 flex-col mt-2 dark:bg-neutral-800 bg-neutral-100 rounded-xl p-2">
                <div className="flex flex-row items-start w-full">
                    <Input
                        placeholder="Paste Bookmark"
                        className="w-full"
                        fullWidth
                        onChange={(e) => setCurrBookmark(e.target.value)}
                    />
                    <Button className="ml-2" onClick={() => add()}>
                        <AddIcon size={24} fill="currentColor" />
                    </Button>
                </div>
                <Tab
                    selected={tab}
                    onSelect={({ index }) => setTab(index)}
                    className="mt-2"
                    id="bookmarkTabs"
                    headerClassName="sm:w-[40%] md:w-[20%] w-full dark:bg-transparent bg-white"
                    views={[
                        { title: "tab1", id: "tab1" },
                        { title: "tab2", id: "tab2" }
                    ]}
                >
                    <Tab.TabView index={0} className="pt-2 flex flex-col gap-2">
                        {bookmarks.map((bookmark, index) => <HomeBookmarkItem bookmark={bookmark} key={index} />)}
                    </Tab.TabView>
                    <Tab.TabView index={1} className="pt-2 flex flex-col gap-2">
                        dfhfg
                    </Tab.TabView>
                </Tab>
            </div>
        </div>
    </div>)
}

export default HomeNavBookmarks;