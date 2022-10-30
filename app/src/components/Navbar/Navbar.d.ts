import { NotalRootProps } from "@types/";

export interface NavbarProps {
  user?: object;
  showHomeButton?: boolean;
  showCollapse?: boolean;
  workspace?: NotalRootProps["workspace"];
}
