import { useEffect, useState } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { fetchWorkspaces } from "@utils/fetcher/workspaces";
import { useAuth, useNotalUI } from "@hooks";
import { Log } from "@utils";
import { WorkspaceService } from "@services/WorkspaceService";
import { Button } from "@components";
import { DeleteIcon, CrossIcon, CheckIcon } from "@icons";
import type { WorkspaceTypes } from "@types";

export default function useWorkspaces() {
  const auth = useAuth();
  const router = useRouter();
  const NotalUI = useNotalUI();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const workspacesData = useSWR(
    auth?.validatedUser ? "api/fetchWorkspaces" : null,
    () =>
      fetchWorkspaces({
        token: Cookies.get("auth"),
        uid: auth?.validatedUser?.uid,
      })
  );

  useEffect(() => {
    (async () => {
      /**
       * Refresh token and reload the page.
       */
      async function recon() {
        setIsLoading(true);
        await auth?.login?.reload();
        setTimeout(() => {
          router.replace(router.asPath);
        }, 1000);
      }
      const isTokenExpired =
        workspacesData?.data?.error === "auth/id-token-expired";
      const isNoToken = workspacesData?.data?.error === "no-token";
      const isInvalidToken = workspacesData?.data?.error === "invalid-token";
      const tokenError = workspacesData?.data?.error === "auth/argument-error";
      if (isTokenExpired || isNoToken || isInvalidToken || tokenError) {
        Log.error("swr error workspacesData: ", workspacesData?.data);
        recon();
        return;
      }
      if (workspacesData?.data?.success) {
        setIsLoading(false);
      }

      if (workspacesData.error) {
        Log.error("swr err: ", workspacesData.error);
        NotalUI.Toast.show({
          id: "workspace-error-toast",
          once: true,
          title: "Error",
          desc: "Couln't connect to the server. Please reload the page and make sure you have internet connection.",
        });
      }
    })();
  }, [workspacesData]);

  function deleteWorkspace(id: string) {
    async function onDelete() {
      const data = await WorkspaceService.workspace.delete(id);
      Log.debug("remove data:", data);

      const newWorkspaces = [...workspacesData.data.data];
      const workspaceIndex = newWorkspaces.findIndex((el) => el._id === id);
      newWorkspaces.splice(workspaceIndex, 1);

      await workspacesData.mutate(
        {
          ...workspacesData,
          data: newWorkspaces,
        },
        false
      );

      if (data.error) {
        NotalUI.Toast.show({
          id: "workspace-delete-error-toast",
          once: true,
          title: "Error",
          desc: "Something went wrong. Please check the console.",
        });
        return;
      }

      NotalUI.Alert.close();
    }

    NotalUI.Alert.show({
      title: "Delete Workspace",
      titleIcon: <DeleteIcon size={24} fill="currentColor" />,
      desc: (
        <div className="text-center w-full">
          Are you sure want to delete this workspace?
        </div>
      ),
      showCloseButton: false,
      buttons: [
        <Button
          light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
          onClick={() => NotalUI.Alert.close()}
          key={1}
          fullWidth="w-[49%]"
        >
          <CrossIcon size={24} fill="currentColor" />
          Cancel
        </Button>,
        <Button onClick={() => onDelete()} key={2} fullWidth="w-[49%]">
          <CheckIcon size={24} fill="currentColor" />
          Delete
        </Button>,
      ],
    });
  }

  async function addWorkspace(workspace: WorkspaceTypes) {
    workspacesData.mutate(
      {
        ...workspacesData.data,
        data: [...workspacesData.data.data, workspace],
      },
      false
    );
    const data = await WorkspaceService.workspace.add(workspace);
    if (data.success == true) {
      workspacesData.mutate(); // get refreshed workspaces
    } else if (data.success == false) {
      if (data.error == "max-workspaces") {
        NotalUI.Toast.show({
          id: "workspace-max-workspaces-toast",
          once: true,
          title: "Error",
          type: "error",
          desc: "You have reached the maximum number of workspaces.",
        });
        return;
      }
      Log.debug("RES ERR create workspace -> ", data);
      NotalUI.Toast.show({
        title: "Error",
        desc: "Couldn't create the workspace, check the console for more info.",
        type: "error",
        id: "workspace-create-error-toast",
        once: true,
      });
      workspacesData.mutate();
    }
  }

  async function starWorkspace(id: string) {
    const newWorkspaces = [...workspacesData.data.data];
    const workspace = newWorkspaces.findIndex((el) => el._id === id);
    if (workspace != -1)
      newWorkspaces[workspace].starred = !newWorkspaces[workspace].starred;
    await workspacesData.mutate(
      {
        ...workspacesData,
        data: newWorkspaces,
      },
      false
    );
    const data = await WorkspaceService.workspace.star(id);
    Log.debug("starData:", data);
    if (data.success) {
      window.gtag("event", "starWorkspace", {
        login: auth?.validatedUser?.email,
        workspaceId: id,
      });
    } else {
      NotalUI.Alert.show({
        title: "Error",
        desc: data?.error,
      });
      workspacesData.mutate();
    }
  }

  return {
    workspace: {
      star: starWorkspace,
      delete: deleteWorkspace,
      add: addWorkspace,
    },
    isValidating: isLoading,
    data: workspacesData?.data,
  };
}
