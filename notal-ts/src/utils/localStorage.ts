import { isClient } from "@utils/isClient";
import { CONSTANTS } from "@constants";

interface DefaultSettingsTypes {
  cookies: boolean;
  installedVersion: string;
  installedEnv: string;
  navbarCollapsed: boolean;
}

const DefaultSettings: DefaultSettingsTypes = {
  cookies: false,
  installedVersion: CONSTANTS.APP_VERSION || "",
  installedEnv: process.env.NODE_ENV,
  navbarCollapsed: false,
};

export const LocalSettings: {
  get: (key: string) => any | undefined;
  set: (key: string, value: any) => void;
} = {
  get: function (key: string) {
    if (!isClient()) return undefined;
    const Local = localStorage.getItem("settings");
    if (typeof Local == "undefined" || !Local) {
      // set defaults if not exist
      localStorage.setItem("settings", JSON.stringify(DefaultSettings));
      return DefaultSettings[key as keyof DefaultSettingsTypes]; // return default data
    } else {
      try {
        const LocalItem = JSON.parse(Local);
        if (typeof LocalItem[key] == "undefined") {
          localStorage.setItem("settings", JSON.stringify(DefaultSettings));
          return DefaultSettings[key as keyof DefaultSettingsTypes];
        }
        return LocalItem[key];
      } catch (error) {
        localStorage.setItem("settings", JSON.stringify(DefaultSettings));
        return DefaultSettings[key as keyof DefaultSettingsTypes];
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
