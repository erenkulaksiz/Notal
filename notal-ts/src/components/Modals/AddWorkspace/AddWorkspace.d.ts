import { WorkspaceTypes } from "@types";
import { ReactNode } from "react";

export interface AddWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (workspace: WorkspaceTypes) => void;
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
}

export interface WorkspaceAction {
  type: AddWorkspaceActionType;
  payload: any;
}