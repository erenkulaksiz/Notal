
export const FilterWorkspaces = ({ workspaces, filter }) => {
    switch (filter) {
        case "favorites":
            if (workspaces) return workspaces.filter(el => el.starred == true);
            else return []
            break;
        case "privateWorkspaces":
            if (workspaces) return workspaces.filter(el => !!el?.workspaceVisible == false);
            else return []
            break;
        case "createdAt":
            if (workspaces) return workspaces?.sort((a, b) => { return a?.createdAt - b?.createdAt });
            else return []
            break;
        case "updatedAt":
            if (workspaces) return workspaces?.sort((a, b) => { return b?.updatedAt - a?.updatedAt });
            else return []
            break;
        default:
            if (workspaces) return workspaces?.sort((a, b) => { return a?.createdAt - b?.createdAt });
            else return []
            break;
    }
}