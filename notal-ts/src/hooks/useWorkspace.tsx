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

import type { WorkspaceDataReturnType } from "@utils/api/workspaceData";
import useAuth from "./useAuth";
import { Log } from "@utils";

export interface WorkspaceContextProps {
  workspace?: SWRResponse<WorkspaceDataReturnType>;
  setWorkspace: Dispatch<
    SetStateAction<SWRResponse<WorkspaceDataReturnType> | null>
  >;
  workspaceNotFound: boolean;
  isWorkspaceOwner: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextProps>(
  {} as WorkspaceContextProps
);

export default function useWorkspace() {
  return useContext(WorkspaceContext);
}

export function WorkspaceProvider(props: PropsWithChildren) {
  const auth = useAuth();

  const [workspaceNotFound, setWorkspaceNotFound] = useState(false);
  const [isWorkspaceOwner, setIsWorkspaceOwner] = useState(false);
  const [workspace, setWorkspace] =
    useState<WorkspaceContextProps["workspace"]>();

  useEffect(() => {
    const notFound =
      (workspace?.data?.data?.workspaceVisible == false &&
        !auth?.validatedUser) ||
      workspace?.data?.error == "not-found" ||
      workspace?.data?.error == "invalid-params" ||
      workspace?.data?.error == "user-workspace-private" ||
      workspace?.data?.success != true;

    setWorkspaceNotFound(notFound);

    if (!notFound) {
      const isOwner = workspace?.data?.data?.owner == auth?.validatedUser?.uid;

      setIsWorkspaceOwner(isOwner);
    }
  }, [workspace]);

  const value = {
    workspace,
    setWorkspace,
    workspaceNotFound,
    isWorkspaceOwner,
  } as WorkspaceContextProps;

  return <WorkspaceContext.Provider value={value} {...props} />;
}
