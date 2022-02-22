import {
    HomeNavWorkspaces,
    HomeNavBookmarks,
} from '@components';

const NavSelector = ({ nav, workspaces, validate }) => {
    switch (nav) {
        case "workspaces":
            return <HomeNavWorkspaces workspaces={workspaces} validate={validate} />
        case "bookmarks":
            return <HomeNavBookmarks />
        default:
            return <div>no route found</div>
    }
}

export default NavSelector;