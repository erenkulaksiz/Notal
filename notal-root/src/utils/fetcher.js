import { server } from "config";

export const fetchWorkspaces = ({ token, uid }) => fetch(`${server}/api/workspace`, {
    'Content-Type': 'application/json',
    method: "POST",
    headers: { 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ uid, action: "GET_WORKSPACES" }),
}).then(response => response.json());

export const fetchValidate = ({ url, token }) => fetch(`${server}/${url}`, {
    'Content-Type': 'application/json',
    method: "POST",
    body: JSON.stringify({ token }),
})
    .then(response => response.json())
    .catch(error => {
        return { success: false, error: { code: "validation-error", errorMessage: error } }
    });

export const fetchWorkspace = ({ token, id }) => fetch(`${server}/api/workspace`, {
    'Content-Type': 'application/json',
    method: "POST",
    headers: { 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ id, action: "GET_WORKSPACE" }),
}).then(response => response.json());