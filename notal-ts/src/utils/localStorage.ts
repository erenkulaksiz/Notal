import { isClient } from "@utils/isClient";

const DefaultSettings = {
  cookies: false,
  installedVersion: process.env.NEXT_PUBLIC_APP_VERSION,
  installedEnv: process.env.NODE_ENV,
};

export const LocalSettings = {
  get: function (item: string) {
    if (!isClient()) return undefined;
    const Local = localStorage.getItem("settings");
    if (typeof Local == "undefined" || !Local) {
      // set defaults if not exist
      localStorage.setItem("settings", JSON.stringify(DefaultSettings));
      return DefaultSettings; // return default data
    } else {
      try {
        const LocalItem = JSON.parse(Local);
        if (typeof LocalItem[item] == "undefined") {
          localStorage.setItem("settings", JSON.stringify(DefaultSettings));
          return DefaultSettings;
        }
        return LocalItem[item];
      } catch (error) {
        localStorage.setItem("settings", JSON.stringify(DefaultSettings));
        return DefaultSettings;
      }
    }
  },
  set: function (key: string, value: any) {
    if (!isClient()) return undefined;
    const Local = localStorage.getItem("settings");
    if (typeof Local == "undefined" || !Local) {
      // set defaults if not exist
      localStorage.setItem("settings", JSON.stringify(DefaultSettings));
    } else {
      // After applying defaults
      try {
        const NewLocal = JSON.parse(Local);
        NewLocal[key] = value;
        localStorage.setItem("settings", JSON.stringify(NewLocal));
      } catch (error) {
        localStorage.setItem("settings", JSON.stringify(DefaultSettings));
      }
    }
  },
};
