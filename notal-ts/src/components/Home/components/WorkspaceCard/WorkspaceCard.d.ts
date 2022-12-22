import type { WorkspaceTypes } from "@types";

export interface HomeWorkspaceCardProps {
  workspace?: WorkspaceTypes;
  onStar?: () => void;
  onDelete?: () => void;
  skeleton?: boolean;
  preview?: boolean;
  index?: number;
}
