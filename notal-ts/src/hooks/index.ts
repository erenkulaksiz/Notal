import type { AuthContextProps } from "@hooks/useAuth";
import type { NotalUIContextProps } from "@hooks/useNotalUI";
import type { WorkspaceContextProps } from "@hooks/useWorkspace";

export function getFunctionsWithHooks({
  auth,
  NotalUI,
  workspace,
}: {
  auth: AuthContextProps | null;
  NotalUI: NotalUIContextProps;
  workspace: WorkspaceContextProps;
}) {}

export { default as useNotalUI } from "./useNotalUI";
export { default as useAuth } from "./useAuth";
export { default as useWorkspaces } from "./useWorkspaces";
export { default as useWorkspace } from "./useWorkspace";

export { AuthProvider } from "./useAuth";
export { WorkspaceProvider } from "./useWorkspace";
export { NotalUIProvider } from "./useNotalUI";
