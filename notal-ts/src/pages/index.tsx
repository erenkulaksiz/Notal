import type { NextPage } from "next";
import Head from "next/head";
import { Loading, Button } from "@components";

const Landing: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Notal</title>
      </Head>
      <div className="bg-red-600">tailwind nextjs ts</div>
      <Loading />
      <Button size="xl" className="w-32">
        selam!
      </Button>
    </div>
  );
};

export default Landing;
