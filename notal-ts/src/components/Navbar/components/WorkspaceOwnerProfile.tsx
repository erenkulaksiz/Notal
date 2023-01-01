import Link from "next/link";
import { useEffect, useState } from "react";

import { Avatar, Tooltip, Button } from "@components";
import { BuildComponent } from "@utils/style";
import { useWorkspace } from "@hooks";
import { ShareIcon } from "@icons";
import { formatDateToHuman, Log } from "@utils";

export function WorkspaceOwnerProfile() {
  const {
    workspaceLoading,
    workspaceNotFound,
    workspace,
    isWorkspaceOwner,
    isWorkspaceUser,
  } = useWorkspace();
  const [shared, setShared] = useState<boolean>(false);

  useEffect(() => {
    if (shared) {
      setTimeout(() => {
        setShared(false);
      }, 3000);
    }
  }, [shared]);

  if (workspaceLoading) return null;
  if (workspaceNotFound) return null;
  if (!workspace?.data?.data?.title) return null;

  const BuildWorkspaceOwnerProfileContainer = BuildComponent({
    name: "Workspace Owner Profile Container",
    defaultClasses:
      "flex flex-row z-40 rounded-lg p-1 px-2 dark:bg-neutral-800/80 bg-neutral-100",
    conditionalClasses: [{ true: "left-[4.3rem]", false: "left-4" }],
    selectedClasses: [isWorkspaceOwner || isWorkspaceUser],
  });

  function onShareWorkspace() {
    if (navigator.share) {
      navigator
        .share({
          title:
            typeof workspace?.data?.data?.owner == "object"
              ? `📍 @${workspace?.data?.data?.owner?.username}'s workspace`
              : `📍 ${workspace?.data?.data?.title}`,
          text: workspace?.data?.data?.title,
          url: `https://notal.app/w/${workspace?.data?.data?.id}`,
        })
        .then(() => Log.debug("Successful share"))
        .catch((error) => Log.debug("Error sharing", error));
    } else {
      navigator.clipboard.writeText(
        `https://notal.app/w/${workspace?.data?.data?.id}`
      );
      if (shared) return;
      setShared(true);
    }
  }

  if (workspaceLoading)
    return (
      <div className={BuildWorkspaceOwnerProfileContainer.classes}>
        <div className="flex my-1 flex-1 bg-neutral-700 animate-pulse w-24 h-4"></div>
      </div>
    );

  return (
    <div className={BuildWorkspaceOwnerProfileContainer.classes}>
      <Tooltip
        outline
        direction="bottom"
        noPadding
        containerClassName="px-1 py-1"
        blockContent={false}
        content={
          <div className="flex flex-col gap-1">
            {!isWorkspaceOwner && !isWorkspaceUser && (
              <Link
                href="/profile/[username]"
                as={`/profile/${
                  (typeof workspace?.data?.data?.owner == "object" &&
                    workspace?.data?.data?.owner?.username) ||
                  "not-found"
                }`}
                passHref
              >
                <a className="flex flex-row items-center min-w-max">
                  <div className="p-[2px] rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
                    <Avatar
                      src={
                        (typeof workspace?.data?.data?.owner == "object" &&
                          workspace?.data?.data?.owner?.avatar) ||
                        ""
                      }
                      size="2xl"
                      className="border-[2px] dark:border-black border-white"
                    />
                  </div>
                  <div className="flex flex-col ml-1">
                    <span className="text-md h-4">
                      {typeof workspace?.data?.data?.owner == "object" &&
                        (workspace?.data?.data?.owner?.fullname
                          ? `${workspace?.data?.data?.owner?.fullname}`
                          : `@${workspace?.data?.data?.owner?.username}`)}
                    </span>
                    {typeof workspace?.data?.data?.owner == "object" &&
                      workspace?.data?.data?.owner?.username && (
                        <span className="text-sm text-neutral-600">
                          {`@${workspace?.data?.data?.owner?.username}`}
                        </span>
                      )}
                  </div>
                </a>
              </Link>
            )}
            <Button
              light="border-2 border-neutral-500 dark:border-white"
              size="sm"
              onClick={onShareWorkspace}
            >
              {shared ? (
                <span>Copied link!</span>
              ) : (
                <>
                  <ShareIcon
                    size={24}
                    fill="currentColor"
                    className="scale-75 fill-neutral-500 dark:fill-white"
                  />
                  <span className="text-neutral-500 dark:text-white">
                    Share
                  </span>
                </>
              )}
            </Button>
            <div className="flex flex-col">
              <span className="text-sm text-neutral-600">Created at</span>
              {formatDateToHuman({
                date: workspace?.data?.data?.createdAt || 0,
                output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
              })}
              <span className="text-sm text-neutral-600">Last Updated at</span>
              {formatDateToHuman({
                date: workspace?.data?.data?.updatedAt || 0,
                output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
              })}
            </div>
          </div>
        }
      >
        <div className="flex flex-col w-full justify-center">
          <span className="text-sm break-words w-full">
            {workspace?.data?.data?.title}
          </span>
        </div>
      </Tooltip>
    </div>
  );
}
