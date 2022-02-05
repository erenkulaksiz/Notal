import cookie from "js-cookie";
import { server } from '../config';

export const CheckToken = async ({ token, props }) => {
    //console.log("jwtyi kontrol edicem bi canım");
    //console.log("prsss", props.validate?.error);
    if (props.validate?.error == "auth/id-token-expired"
        || props.validate?.error == "auth/argument-error"
        || props.validate?.error == "validation-error") {
        try {
            //console.log("Checktoken !!! ", token.res);
            /*
            const dataValidate = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: token.res }),
            }).then(response => response.json()).catch(error => {
                return { success: false, ...error }
            });
            */
            //console.log("data validate: ", dataValidate);
            await cookie.set("auth", token.res, { expires: 1 });
            return false
        } catch (err) {
            console.error(err);
            //auth.users.logout();
            return true
        }
    } else {
        if (!props.validate?.error) {
            return true;
        }
        return false;
    }
};

export const ValidateToken = async ({ token }) => {
    if (!token) {
        return { error: "no-token" }
    }

    const data = await fetch(`${server}/api/validate`, {
        'Content-Type': 'application/json',
        method: "POST",
        body: JSON.stringify({ token }),
    })
        .then(response => response.json())
        .catch(error => {
            return { success: false, error: { code: "validation-error", errorMessage: error } }
        });;

    if (data.success) {
        return { ...data };
    }
    return { error: data?.error?.code }
}

export const GetWorkspace = async ({ id, token }) => {
    const data = await fetch(`${server}/api/workspace`, {
        'Content-Type': 'application/json',
        method: "POST",
        headers: { 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ id, action: "GET_WORKSPACE" }),
    }).then(response => response.json());

    if (data.success) {
        return { ...data, data: data.data };
    }
    return { success: false, error: data.error }
}

export const GetWorkspaces = async ({ uid, token }) => {
    if (!uid) {
        return { success: false }
    }

    const data = await fetch(`${server}/api/workspace`, {
        'Content-Type': 'application/json',
        method: "POST",
        headers: { 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ uid, action: "GET_WORKSPACES" }),
    }).then(response => response.json());

    if (data?.success) {
        if (data?.data) {
            return { data: data?.data, success: true };
        } else {
            return { success: true }
        }
    }
    return { success: false, error: data.error }
}

export const GetProfile = async ({ username, token }) => {
    if (token) {
        const data = await fetch(`${server}/api/profile/${username}`, {
            'Content-Type': 'application/json',
            method: "POST",
            headers: { 'Authorization': 'Bearer ' + token },
        }).then(response => response.json());
        return { ...data }
    } else {
        const data = await fetch(`${server}/api/profile/${username}`, {
            'Content-Type': 'application/json',
            method: "POST",
        }).then(response => response.json());
        return { ...data }
    }
}