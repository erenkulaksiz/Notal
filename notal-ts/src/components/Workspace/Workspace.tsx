import {
  WorkspaceNotFound,
  WorkspaceSidebar,
  LoadingOverlay,
} from "@components";
import { useAuth, useWorkspace } from "@hooks";

export function Workspace() {
  const auth = useAuth();
  const { workspaceLoading, notFound } = useWorkspace();

  if (workspaceLoading || auth?.authLoading) return <LoadingOverlay />;

  return notFound ? (
    <WorkspaceNotFound />
  ) : (
    <div className="flex flex-1 flex-row">
      <WorkspaceSidebar />
    </div>
  );
}
