import {
    HomeNavWorkspaces,
    HomeNavBookmarks,
} from '@components';

const NavSelector = ({ nav, ...props }) => {
    switch (nav) {
        case "workspaces":
            return <HomeNavWorkspaces {...props} />
        case "bookmarks":
            return <HomeNavBookmarks {...props} />
        default:
            return <div>no route found</div>
    }
}

export default NavSelector;