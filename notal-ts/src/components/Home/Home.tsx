import { useEffect, useState } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";

import { DashboardFilledIcon } from "@icons";

import {
  Container,
  LoadingOverlay,
  Tooltip,
  HomeWorkspaceCard,
  Button,
} from "@components";
import { HomeNavTitle } from "./NavTitle";
import useAuth from "@hooks/useAuth";
import useNotalUI from "@hooks/useNotalUI";

import { fetchWorkspaces } from "@utils/fetcher/workspaces";
import { Log } from "@utils/logger";

import type { WorkspaceTypes } from "@types";
import { useRouter } from "next/router";
import AddWorkspaceButton from "./AddWorkspaceBtn";

export function Home() {
  const auth = useAuth();
  const router = useRouter();
  const NotalUI = useNotalUI();
  const [workspaces, setWorkspaces] = useState<WorkspaceTypes[]>([]);

  const starredWorkspaces = workspaces?.filter((el) => !!el.starred);
  const privateWorkspaces = workspaces?.filter((el) => !el.workspaceVisible);

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
      } else {
        if (workspacesData?.data?.success) {
          setWorkspaces(workspacesData?.data?.data);
        }
      }
      if (workspacesData?.data?.error) {
        Log.error("swr error workspacesData: ", workspacesData?.data);
      }
    })();
  }, [workspacesData]);

  return workspacesData.isValidating || !auth?.validatedUser ? (
    <LoadingOverlay />
  ) : (
    <>
      <HomeNavTitle
        title="Workspaces"
        count={{
          workspaces: workspaces.length,
          privateWorkspaces: privateWorkspaces.length,
          starredWorkspaces: starredWorkspaces.length,
        }}
      >
        <DashboardFilledIcon size={24} fill="currentColor" />
      </HomeNavTitle>
      <div className="w-full relative pb-4 px-4 mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 items-start auto-rows-max">
        <AddWorkspaceButton onClick={() => {}} />
        {workspaces.map((workspace, index) => (
          <HomeWorkspaceCard
            workspace={workspace}
            onStar={() => {}}
            onDelete={() => {}}
            key={workspace._id}
          />
        ))}
        <Button
          onClick={() =>
            NotalUI.Toast.show({
              title: "selam",
            })
          }
        >
          toast
        </Button>

        <Button
          onClick={() =>
            NotalUI.Alert.show({
              title: "selam",
            })
          }
        >
          alert
        </Button>
      </div>
    </>
  );
}
