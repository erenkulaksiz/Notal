import { useEffect } from "react";
import Head from "next/head";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import {
  Layout,
  Navbar,
  WorkspaceSEO,
  Workspace as NotalWorkspace,
} from "@components";
import {
  GetWorkspaceData,
  WorkspaceDataReturnType,
} from "@utils/api/workspaceData";
import { useWorkspace } from "@hooks";
import { NotalRootProps } from "@types";
import { fetchWorkspace, ValidateToken } from "@utils";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@utils/api/validateToken";

function Workspace(props: NotalRootProps) {
  const router = useRouter();
  const workspaceHook = useWorkspace();

  const workspace = useSWR(
    [`api/fetchWorkspace/${router?.query?.id ?? ""}`],
    () =>
      fetchWorkspace({
        token: Cookies.get("auth"),
        id: props.workspace?.data.id,
        uid: props.validate?.data?.uid,
      })
  );

  useEffect(() => {
    workspaceHook.setWorkspace(workspace);
  }, [workspace.data]);

  return (
    <Layout {...props}>
      <Head>
        <title>
          {!props.workspace
            ? "Loading..."
            : props.workspace?.success
            ? `${props.workspace?.data?.title} • notal.app`
            : props.workspace?.error == "not-found"
            ? "Not Found • notal.app"
            : "Error • notal.app"}
        </title>
        <WorkspaceSEO workspace={props.workspace} />
      </Head>
      <Navbar
        showCollapse
        workspaceLoading={!props.workspace || workspace.isValidating}
      />
      <NotalWorkspace
        workspaceData={props.workspace}
        workspaceLoading={!props.workspace || workspace.isValidating}
      />
    </Layout>
  );
}

export default Workspace;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  let workspace = {} as WorkspaceDataReturnType;
  if (ctx.req) {
    [validate, workspace] = await Promise.all([
      ValidateToken({ token: ctx.req.cookies.auth }),
      GetWorkspaceData({
        id: Array.isArray(ctx.query.id) ? ctx.query.id[0] : ctx.query.id,
        token: ctx.req.cookies.auth,
      }),
    ]);
  }
  return { props: { validate, workspace } };
}
