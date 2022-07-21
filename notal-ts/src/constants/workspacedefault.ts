import { WorkspaceTypes } from "@types";
import { michael } from "./michael";
export const WorkspaceDefaults: WorkspaceTypes = {
  _id: "workspace-default",
  id: "workspace-default",
  owner: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  title: "Untitled",
  desc: "",
  starred: false,
  workspaceVisible: false,
  thumbnail: {
    type: "gradient",
    file: michael,
    color: "#666666",
    colors: { start: "#0eeaed", end: "#00575e" },
  },
};
