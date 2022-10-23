import { useEffect } from "react";
import Head from "next/head";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { DragDropContext } from "@hello-pangea/dnd";

import { Log } from "@utils";
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
import { ValidateToken } from "@utils/api/validateToken";
import { fetchWorkspace } from "@utils";
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
        id: router?.query?.id as string,
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
      <Navbar showCollapse />
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          if (
            result.destination.index == result.source.index &&
            result.destination.droppableId == result.source.droppableId
          )
            return;
          Log.debug("drag drop result", result);
          if (result.destination.droppableId == "board") {
            // reorder field
            workspaceHook.field.reorder({
              source: result.source,
              destination: result.destination,
              fieldId: result.draggableId,
            });
          }
        }}
      >
        <NotalWorkspace />
      </DragDropContext>
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
