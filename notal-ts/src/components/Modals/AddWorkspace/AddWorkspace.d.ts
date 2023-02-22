import { WorkspaceReducer, WorkspaceTypes } from "@types";
import { ReactNode } from "react";

export interface AddWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (workspace: WorkspaceTypes | WorkspaceReducer) => void;
  onEdit?: (workspace: WorkspaceReducer) => void;
  editing?: boolean; // Edit mode
  editWorkspace?: WorkspaceTypes; // Workspace to edit
  defaultTab?: number;
}

export enum AddWorkspaceActionType {
  SET_TITLE = "SET_TITLE",
  SET_DESC = "SET_DESC",
  SET_WORKSPACE = "SET_WORKSPACE",
  SET_THUMBNAIL = "SET_THUMBNAIL",
  SET_STARRED = "SET_STARRED",
  SET_VISIBLE = "SET_VISIBLE",
  SET_THUMB_TYPE = "SET_THUMB_TYPE",
  SET_THUMB_COLOR = "SET_THUMB_COLOR",
  SET_THUMB_GRADIENT_COLORS = "SET_THUMB_GRADIENT_COLORS",
  SET_WORKSPACE_TEAM_USERNAME = "SET_WORKSPACE_TEAM_USERNAME",
  SET_THUMB_LOADING = "SET_THUMB_LOADING",
  SET_ADD_USER_LOADING = "SET_ADD_USER_LOADING",
  SET_ALL_LOADING = "SET_ALL_LOADING",
  ADD_USER = "ADD_USER",
  RESET_USERS = "RESET_USERS",
  REMOVE_USER = "REMOVE_USER",
  SET_LINK_COPIED = "SET_LINK_COPIED",
}

export interface WorkspaceAction {
  type: AddWorkspaceActionType;
  payload?: any;
}
