import { useEffect } from "react";
import Head from "next/head";

import { Layout, Landing, Navbar, Home, LoadingOverlay } from "@components";
import { ValidateToken } from "@utils/api/validateToken";
import { useAuth, useWorkspace } from "@hooks";
import type { ValidateTokenReturnType } from "@utils/api/validateToken";
import type { NotalRootProps } from "@types";
import type { GetServerSidePropsContext } from "next";

function Root(props: NotalRootProps) {
  const auth = useAuth();
  const { setWorkspace } = useWorkspace();

  useEffect(() => {
    setWorkspace(null);
  }, []);

  return (
    <Layout {...props}>
      <Head>
        <title>
          {auth?.validatedUser || auth?.authUser
            ? "Workspaces • notal.app"
            : "Notal"}
        </title>
      </Head>
      <Navbar showCollapse={auth?.validatedUser != null} />
      {auth?.authLoading ? (
        <LoadingOverlay />
      ) : auth?.validatedUser || auth?.authUser ? (
        <Home />
      ) : (
        <Landing />
      )}
    </Layout>
  );
}

export default Root;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) validate = await ValidateToken({ token: ctx.req.cookies.auth });
  return { props: { validate } };
}
