import { useEffect, useState } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

import { DashboardFilledIcon, DeleteIcon, CrossIcon, CheckIcon } from "@icons";
import { HomeWorkspaceCard, Button, AddWorkspaceModal } from "@components";
import { HomeNavTitle } from "./components/NavTitle";
import { useAuth, useNotalUI } from "@hooks";
import { fetchWorkspaces } from "@utils/fetcher/workspaces";
import { Log } from "@utils/logger";
import { WorkspaceService } from "@services/WorkspaceService";

import AddWorkspaceButton from "./components/AddWorkspaceBtn";

import type { WorkspaceTypes } from "@types";

export function Home() {
  const auth = useAuth();
  const router = useRouter();
  const NotalUI = useNotalUI();

  const [addWorkspaceModal, setAddWorkspaceModal] = useState(false);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

  const workspacesData = useSWR(
    auth?.validatedUser ? "api/fetchWorkspaces" : null,
    () =>
      fetchWorkspaces({
        token: Cookies.get("auth"),
        uid: auth?.validatedUser?.uid,
      })
  );

  const starredWorkspaces = workspacesData?.data?.data?.filter(
    (el: WorkspaceTypes) => !!el.starred
  );
  const privateWorkspaces = workspacesData?.data?.data?.filter(
    (el: WorkspaceTypes) => !el.workspaceVisible
  );

  useEffect(() => {
    (async () => {
      const isTokenExpired =
        workspacesData?.data?.error?.code === "auth/id-token-expired";
      const isNoToken = workspacesData?.data?.error === "no-token";
      const isInvalidToken = workspacesData?.data?.error === "invalid-token";
      const tokenError = workspacesData?.data?.error === "auth/argument-error";
      if (isTokenExpired || isNoToken || isInvalidToken || tokenError) {
        const token = await auth?.user?.getIdToken();
        Cookies.set("auth", token, { expires: 365 });
        setTimeout(() => {
          router.replace(router.asPath);
          workspacesData.mutate();
        }, 1000);
        return;
      }
      if (workspacesData?.data?.error) {
        Log.error("swr error workspacesData: ", workspacesData?.data);
        return;
      }
    })();
    if (workspacesData?.data?.success) {
      // if we have data, we're done loading
      setLoadingWorkspaces(false);
    }
  }, [workspacesData]);

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

  async function deleteWorkspace(workspace: WorkspaceTypes) {
    NotalUI.Alert.show({
      title: "Delete Workspace",
      titleIcon: <DeleteIcon size={24} fill="currentColor" />,
      desc: "Are you sure want to delete this workspace?",
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
        <Button
          onClick={() => {
            NotalUI.Alert.close();
          }}
          key={2}
          fullWidth="w-[49%]"
        >
          <CheckIcon size={24} fill="currentColor" />
          Delete
        </Button>,
      ],
    });
  }

  return (
    <>
      <HomeNavTitle
        title="Workspaces"
        count={{
          workspaces: workspacesData?.data?.data?.length ?? 0,
          privateWorkspaces: privateWorkspaces?.length ?? 0,
          starredWorkspaces: starredWorkspaces?.length ?? 0,
        }}
      >
        <DashboardFilledIcon size={24} fill="currentColor" />
      </HomeNavTitle>
      <motion.div
        initial="hidden"
        animate="show"
        className="w-full relative pb-4 px-4 mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max"
      >
        <AnimatePresence>
          {!loadingWorkspaces && (
            <AddWorkspaceButton
              onClick={() => {
                if (workspacesData.data?.data?.length >= 20) {
                  NotalUI.Toast.show({
                    title: "Error",
                    desc: "You can only have 20 workspaces maximum at the moment.",
                    type: "error",
                    once: true,
                    id: "workspace-limit-toast",
                  });
                  return;
                }
                setAddWorkspaceModal(true);
              }}
              workspaceLength={workspacesData.data?.data?.length ?? 0}
            />
          )}
          {!loadingWorkspaces &&
            workspacesData?.data?.data?.map(
              (workspace: WorkspaceTypes, index: number) => (
                <HomeWorkspaceCard
                  workspace={workspace}
                  onStar={() => starWorkspace(workspace._id)}
                  onDelete={() => deleteWorkspace(workspace)}
                  key={workspace._id}
                  index={index}
                />
              )
            )}
          {loadingWorkspaces &&
            [1, 2, 3].map((item) => <HomeWorkspaceCard skeleton key={item} />)}
        </AnimatePresence>
      </motion.div>
      <AddWorkspaceModal
        open={addWorkspaceModal}
        onClose={() => setAddWorkspaceModal(false)}
        onAdd={(workspace: WorkspaceTypes) => {}}
      />
    </>
  );
}
