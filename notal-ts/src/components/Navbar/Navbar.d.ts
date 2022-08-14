import { NotalRootProps } from "@types/";

export interface NavbarProps {
  user?: object;
  showHomeButton?: boolean;
  validating?: boolean;
  showCollapse?: boolean;
  workspace?: NotalRootProps["workspace"];
  workspaceLoading?: boolean;
}
