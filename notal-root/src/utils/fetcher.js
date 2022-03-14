import { server } from "config";

export const fetchWorkspaces = ({ token, uid }) => fetch(`${server}/api/workspace`, {
    'Content-Type': 'application/json',
    method: "POST",
    headers: { 'Authorization': `Bearer ${token || ""}` },
    body: JSON.stringify({ uid, action: "GET_WORKSPACES" }),
})
    .then(response => {
        if (response.status >= 400 && response.status < 600) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .catch(error => { return { success: false, error: { code: "workspace_error", errorMessage: error } } });

/*
export const fetchValidate = ({ url, token }) => fetch(`${server}/${url}`, {
    'Content-Type': 'application/json',
    method: "POST",
    body: JSON.stringify({ token }),
})
    .then(response => response.json())
    .catch(error => {
        return { success: false, error: { code: "validation-error", errorMessage: error } }
    });
*/

export const fetchWorkspace = ({ token, id, uid }) => fetch(`${server}/api/workspace`, {
    'Content-Type': 'application/json',
    method: "POST",
    headers: { 'Authorization': `Bearer ${token || ""}` },
    body: JSON.stringify({ uid, action: "GET_WORKSPACE", id }),
})
    .then(response => response.json());