import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Layout, Landing, Navbar, Home, Loading, Container } from "@components";

import { ValidateToken } from "@utils/api/validateToken";
import useAuth from "@hooks/useAuth";

import type { ValidateTokenReturnType } from "@utils/api/validateToken";
import type { NotalRootProps } from "@types";

function Root(props: NotalRootProps) {
  const auth = useAuth();

  return (
    <Layout {...props}>
      <Head>
        <title>Notal</title>
      </Head>
      <Navbar showCollapse={auth?.validatedUser != null} />
      {auth?.validatedUser && auth?.authLoading ? (
        <Loading size="lg" />
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
