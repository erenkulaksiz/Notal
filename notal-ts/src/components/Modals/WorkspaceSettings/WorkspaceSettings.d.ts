import type { WorkspaceTypes } from "@types";

export interface WorkspaceSettingsProps {
  workspace: WorkspaceTypes;
  onClose: () => void;
  onWorkspaceUpdate: (workspace: WorkspaceTypes) => void;
}
