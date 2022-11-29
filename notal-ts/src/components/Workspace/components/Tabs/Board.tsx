import dynamic from "next/dynamic";
import { Droppable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { useTheme } from "next-themes";

import { WorkspaceSidebar } from "@components";
import { useWorkspace } from "@hooks";
import type { WorkspaceFieldProps } from "../WorkspaceField/WorkspaceField";

const WorkspaceField = dynamic<WorkspaceFieldProps>(() =>
  import("../WorkspaceField/WorkspaceField").then((mod) => mod.WorkspaceField)
);

export default function Board() {
  const workspace = useWorkspace();
  const { resolvedTheme } = useTheme();

  return (
    <>
      {workspace.isWorkspaceOwner && <WorkspaceSidebar />}
      <Droppable droppableId="BOARD" type="BOARD" direction="horizontal">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            className="flex flex-row w-full h-full pl-1"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {Array.isArray(workspace.workspace?.data?.data?.fields) &&
              workspace.workspace?.data?.data?.fields.length == 0 && (
                <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                  {resolvedTheme == "light" ? (
                    <img
                      src="/empty_state_workspace_light.png"
                      className="object-contain w-[200px]"
                    />
                  ) : (
                    <img
                      src="/empty_state_workspace_dark.png"
                      className="object-contain w-[200px]"
                    />
                  )}
                  <span>This workspace is empty :(</span>
                </div>
              )}
            {Array.isArray(workspace.workspace?.data?.data?.fields) &&
              workspace.workspace?.data?.data?.fields.map(
                (field, index: number) => (
                  <WorkspaceField field={field} key={field._id} index={index} />
                )
              )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}
