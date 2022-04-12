import { isClient } from "@utils";

const DefaultSettings = {
    cookies: false,
    homeNavCollapsed: false,
    navbarCollapsed: false,
}

const LocalSettings = {
    get: (item) => {
        if (!isClient) return undefined;
        const Local = localStorage.getItem("settings");
        if (typeof Local == "undefined" || !Local) { // set defaults if not exist
            localStorage.setItem("settings", JSON.stringify(DefaultSettings));
        }
        if (typeof DefaultSettings[item] != "undefined") { // check for valid setting
            const LocalItem = JSON.parse(Local);
            return LocalItem[item];
        }
        return false;
    },
    set: (key, value) => {
        if (!isClient) return undefined;
        const Local = localStorage.getItem("settings");
        if (typeof Local == "undefined" || !Local) { // set defaults if not exist
            localStorage.setItem("settings", JSON.stringify(DefaultSettings));
        }
        // After applying defaults
        const NewLocal = JSON.parse(Local);
        NewLocal[key] = value;
        localStorage.setItem("settings", JSON.stringify(NewLocal));
    }
}

export default LocalSettings;