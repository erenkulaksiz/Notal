import { useEffect } from "react";
import Head from "next/head";

import { Layout, Landing, Navbar, Home, LoadingOverlay } from "@components";
import { ValidateToken } from "@utils/api/validateToken";
import { useAuth, useWorkspace } from "@hooks";
import { CONSTANTS } from "@constants";
import { server, Log } from "@utils";
import type { ValidateTokenReturnType } from "@utils/api/validateToken";
import type { NotalRootProps } from "@types";
import type { GetServerSidePropsContext } from "next";

function Root(props: NotalRootProps) {
  const auth = useAuth();
  const { setWorkspace } = useWorkspace();

  useEffect(() => {
    setWorkspace(null);
    Log.debug("notal.app");
  }, []);

  return (
    <Layout {...props}>
      <Head>
        <title>
          {auth?.validatedUser || auth?.authUser
            ? `Workspaces • ${CONSTANTS.SEO_APP_NAME}`
            : CONSTANTS.APP_NAME}
        </title>
        <meta
          property="twitter:description"
          name="twitter:description"
          content={CONSTANTS.SEO_DESCRIPTION}
        />
        <meta
          property="og:description"
          name="og:description"
          content={CONSTANTS.SEO_DESCRIPTION}
        />
        <meta
          property="description"
          name="description"
          content={CONSTANTS.SEO_DESCRIPTION}
        />
        <meta
          property="twitter:image"
          name="twitter:image"
          content={`https://${server}/icon_big.png`}
        />
        <meta
          property="og:image"
          name="og:image"
          content={`https://${server}/icon_big.png`}
        />
        <meta
          property="apple-mobile-web-app-title"
          name="apple-mobile-web-app-title"
          content={CONSTANTS.APP_NAME}
        />
        <meta
          property="twitter:title"
          name="twitter:title"
          content={CONSTANTS.APP_NAME}
        />
        <meta
          property="og:title"
          name="og:title"
          content={CONSTANTS.APP_NAME}
        />
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
