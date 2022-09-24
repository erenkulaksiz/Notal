import { useTheme } from "next-themes";

import { Tooltip, Switch } from "@components";
import { LightIcon, DarkIcon } from "@icons";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Tooltip
      content={resolvedTheme === "dark" ? "Light Theme" : "Dark Theme"}
      direction="bottom"
      outline
    >
      <Switch
        onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        value={resolvedTheme == "dark"}
        icon={
          resolvedTheme == "dark" ? (
            <LightIcon
              size={24}
              fill="black"
              style={{ transform: "scale(0.7)" }}
            />
          ) : (
            <DarkIcon
              size={24}
              fill="black"
              style={{ transform: "scale(0.7)" }}
            />
          )
        }
        role="switch"
        id="changeTheme"
      />
    </Tooltip>
  );
}
