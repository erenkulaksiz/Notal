import { WorkspaceAction, AddWorkspaceActionType } from "./AddWorkspace.d";
import { WorkspaceTypes } from "@types";

export function reducer(
  state: WorkspaceTypes,
  action: WorkspaceAction
): WorkspaceTypes {
  switch (action.type) {
    case AddWorkspaceActionType.SET_TITLE:
      return { ...state, title: action.payload };

    case AddWorkspaceActionType.SET_DESC:
      return { ...state, desc: action.payload };

    case AddWorkspaceActionType.SET_THUMBNAIL:
      return { ...state, ...action.payload };

    case AddWorkspaceActionType.SET_WORKSPACE:
      return { ...state, ...action.payload };

    case AddWorkspaceActionType.SET_STARRED:
      return { ...state, starred: action.payload };

    case AddWorkspaceActionType.SET_VISIBLE:
      return { ...state, workspaceVisible: action.payload };

    case AddWorkspaceActionType.SET_THUMB_TYPE:
      return {
        ...state,
        thumbnail: { ...state.thumbnail, type: action.payload },
      };

    case AddWorkspaceActionType.SET_THUMB_COLOR:
      return {
        ...state,
        thumbnail: {
          ...state.thumbnail,
          color: action.payload,
        },
      };

    case AddWorkspaceActionType.SET_THUMB_GRADIENT_COLORS:
      return {
        ...state,
        thumbnail: {
          ...state.thumbnail,
          colors: {
            ...state.thumbnail.colors,
            ...action.payload,
          },
        },
      };

    default:
      return state;
  }
}
