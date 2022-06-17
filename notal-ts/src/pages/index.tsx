import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";

import { Layout, Landing, Navbar, Home } from "@components";

import { Log } from "@utils";
import { ValidateToken } from "@utils/api/validateToken";
import useAuth from "@hooks/useAuth";

import type { ValidateTokenReturnType } from "@utils/api/validateToken";
import type { NotalRootProps } from "@types";

function Root(props: NotalRootProps) {
  const auth = useAuth();

  useEffect(() => {
    if (props.validate) {
      if (props.validate.success)
        auth && auth.setValidatedUser(props.validate.data);
    }
  }, [props.validate]);

  return (
    <Layout>
      <Head>
        <title>Notal</title>
      </Head>
      <Navbar />
      {auth?.validatedUser ? <Home /> : <Landing />}
    </Layout>
  );
}

export default Root;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req, res, query } = ctx;
  let validate = {} as ValidateTokenReturnType;

  if (req) {
    const authCookie = req.cookies.auth;

    [validate] = await Promise.all([ValidateToken({ token: authCookie })]);

    Log.debug("validate:", validate.success, validate.data, validate.error);
  }
  return { props: { validate } };
}
