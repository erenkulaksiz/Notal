import { server } from "../config";

export const fetchWorkspaces = ({ token, uid }) => fetch(`${server}/api/workspace/getworkspaces`, {
    'Content-Type': 'application/json',
    method: "POST",
    headers: { 'Authorization': `Bearer ${token || ""}` },
    body: JSON.stringify({ uid }),
})
    .then(response => {
        try {
            return response.json();
        } catch (error) {
            return { success: false, error }
        }
    }).catch(error => {
        return { success: false, error }
    });

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

export const fetchWorkspace = ({ token, id, uid }) => fetch(`${server}/api/workspace/getworkspace`, {
    'Content-Type': 'application/json',
    method: "POST",
    headers: { 'Authorization': `Bearer ${token || ""}` },
    body: JSON.stringify({ uid, id }),
})
    .then(response => {
        try {
            return response.json();
        } catch (error) {
            return { success: false, error }
        }
    }).catch(error => {
        return { success: false, error }
    });