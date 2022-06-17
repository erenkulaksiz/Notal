import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { Loading, Button, Layout, Tooltip, Switch } from "@components";
import { SendTelegramMessage } from "@utils";

import Navbar from "components/Navbar/Navbar";
import useAuth from "@hooks/useAuth";

const Landing: NextPage = () => {
  const [asd, setAsd] = useState(false);
  const auth = useAuth();

  return (
    <Layout>
      <Head>
        <title>Notal</title>
      </Head>
      <Navbar />
      <div className="w-full">{JSON.stringify(auth?.authUser)}</div>
      <Loading size="xl" />
      <Button className="w-32" onClick={() => auth?.login?.logout()}>
        logout!
      </Button>
      <Switch id="selam" value={asd} onChange={() => setAsd(!asd)} />
    </Layout>
  );
};

export default Landing;
