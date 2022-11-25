import { WorkspaceTypes } from "@types";

import { CONSTANTS } from ".";

export const WorkspaceDefaults: WorkspaceTypes = {
  _id: "workspace-default",
  id: "workspace-default",
  owner: {
    uid: "preview",
    username: "",
    fullname: "",
    avatar: "",
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
  title: "",
  desc: "",
  starred: false,
  workspaceVisible: false,
  thumbnail: {
    type: CONSTANTS.DEFAULT_WORKSPACE_THUMBNAIL_TYPE,
    file: CONSTANTS.MICHAEL,
    color: CONSTANTS.DEFAULT_WORKSPACE_THUMBNAIL_COLOR,
    colors: {
      start: CONSTANTS.DEFAULT_WORKSPACE_THUMBNAIL_GRADIENT.start,
      end: CONSTANTS.DEFAULT_WORKSPACE_THUMBNAIL_GRADIENT.end,
    },
  },
};
