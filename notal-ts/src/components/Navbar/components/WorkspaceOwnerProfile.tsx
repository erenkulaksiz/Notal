import Link from "next/link";

import { BuildComponent } from "@utils/style";
import { useAuth, useWorkspace } from "@hooks";

export function WorkspaceOwnerProfile() {
  const auth = useAuth();
  const { workspaceData, workspaceLoading, notFound, isOwner } = useWorkspace();

  if (notFound) return null;

  const BuildWorkspaceOwnerProfileContainer = BuildComponent({
    name: "Workspace Owner Profile Container",
    defaultClasses:
      "flex flex-row ml-2 z-40 rounded-lg p-1 px-2 dark:bg-neutral-800/80 bg-neutral-200/80",
    conditionalClasses: [{ true: "left-[4.3rem]", false: "left-4" }],
    selectedClasses: [isOwner],
  });

  return workspaceLoading ? (
    <div className={BuildWorkspaceOwnerProfileContainer.classes}>
      <div className="flex my-1 flex-1 bg-neutral-700 animate-pulse w-24 h-4"></div>
    </div>
  ) : (
    <div className={BuildWorkspaceOwnerProfileContainer.classes}>
      <div className="flex flex-col w-full justify-center">
        <span className="text-sm break-words w-full">
          {workspaceData?.data?.title}
        </span>
      </div>
      {!isOwner && (
        <Link
          href="/profile/[username]"
          as={`/profile/${workspaceData?.data?.owner?.username || "not-found"}`}
          passHref
        >
          <a className="flex flex-row items-center ml-2 min-w-max">
            <div className="p-[2px] w-7 h-7 rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
              <img
                src={workspaceData?.data?.owner?.avatar}
                className="w-7 h-6 rounded-full border-[2px] dark:border-black border-white"
              />
            </div>
            <div className="flex flex-col ml-1">
              <span className="text-md h-4">
                {workspaceData?.data?.owner?.fullname
                  ? `${workspaceData?.data?.owner?.fullname}`
                  : `@${workspaceData?.data?.owner?.username}`}
              </span>
              {workspaceData?.data?.owner?.fullname && (
                <span className="text-sm text-neutral-600">
                  {`@${workspaceData?.data?.owner?.username}`}
                </span>
              )}
            </div>
          </a>
        </Link>
      )}
    </div>
  );
}
