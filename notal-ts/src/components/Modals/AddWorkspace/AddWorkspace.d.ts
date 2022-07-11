import { WorkspaceTypes } from "@types";
import { ReactNode } from "react";

export interface AddWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (workspace: WorkspaceTypes) => void;
}
