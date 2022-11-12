import { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { DragDropContext } from "@hello-pangea/dnd";

import { CONSTANTS } from "@constants";
import { server } from "@utils";
import { Layout, Navbar } from "@components";
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

const NotalWorkspace = dynamic<{}>(() =>
  import("../../components/Workspace").then((mod) => mod.Workspace)
);

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
        <meta
          property="twitter:description"
          name="twitter:description"
          content={
            props?.workspace?.data?.owner?.username
              ? `📍 @${props.workspace.data.owner.username}'s workspace`
              : CONSTANTS.SEO_DESCRIPTION
          }
        />
        <meta
          property="og:description"
          name="og:description"
          content={
            props?.workspace?.data?.owner?.username
              ? `📍 @${props.workspace.data.owner.username}'s workspace`
              : CONSTANTS.SEO_DESCRIPTION
          }
        />
        <meta
          property="description"
          name="description"
          content={
            props?.workspace?.data?.owner?.username
              ? `📍 @${props.workspace.data.owner.username}'s workspace`
              : CONSTANTS.SEO_DESCRIPTION
          }
        />
        <meta
          property="twitter:image"
          name="twitter:image"
          content={
            props?.workspace?.data?.thumbnail?.type == "image" &&
            typeof props.workspace.data.thumbnail.file == "string"
              ? props.workspace.data.thumbnail.file
              : `${server}/icon_big.png`
          }
        />
        <meta
          property="og:image"
          name="og:image"
          content={
            props?.workspace?.data?.thumbnail?.type == "image" &&
            typeof props.workspace.data.thumbnail.file == "string"
              ? props.workspace.data.thumbnail.file
              : `${server}/icon_big.png`
          }
        />
        <meta
          property="apple-mobile-web-app-title"
          name="apple-mobile-web-app-title"
          content={
            props?.workspace?.data?.title
              ? `${props.workspace.data.title} • ${CONSTANTS.SEO_APP_NAME}`
              : CONSTANTS.APP_NAME
          }
        />
        <meta
          property="twitter:title"
          name="twitter:title"
          content={
            props?.workspace?.data?.title
              ? `${props.workspace.data.title} • ${CONSTANTS.SEO_APP_NAME}`
              : CONSTANTS.APP_NAME
          }
        />
        <meta
          property="og:title"
          name="og:title"
          content={
            props?.workspace?.data?.title
              ? `${props.workspace.data.title} • ${CONSTANTS.SEO_APP_NAME}`
              : CONSTANTS.APP_NAME
          }
        />
        <meta
          property="og:url"
          content={`${server}/workspace/${router?.query?.id}`}
        />
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

          if (result.type == "BOARD") {
            // reorder field
            workspaceHook.field.reorder({
              source: result.source,
              destination: result.destination,
              fieldId: result.draggableId,
            });
            return;
          }

          if (result.type == "FIELD") {
            // reorder card in field
            workspaceHook.card.reorder({
              source: result.source,
              destination: result.destination,
              cardId: result.draggableId,
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
