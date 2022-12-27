import { WorkspaceAction, AddWorkspaceActionType } from "./AddWorkspace.d";
import type { WorkspaceReducer } from "@types";

export function reducer(
  state: WorkspaceReducer,
  action: WorkspaceAction
): WorkspaceReducer {
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

    case AddWorkspaceActionType.SET_THUMB_LOADING:
      return { ...state, thumbnailLoading: action.payload };

    case AddWorkspaceActionType.SET_ADD_USER_LOADING:
      return { ...state, addUserLoading: action.payload };

    case AddWorkspaceActionType.SET_ALL_LOADING:
      return {
        ...state,
        thumbnailLoading: action.payload,
        addUserLoading: action.payload,
      };

    case AddWorkspaceActionType.SET_WORKSPACE_TEAM_USERNAME:
      return {
        ...state,
        team: {
          ...state.team,
          username: action.payload,
        },
      };

    case AddWorkspaceActionType.ADD_USER:
      const users = state.team?.users || [];
      return {
        ...state,
        team: {
          ...state.team,
          users: [...users, action.payload],
          username: "",
        },
        addUserLoading: false,
      };

    case AddWorkspaceActionType.RESET_USERS:
      return {
        ...state,
        team: {
          ...state.team,
          users: [],
        },
      };

    case AddWorkspaceActionType.REMOVE_USER:
      const newUsers = state.team?.users?.filter(
        (user) => user.username !== action.payload
      );
      return {
        ...state,
        team: {
          ...state.team,
          users: newUsers,
        },
      };

    case AddWorkspaceActionType.SET_LINK_COPIED:
      return { ...state, linkCopied: action.payload };

    default:
      return state;
  }
}
