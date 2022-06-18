import { InfoIcon } from "@icons";
import Cookie from "js-cookie";
import { server } from '../config';
import { Button } from "@components";
import Log from "./logger";

/**
 * Get whether render is on clientside or serverside.
 */
export const isClient = (typeof window === 'undefined') ? false : true;

export const formatString = (str) => str.replace(/[^\w\s]/gi, "").replace(/\s/g, '');

export const formatDate = (date) => {
    return `${new Date(date).getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(date).getMonth()]}, ${new Date(date).getFullYear()} ${new Date(date).getHours().toString().padStart(2, '0')}:${new Date(date).getMinutes().toString().padStart(2, '0')}`;
}

export const CheckToken = async ({ token, props, user }) => {
    //Log.debug("jwtyi kontrol edicem bi canım");
    Log.debug("Checking token, " + (token ? "token exist" : "token doesnt exist") + " val: ", props.validate, " userVal: ", user)
    if (props.validate?.error == "auth/id-token-expired"
        || props.validate?.error == "auth/argument-error"
        || props.validate?.error == "validation-error"
        || (props.validate?.error == "no-token" && user)
    ) {
        await Cookie.set("auth", token);
        Log.debug("Have to reload! checkToken");
        return false;
    } else {
        if (!props.validate?.error) {
            return true;
        }
        return false;
    }
};

/**
 * Auth elleyicisi
 * 
 * @param {string} token
 * @returns {object} { success:boolean, error: object, data:object }
 */
export const ValidateToken = async ({ token }) => {
    if (!token) return { error: "no-token", success: false }

    Log.debug("Validating token length: ", token.length);

    const data = await fetch(`${server}/api/validate`, {
        'Content-Type': 'application/json',
        method: "POST",
        body: JSON.stringify({ token }),
    })
        .then(response => response.json())
        .catch(error => {
            return { success: false, error: { code: "validation-error", errorMessage: error } }
        });

    if (data.success) {
        return { ...data };
    }
    Log.debug("err validate token:", data);
    return { error: data.error.code ? data.error.code : data.error, success: false }
}

export const GetWorkspace = async ({ id, token }) => {
    const data = await fetch(`${server}/api/workspace`, {
        'Content-Type': 'application/json',
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, action: "GET_WORKSPACE" }),
    }).then(response => response.json());

    if (data.success) {
        return { ...data, data: data.data };
    }
    return { success: false, error: data.error }
}

export const GetWorkspaceData = async ({ id, token }) => {
    const data = await fetch(`${server}/api/workspace/getworkspacedata`, {
        'Content-Type': 'application/json',
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id }),
    }).then(response => response.json());

    if (data.success) {
        return { success: true, ...data };
    }
    return { success: false, error: data.error }
}

export const GetWorkspaces = async ({ uid, token }) => {
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

export const WorkboxInit = (NotalUI, router) => {

    if (!isClient) return;

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
        const wb = window.workbox
        wb.__WB_DISABLE_DEV_LOGS = true;
        // add event listeners to handle any of PWA lifecycle event
        // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
        wb.addEventListener('installed', event => {
            Log.debug(`Event ${event.type} is triggered.`)
            Log.debug(event)
        })

        wb.addEventListener('controlling', event => {
            Log.debug(`Event ${event.type} is triggered.`)
            Log.debug(event)
        })

        wb.addEventListener('activated', event => {
            Log.debug(`Event ${event.type} is triggered.`)
            Log.debug(event)
        })

        // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
        // NOTE: MUST set skipWaiting to false in next.config.js pwa object
        // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
        const promptNewVersionAvailable = event => {
            // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
            // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
            // You may want to customize the UI prompt accordingly.
            if (event.wasWaitingBeforeRegister) {
                NotalUI.Toast.show({
                    title: "An update is available",
                    desc: "A new version of Notal is available. Refresh to use latest version.",
                    icon: <InfoIcon size={24} fill="currentColor" />,
                    className: "dark:bg-yellow-600 bg-yellow-500 text-white",
                    timeEnabled: false,
                    buttons: (index) => {
                        return [
                            <Button
                                className="p-1 px-2 rounded hover:opacity-70"
                                onClick={() => {
                                    NotalUI.Toast.close(index);
                                    /*
                                    */
                                    wb.addEventListener('controlling', event => {
                                        window.location.reload()
                                    });
                                    wb.messageSkipWaiting();
                                }}
                                size="sm"
                                light
                            >
                                Refresh
                            </Button>,
                        ]
                    },
                    showClose: true,
                })
            }
        }
        /*
        if (confirm('A newer version of Notal is available, reload to update?')) {
            
            wb.addEventListener('controlling', event => {
                window.location.reload()
            })

            // Send a message to the waiting service worker, instructing it to activate.
            wb.messageSkipWaiting()
            
        } else {
            Log.debug(
                'User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.'
            )
        }
        */

        wb.addEventListener('waiting', promptNewVersionAvailable)

        // ISSUE - this is not working as expected, why?
        // I could only make message event listenser work when I manually add this listenser into sw.js file
        wb.addEventListener('message', event => {
            Log.debug(`Event ${event.type} is triggered.`)
            Log.debug(event)
        })

        /*
        wb.addEventListener('redundant', event => {
          Log.debug(`Event ${event.type} is triggered.`)
          Log.debug(event)
        })
        wb.addEventListener('externalinstalled', event => {
          Log.debug(`Event ${event.type} is triggered.`)
          Log.debug(event)
        })
        wb.addEventListener('externalactivated', event => {
          Log.debug(`Event ${event.type} is triggered.`)
          Log.debug(event)
        })
        */

        // never forget to call register as auto register is turned off in next.config.js
        wb.register()
    }
}