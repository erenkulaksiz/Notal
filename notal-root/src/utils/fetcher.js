import { server } from "config";

export const fetchWorkspaces = (url, token, id) => fetch(`${server}/${url}`, {
    'Content-Type': 'application/json',
    method: "POST",
    headers: { 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ id, action: "GET_WORKSPACES" }),
}).then(response => response.json());

export const fetchValidate = (url, token) => fetch(`${server}/${url}`, {
    'Content-Type': 'application/json',
    method: "POST",
    body: JSON.stringify({ token }),
})
    .then(response => response.json())
    .catch(error => {
        return { success: false, error: { code: "validation-error", errorMessage: error } }
    });