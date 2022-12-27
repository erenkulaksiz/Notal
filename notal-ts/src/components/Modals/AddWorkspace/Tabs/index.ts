import { WorkspaceTab } from "./Workspace";
import { ThumbnailTab } from "./Thumbnail";
import { UsersTab } from "./Users";
import type { OwnerTypes, WorkspaceReducer } from "@types";
import { WorkspaceAction } from "../AddWorkspace.d";
import { Dispatch } from "react";

interface TabProps {
  state: WorkspaceReducer;
  dispatch: Dispatch<WorkspaceAction>;
}

export interface WorkspaceTabProps extends TabProps {
  newWorkspaceErr: {
    title: string | boolean;
    desc: string | boolean;
  };
  submit: () => void;
}

export interface ThumbnailTabProps extends TabProps {
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  thumbnailRef: React.RefObject<HTMLInputElement>;
}

export interface UsersTabProps extends TabProps {
  addUserToWorkspace: () => void;
  removeUserFromWorkspace: (user: OwnerTypes) => void;
}

const Tabs = {
  Workspace: WorkspaceTab,
  Thumbnail: ThumbnailTab,
  Users: UsersTab,
};

export default Tabs;
