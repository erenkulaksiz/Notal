import { useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Droppable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";

import { WorkspaceSidebar } from "@components";
import { useWorkspace } from "@hooks";
import AddFieldButton from "./AddFieldButton";
import { LIMITS } from "@constants/limits";
import type { WorkspaceFieldProps } from "../WorkspaceField/WorkspaceField";

import EmptyStateLight from "@public/empty_state_workspace_light.png";
import EmptyStateDark from "@public/empty_state_workspace_dark.png";

const WorkspaceField = dynamic<WorkspaceFieldProps>(() =>
  import("../WorkspaceField/WorkspaceField").then((mod) => mod.WorkspaceField)
);

export default function Board() {
  const workspace = useWorkspace();

  const fields = useMemo(
    () =>
      Array.isArray(workspace.workspace?.data?.data?.fields)
        ? workspace.workspace?.data?.data?.fields
        : [],
    [workspace.workspace?.data?.data?.fields]
  );

  return (
    <>
      <Droppable droppableId="BOARD" type="BOARD" direction="horizontal">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            className="flex flex-row h-full w-full overflow-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {workspace.isWorkspaceOwner && <WorkspaceSidebar />}
            {fields && fields.length == 0 && (
              <div className="absolute top-0 bottom-0 right-0 left-0 flex z-0 flex-col gap-6 items-center justify-center">
                <div className="flex dark:hidden">
                  <Image src={EmptyStateLight} objectFit="contain" />
                </div>
                <div className="hidden dark:flex">
                  <Image src={EmptyStateDark} objectFit="contain" />
                </div>
                <span>This workspace is empty :(</span>
              </div>
            )}
            {fields &&
              fields.map((field, index: number) =>
                field ? (
                  <WorkspaceField field={field} key={field._id} index={index} />
                ) : null
              )}
            {provided.placeholder}
            {workspace.isWorkspaceOwner &&
              fields &&
              fields.length <= LIMITS.MAX.WORKSPACE_FIELD_LENGTH && (
                <AddFieldButton />
              )}
          </div>
        )}
      </Droppable>
    </>
  );
}
