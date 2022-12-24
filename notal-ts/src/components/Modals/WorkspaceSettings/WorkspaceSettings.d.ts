import type { WorkspaceTypes } from "@types";

export interface WorkspaceSettingsProps {
  open: boolean;
  workspace?: WorkspaceTypes;
  onClose: () => void;
  onWorkspaceUpdate?: (workspace: WorkspaceTypes) => void;
}
