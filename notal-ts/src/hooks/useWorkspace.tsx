import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { NotalRootProps, WorkspaceTypes } from "@types";
import { Log } from "@utils/logger";
import useAuth from "./useAuth";

export interface NotalWorkspaceContextProps {
  setWorkspaceData: (
    workspace: NotalRootProps["workspace"] | undefined
  ) => void;
  setWorkspaceLoading: (loading: boolean) => void;
  workspaceData: NotalRootProps["workspace"] | undefined;
  workspaceLoading: boolean;
  notFound: boolean;
  isOwner: boolean;
}

const notalWorkspaceContext = createContext<NotalWorkspaceContextProps>(
  {} as NotalWorkspaceContextProps
);

export default function useWorkspace() {
  return useContext(notalWorkspaceContext);
}

export function NotalWorkspaceProvider(props: PropsWithChildren) {
  const auth = useAuth();
  const [workspaceData, setWorkspaceData] =
    useState<NotalRootProps["workspace"]>();
  const [workspaceLoading, setWorkspaceLoading] = useState<boolean>(true);

  const notFound =
    (workspaceData?.data?.workspaceVisible == false && !auth?.validatedUser) ||
    workspaceData?.error == "not-found" ||
    workspaceData?.error == "invalid-params" ||
    workspaceData?.error == "user-workspace-private" ||
    workspaceData?.success != true;

  const isOwner = workspaceData?.data
    ? workspaceData?.data?.owner?.uid == auth?.validatedUser?.uid
    : false;

  useEffect(() => {
    if (workspaceData) setWorkspaceLoading(false);
  }, [workspaceData]);

  const value = {
    setWorkspaceData,
    setWorkspaceLoading,
    workspaceData,
    workspaceLoading,
    notFound,
    isOwner,
  } as NotalWorkspaceContextProps;

  return <notalWorkspaceContext.Provider value={value} {...props} />;
}
