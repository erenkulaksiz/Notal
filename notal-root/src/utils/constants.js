import { HomeNavBookmarks, HomeNavWorkspaces } from '@components';
import {
    PeopleIcon,
    ShareIcon,
    UserIcon,
    AddIcon,
    BookmarkOutlineIcon,
    BookmarkFilledIcon,
    DashboardOutlineIcon,
    DashboardFilledIcon,
    VisibleIcon,
    VisibleOffIcon,
    StarFilledIcon,
    StarOutlineIcon,
    SettingsIcon,
    DeleteIcon,
} from '@icons';

export const CardColors = [
    {
        type: "color",
        name: "",
        code: "currentColor",
        showName: "None"
    },
    {
        type: "color",
        name: "Red",
        code: "#a30b0b",
        showName: "Red",
    },
    {
        type: "color",
        name: "Green",
        code: "#10AC63",
        showName: "Green",
    },
    {
        type: "color",
        name: "Blue",
        code: "#0070F3",
        showName: "Blue",
    },
    {
        type: "color",
        name: "Yellow",
        code: "#D28519",
        showName: "Yellow",
    },
    {
        type: "color",
        name: "Custom (coming soon)",
        showName: "Custom (coming soon)",
        code: "gray",
        selectable: false,
    }
];

export const Features = [
    {
        title: "Create",
        desc: "You can create workspace and add fields, cards & images.",
        icon: <AddIcon size={20} fill="currentColor" />
    },
    {
        title: "Personalize",
        desc: "You can customize your profile how you'd like, change your bio, add social links and more.",
        icon: <UserIcon size={20} fill="currentColor" />
    },
    {
        title: "Share",
        desc: "You can share your bookmarks and workspaces with a link, you can also set their visibility to private.",
        icon: <ShareIcon size={20} fill="currentColor" />
    },
    {
        title: "Create Teams",
        desc: "You can invite whoever you want to your team. You can create bookmarks & workspaces inside teams and work together with your teammates!",
        icon: <PeopleIcon size={20} fill="currentColor" />
    },
];

export const Fields = [{
    title: "Bugs",
    id: "1",
    cards: [{
        "title": "Full height field",
        "desc": "Full height fields overflow screen and scroll bar should be on fields, not the container",
        "color": "#a30b0b",
        "_id": 1
    },
    {
        "title": "Load times of images",
        "desc": "Placeholder of workspaces is loading slow.",
        "color": "#a30b0b",
        "_id": 2
    },
    {
        "title": "Mobile version",
        "desc": "Fix workspace title and workspaceNav collapse to each other",
        "color": "",
        "_id": 3
    },
    {
        "title": "Card color",
        "desc": "If card color 'None' selected, currentColor is applied to cardColor",
        "color": "#a30b0b",
        "_id": 4
    }]
},
{
    title: "Do Later",
    id: "2",
    cards: [{
        "title": "Database",
        "tag": {
            "title": "Important"
        },
        "desc": "Merge database from Firebase to MongoDB.",
        "color": "#10AC63",
        "_id": 1
    },
    {
        "title": "Cards",
        "desc": "Editing a card now will show create and update time of that card on 'card details' section.",
        "color": "#10AC63",
        "_id": 2
    },
    {
        "title": "Cards",
        "desc": "While adding and editing a card, description field is now a textarea instead of text input. Now you can enter longer descriptions!",
        "color": "#10AC63",
        "_id": 3
    },
    {
        "title": "Placeholders",
        "desc": "Empty workspace and empty home now show 'add workspace' placeholder with image instead of showing blank space.",
        "color": "#10AC63",
        "_id": 4
    }]
},
{
    title: "Done",
    id: "3",
    cards: [{
        "title": "Card title breaks if too long",
        "desc": "Card title was breaking if title was too long, but its fixed.",
        "color": "#10AC63",
        "checked": "true",
        "id": 1
    }]
}
];

export const Workspaces = [
    { title: "Notal Roadmap", workspaceVisible: true, _id: "61fe5d1e999f4cd55e0f3de0", deleteAble: false, starred: false },
    { title: "My first workspace.", desc: "About penguins!", _id: "2", deleteAble: true, starred: false },
    { title: "My second workspace.", desc: "Lorem ipsum dolor amet.", _id: "3", workspaceVisible: true, deleteAble: true, starred: false }
]

export const HomeRoutes = [{
    id: "workspaces",
    name: "Workspaces",
    icon: {
        default: <DashboardOutlineIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />,
        selected: <DashboardFilledIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />
    },
    Component: ({ props, isValidating }) => <HomeNavWorkspaces {...props} isValidating={isValidating} />
},
{
    id: "bookmarks",
    name: "Bookmarks",
    icon: {
        default: <BookmarkOutlineIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />,
        selected: <BookmarkFilledIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />
    },
    Component: (props) => <HomeNavBookmarks {...props} />
}]

export const WorkspaceButtons = [
    {
        id: "favorite",
        multi: true,
        name: {
            true: "Add to favorites",
            false: "Remove from favorites"
        },
        icon: {
            true: <StarFilledIcon size={24} className="fill-yellow-500" />,
            false: <StarOutlineIcon size={24} className="fill-neutral-900 dark:fill-white" />
        }
    },
    {
        id: "settings",
        name: "Settings",
        icon: <SettingsIcon size={24} color="currentColor" />
    },
    {
        id: "visible",
        multi: true,
        name: {
            true: "Set visiblity to private",
            false: "Set visibility to public",
        },
        icon: {
            true: <VisibleIcon width={20} height={20} className="dark:text-white text-black" />,
            false: <VisibleOffIcon width={20} height={20} className="dark:text-white text-black" />
        }
    },
    {
        id: "delete",
        name: "Delete workspace",
        icon: <DeleteIcon size={24} color="currentColor" />,
    },
    {
        id: "addfield",
        name: "Add field to workspace",
        icon: <AddIcon size={24} color="currentColor" />
    }
]