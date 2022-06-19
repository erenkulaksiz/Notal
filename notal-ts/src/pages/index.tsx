import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Layout, Landing, Navbar, Home, Loading, Container } from "@components";

import { ValidateToken } from "@utils/api/validateToken";
import useAuth from "@hooks/useAuth";
import { CheckToken } from "@utils/api/checkToken";

import type { ValidateTokenReturnType } from "@utils/api/validateToken";
import type { NotalRootProps } from "@types";

function Root(props: NotalRootProps) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (props.validate) {
      if (props.validate.success)
        auth && auth.setValidatedUser(props.validate.data);
    }
  }, [props.validate]);

  useEffect(() => {
    if (!auth?.authLoading) {
      (async () => {
        const token = await auth?.user?.getIdToken();
        const res = await CheckToken({
          token: token.res,
          props,
          user: auth?.authUser,
        });
        if (!res) {
          setTimeout(() => router.replace(router.asPath), 1000);
        }
      })();
    }
  }, [auth?.authLoading]);

  return (
    <Layout>
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
  const { req, res, query } = ctx;
  let validate = {} as ValidateTokenReturnType;

  if (req) {
    validate = await ValidateToken({ token: req.cookies.auth });
  }
  return { props: { validate } };
}
