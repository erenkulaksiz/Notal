import { useEffect } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";

import { Log } from "@utils";
import { Navbar, Workspace as NotalWorkspace } from "@components";
import { useWorkspace, useWorkspaces } from "@hooks";
import { fetchWorkspace } from "@utils";
import { DragDropContext } from "@hello-pangea/dnd";
import type { NotalRootProps } from "@types";

export function Workspace(props: NotalRootProps) {
  const workspaceHook = useWorkspace();
  const { data } = useWorkspaces();

  const workspace = useSWR(
    [`api/fetchWorkspace/${data?.data[data?.data?.length - 1]?.id ?? ""}`], // <- fix here
    () =>
      fetchWorkspace({
        token: Cookies.get("auth"),
        id: (data?.data[data?.data?.length - 1]?.id as string) ?? "",
        uid: props.validate?.data?.uid,
      })
  );

  useEffect(() => {
    workspaceHook.setWorkspace(workspace);
  }, [workspace.data]);

  return (
    <div className="flex flex-col h-full pb-4">
      <h1 className="text-2xl font-bold">
        This is your workspace. You can create notes, lists, and more.
      </h1>
      <p className="text-lg mt-2">
        Feel free to explore. Theres more content inside the real application
        instead of this onboarding.
      </p>
      <div className="mt-2 h-full border-2 rounded-md border-neutral-300 dark:border-neutral-800 overflow-hidden">
        <Navbar disableRightSide />
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;

            if (
              result.destination.index == result.source.index &&
              result.destination.droppableId == result.source.droppableId
            )
              return;

            if (result.type == "BOARD") {
              // reorder field
              workspaceHook.field.reorder({
                source: result.source,
                destination: result.destination,
                fieldId: result.draggableId,
              });
              return;
            }

            if (result.type == "FIELD") {
              // reorder card in field
              workspaceHook.card.reorder({
                source: result.source,
                destination: result.destination,
                cardId: result.draggableId,
              });
            }
          }}
        >
          <NotalWorkspace />
        </DragDropContext>
      </div>
    </div>
  );
}
