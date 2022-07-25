import Head from "next/head";

import { PropsWithChildren } from "react";

import { ValidateToken } from "@utils/api/validateToken";
import {
  Layout,
  Navbar,
  WorkspaceSEO,
  Workspace as NotalWorkspace,
} from "@components";
import { useAuth, useWorkspace } from "@hooks";
import {
  GetWorkspaceData,
  WorkspaceDataReturnType,
} from "@utils/api/workspaceData";
import { NotalRootProps } from "@types";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@utils/api/validateToken";

function Workspace(props: NotalRootProps) {
  const { workspaceLoading } = useWorkspace();

  return (
    <Layout {...props}>
      <Head>
        <title>
          {workspaceLoading
            ? "Loading..."
            : props.workspace?.success
            ? `${props.workspace?.data?.title} • notal.app`
            : props.workspace?.error == "not-found"
            ? "Not Found • notal.app"
            : "Error • notal.app"}
        </title>
        <WorkspaceSEO workspace={props.workspace} />
      </Head>
      <Navbar showCollapse />
      <NotalWorkspace />
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
