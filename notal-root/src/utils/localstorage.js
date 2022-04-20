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
            return DefaultSettings; // return default data
        }
        try {
            const LocalItem = JSON.parse(Local);
            if (typeof LocalItem[item] == "undefined" && item != "DEBUG_LOG") {
                localStorage.setItem("settings", JSON.stringify(DefaultSettings));
                return DefaultSettings;
            }
            return LocalItem[item];
        } catch (error) {
            localStorage.setItem("settings", JSON.stringify(DefaultSettings));
            return DefaultSettings;
        }
    },
    set: (key, value) => {
        if (!isClient) return undefined;
        const Local = localStorage.getItem("settings");
        if (typeof Local == "undefined" || !Local) { // set defaults if not exist
            localStorage.setItem("settings", JSON.stringify(DefaultSettings));
        }
        // After applying defaults
        try {
            const NewLocal = JSON.parse(Local);
            NewLocal[key] = value;
            localStorage.setItem("settings", JSON.stringify(NewLocal));
        } catch (error) {
            localStorage.setItem("settings", JSON.stringify(DefaultSettings));
        }
    }
}

export default LocalSettings;