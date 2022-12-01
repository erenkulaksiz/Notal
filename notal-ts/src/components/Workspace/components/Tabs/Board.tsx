import dynamic from "next/dynamic";
import { Droppable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { useTheme } from "next-themes";

import { WorkspaceSidebar } from "@components";
import { useWorkspace } from "@hooks";
import AddFieldButton from "./AddFieldButton";
import type { WorkspaceFieldProps } from "../WorkspaceField/WorkspaceField";
import { LIMITS } from "@constants/limits";

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
            className="flex flex-row h-full pl-1"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {Array.isArray(workspace.workspace?.data?.data?.fields) &&
              workspace.workspace?.data?.data?.fields.length == 0 && (
                <div className="absolute top-0 bottom-0 right-0 left-0 flex z-0 flex-col gap-6 items-center justify-center">
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
            {workspace.isWorkspaceOwner &&
              workspace?.workspace?.data?.data?.fields.length <=
                LIMITS.MAX.WORKSPACE_FIELD_LENGTH && <AddFieldButton />}
          </div>
        )}
      </Droppable>
    </>
  );
}
