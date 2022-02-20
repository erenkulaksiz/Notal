import {
    HomeNavWorkspaces,
    HomeNavBookmarks,
} from '@components';

const NavSelector = ({ nav, workspaces, onAddWorkspace }) => {
    switch (nav) {
        case "workspaces":
            return <HomeNavWorkspaces workspaces={workspaces} onAddWorkspace={onAddWorkspace} />

        case "bookmarks":
            return <HomeNavBookmarks />
        default:
            return <div>no route found</div>
    }
}

export default NavSelector;