import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { SWRResponse } from "swr";

import { useAuth, useNotalUI } from "@hooks";
import { WorkspaceService } from "@services";
import { Log } from "@utils";
import type { WorkspaceDataReturnType } from "@utils/api/workspaceData";

export interface WorkspaceContextProps {
  workspace: SWRResponse<WorkspaceDataReturnType>;
  setWorkspace: Dispatch<
    SetStateAction<SWRResponse<WorkspaceDataReturnType> | null>
  >;
  workspaceNotFound: boolean;
  isWorkspaceOwner: boolean;
  workspaceLoading: boolean;
  starWorkspace: () => Promise<void>;
  visibilityChange: () => Promise<void>;
  deleteWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextProps>(
  {} as WorkspaceContextProps
);

export default function useWorkspace() {
  return useContext(WorkspaceContext);
}

export function WorkspaceProvider(props: PropsWithChildren) {
  const auth = useAuth();
  const NotalUI = useNotalUI();

  const [workspaceNotFound, setWorkspaceNotFound] = useState(false);
  const [isWorkspaceOwner, setIsWorkspaceOwner] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspace, setWorkspace] =
    useState<WorkspaceContextProps["workspace"]>();

  useEffect(() => {
    if (!workspace) return;

    const notFound =
      (workspace?.data?.data?.workspaceVisible == false &&
        !auth?.validatedUser) ||
      workspace?.data?.error == "not-found" ||
      workspace?.data?.error == "invalid-params" ||
      workspace?.data?.error == "user-workspace-private" ||
      workspace?.data?.success != true;

    setWorkspaceNotFound(notFound);

    if (!notFound) {
      const isOwner =
        workspace?.data?.data?.owner?.uid == auth?.validatedUser?.uid;

      setIsWorkspaceOwner(isOwner);
    }

    if (workspace?.data) Log.debug("workspace", workspace.data);

    if (workspace?.data?.success) {
      setWorkspaceLoading(false);
    } else {
      setWorkspaceLoading(workspace.isValidating);
    }
  }, [workspace]);

  async function starWorkspace() {
    if (!workspace?.data?.data) return;
    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          starred: !workspace.data.data.starred,
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.star(
      workspace?.data?.data?._id ?? ""
    );
    Log.debug("starData:", data);
    if (data?.success) {
      window.gtag("event", "starWorkspace", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
      });
      workspace?.mutate();
    }
  }

  async function visibilityChange() {
    if (!workspace?.data?.data) return;
    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          workspaceVisible: !workspace.data.data.workspaceVisible,
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.toggleVisibility(
      workspace?.data?.data?._id ?? ""
    );
    Log.debug("toggleVisibility data:", data);
    if (data?.success) {
      window.gtag("event", "toggleVisibility", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
      });
      workspace?.mutate();
    }
  }

  async function deleteWorkspace() {
    if (!workspace?.data?.data) return;
    workspace?.mutate(
      {
        ...workspace.data,
        data: {
          ...workspace.data.data,
          workspaceVisible: !workspace.data.data.workspaceVisible,
        },
      },
      false
    );

    const data = await WorkspaceService.workspace.delete(
      workspace?.data?.data?._id ?? ""
    );
    Log.debug("deleteWorkspace data:", data);
    if (data?.success) {
      window.gtag("event", "deleteWorkspace", {
        login: auth?.validatedUser?.email,
        workspaceId: workspace?.data?.data?._id,
      });
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
      });
      workspace?.mutate();
    }
  }

  const value = {
    workspace,
    setWorkspace,
    workspaceNotFound,
    workspaceLoading,
    isWorkspaceOwner,
    starWorkspace,
    deleteWorkspace,
    visibilityChange,
  } as WorkspaceContextProps;

  return <WorkspaceContext.Provider value={value} {...props} />;
}
