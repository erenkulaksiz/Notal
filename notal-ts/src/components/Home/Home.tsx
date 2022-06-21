import { useEffect, useState } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";

import {
  Container,
  Loading,
  Button,
  Switch,
  Footer,
  LoadingOverlay,
} from "@components";
import useAuth from "@hooks/useAuth";

import { fetchWorkspaces } from "@utils/fetcher/workspaces";

export function Home() {
  const auth = useAuth();

  const workspacesData = useSWR(
    auth?.validatedUser ? "api/fetchWorkspaces" : null,
    () =>
      fetchWorkspaces({
        token: Cookies.get("auth"),
        uid: auth?.validatedUser?.uid,
      })
  );

  /*
  useEffect(() => {
    if (auth?.validatedUser && auth?.authUser) {
      workspacesData.mutate();
    }
  }, [auth?.validatedUser]);
  */

  return workspacesData.isValidating || !auth?.validatedUser ? (
    <LoadingOverlay />
  ) : (
    <Container>{JSON.stringify(workspacesData)}</Container>
  );
}
