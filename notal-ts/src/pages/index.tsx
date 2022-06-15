import type { NextPage } from "next";
import Head from "next/head";
import { Loading, Button, Layout, Tooltip } from "@components";
import { Switch } from "components/Switch/Switch";
import { useState } from "react";
import Navbar from "components/Navbar/Navbar";

const Landing: NextPage = () => {
  const [asd, setAsd] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Notal</title>
      </Head>
      <Navbar />
      <div className="bg-red-600">tailwind nextjs ts</div>
      <Loading />
      <Button className="w-32">selam!</Button>
      <Switch id="selam" value={asd} onChange={() => setAsd(!asd)} />
    </Layout>
  );
};

export default Landing;
