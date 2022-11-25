import { Log } from "@utils";

import { AddWorkspaceButton, Navbar, HomeWorkspaceCard } from "@components";
import { ArrowUpIcon } from "@icons";
import { useWorkspaces } from "@hooks";
import type { WorkspaceTypes } from "@types";

export function CreateWorkspace({ onCreate }: { onCreate: () => void }) {
  const workspaces = useWorkspaces();

  return (
    <>
      <div className="flex flex-col h-full pb-4">
        <h1 className="text-2xl font-bold">
          Okay, lets learn how to create a basic workspace here.
        </h1>
        <p className="text-lg mt-2">
          This is your home screen. It seems a bit empty right now, but dont
          worry. New features are on the way.
        </p>
        <div className="mt-2 h-full border-2 rounded-md border-neutral-300 dark:border-neutral-800 overflow-hidden">
          <Navbar disableRightSide />
          <div className="w-full relative pb-4 px-4 mt-4">
            <div className="relative grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max">
              <AddWorkspaceButton onWorkspaceAdd={() => onCreate()} />
              {!workspaces.isValidating &&
                workspaces?.data?.data &&
                workspaces?.data?.data.map(
                  (workspace: WorkspaceTypes, index: number) => (
                    <HomeWorkspaceCard
                      workspace={workspace}
                      onStar={() => workspaces.workspace.star(workspace._id)}
                      onDelete={() =>
                        workspaces.workspace.delete(workspace._id)
                      }
                      key={workspace._id}
                      index={index}
                    />
                  )
                )}
              {workspaces.isValidating &&
                [1, 2, 3].map((item) => (
                  <HomeWorkspaceCard skeleton key={item} />
                ))}
              <div className="absolute w-[400px] h-6 left-0 top-[calc(100%+10px)] bottom-0 flex items-center z-50">
                <ArrowUpIcon
                  width={48}
                  height={48}
                  fill="currentColor"
                  className="scale-50"
                />
                Click Add Workspace button to get started.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
