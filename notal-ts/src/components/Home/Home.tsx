import { useEffect, useState } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { DashboardFilledIcon } from "@icons";

import { LoadingOverlay, HomeWorkspaceCard } from "@components";
import { HomeNavTitle } from "./NavTitle";
import useAuth from "@hooks/useAuth";

import { fetchWorkspaces } from "@utils/fetcher/workspaces";
import { Log } from "@utils/logger";

import type { WorkspaceTypes } from "@types";
import AddWorkspaceButton from "./AddWorkspaceBtn";
import { WorkspaceService } from "@services/WorkspaceService";
import useNotalUI from "@hooks/useNotalUI";

export function Home() {
  const auth = useAuth();
  const router = useRouter();
  const NotalUI = useNotalUI();

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
      if (
        workspacesData?.data?.error?.code == "auth/id-token-expired" ||
        workspacesData?.data?.error == "no-token" ||
        workspacesData?.data?.error == "invalid-token" ||
        workspacesData?.data?.error == "auth/argument-error"
      ) {
        const token = await auth?.user?.getIdToken();
        Cookies.set("auth", token, { expires: 365 });
        setTimeout(() => {
          router.replace(router.asPath);
          workspacesData.mutate();
        }, 1000);
      }
      if (workspacesData?.data?.error) {
        Log.error("swr error workspacesData: ", workspacesData?.data);
      }
    })();
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

  return workspacesData.isValidating || !auth?.validatedUser ? (
    <LoadingOverlay />
  ) : (
    <>
      <HomeNavTitle
        title="Workspaces"
        count={{
          workspaces: workspacesData.data.data.length,
          privateWorkspaces: privateWorkspaces.length,
          starredWorkspaces: starredWorkspaces.length,
        }}
      >
        <DashboardFilledIcon size={24} fill="currentColor" />
      </HomeNavTitle>
      <div className="w-full relative pb-4 px-4 mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max">
        <AddWorkspaceButton onClick={() => {}} />
        {workspacesData.data.data.map((workspace: WorkspaceTypes) => (
          <HomeWorkspaceCard
            workspace={workspace}
            onStar={() => starWorkspace(workspace._id)}
            onDelete={() => {}}
            key={workspace._id}
          />
        ))}
      </div>
    </>
  );
}
