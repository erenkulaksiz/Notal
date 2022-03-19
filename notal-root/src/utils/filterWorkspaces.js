// Function to filter workspaces and return filtered data.
// @param {array} workspaces
// @param {string} filter 
export const FilterWorkspaces = ({ workspaces, filter }) => {

    if (!workspaces) return []

    const filterObj = {
        favorites: workspaces.filter(el => { return el.starred == true }),
        privateWorkspaces: workspaces.filter(el => { return !!el?.workspaceVisible == false }),
        createdAt: workspaces.sort((a, b) => { return a?.createdAt - b?.createdAt }),
        updatedAt: workspaces.sort((a, b) => { return b?.updatedAt - a?.updatedAt }),
    }

    if (!filterObj[filter]) return workspaces // Return default
    return filterObj[filter]
}

export const FILTER_MAP = {
    all: () => true,
    favorites: el => el.starred,
    privateWorkspaces: el => !!el?.workspaceVisible == false,
    createdAt: (a, b) => a?.createdAt - b?.createdAt,
    updatedAt: (a, b) => a?.updatedAt - b?.updatedAt,
}