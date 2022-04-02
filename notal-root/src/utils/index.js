import { InfoIcon } from "@icons";
import Cookie from "js-cookie";
import { server } from '../config';

/**
 * Get whether render is on clientside or serverside.
 */
export const isClient = (typeof window === 'undefined') ? false : true;

export const CheckToken = async ({ token, props, user }) => {
    //console.log("jwtyi kontrol edicem bi canım");
    console.log("Checking token, " + (token ? "token exist" : "token doesnt exist") + " val: ", props.validate, " userVal: ", user)
    if (props.validate?.error == "auth/id-token-expired"
        || props.validate?.error == "auth/argument-error"
        || props.validate?.error == "validation-error"
        || (props.validate?.error == "no-token" && user)
    ) {
        await Cookie.set("auth", token, { expires: 1 });
        console.log("Have to reload!");
        return false;
    } else {
        if (!props.validate?.error) {
            return true;
        }
        return false;
    }
};

export const ValidateToken = async ({ token }) => {
    if (!token) {
        return { error: "no-token", success: false }
    }

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
    console.log("err validate token:", data);
    return { error: data.error.code ? data.error.code : data.error, success: false }
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

export const WorkboxInit = (NotalUI) => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
        const wb = window.workbox
        // add event listeners to handle any of PWA lifecycle event
        // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
        wb.addEventListener('installed', event => {
            console.log(`Event ${event.type} is triggered.`)
            console.log(event)
        })

        wb.addEventListener('controlling', event => {
            console.log(`Event ${event.type} is triggered.`)
            console.log(event)
        })

        wb.addEventListener('activated', event => {
            console.log(`Event ${event.type} is triggered.`)
            console.log(event)
        })

        // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
        // NOTE: MUST set skipWaiting to false in next.config.js pwa object
        // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
        const promptNewVersionAvailable = event => {
            // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
            // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
            // You may want to customize the UI prompt accordingly.
            wb.addEventListener('controlling', event => {
                window.location.reload()
            });
            wb.messageSkipWaiting();

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
                                router.reload();
                                NotalUI.Toast.close(index);
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
        /*
        if (confirm('A newer version of Notal is available, reload to update?')) {
            
            wb.addEventListener('controlling', event => {
                window.location.reload()
            })

            // Send a message to the waiting service worker, instructing it to activate.
            wb.messageSkipWaiting()
            
        } else {
            console.log(
                'User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.'
            )
        }
        */
    }

    wb.addEventListener('waiting', promptNewVersionAvailable)

    // ISSUE - this is not working as expected, why?
    // I could only make message event listenser work when I manually add this listenser into sw.js file
    wb.addEventListener('message', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
    })

    /*
    wb.addEventListener('redundant', event => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })
    wb.addEventListener('externalinstalled', event => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })
    wb.addEventListener('externalactivated', event => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })
    */

    // never forget to call register as auto register is turned off in next.config.js
    wb.register()
}
