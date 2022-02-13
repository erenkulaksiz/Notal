import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from "framer-motion";

import useAuth from '@hooks/auth';

import {
  Navbar,
  LandingFeatureCard
} from '@components';

import {
  CheckToken,
  ValidateToken,
  WorkboxInit
} from '@utils';

import {
  Features
} from '@utils/constants';

const Landing = (props) => {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    WorkboxInit();
    (async () => {
      const token = await auth.users.getIdToken();
      const res = await CheckToken({ token: token.res, props });
      if (!res) {
        setTimeout(() => router.replace(router.asPath), 1000);
      }
    })();
    console.log("props landing: ", props);
  }, []);

  return (
    <div className="mx-auto min-h-screen flex flex-col transition-colors duration-100">
      <Head>
        <title>Notal</title>
        <meta name='twitter:description' content='Take your notes to next level with Notal' />
        <meta property='og:description' content='Take your notes to next level with Notal' />
        <meta name='description' content='Take your notes to next level with Notal' />
      </Head>

      <Navbar user={props?.validate?.data} />

      <main className="flex flex-1 flex-col items-center dark:bg-black bg-white relative overflow-hidden">
        <div className="absolute w-full z-0">
          <div className="absolute bg-gradient-to-t dark:from-black from-white w-full h-[800px] z-10" />
          <img
            src="./landing_bg_banner_1.png"
            className="object-cover w-full h-[800px] z-0 dark:opacity-30 opacity-70"
          />
        </div>
        <div className="sm:container px-8 pt-72 z-10">
          <div className="relative z-50">
            <h1 className="text-black dark:text-white sm:text-5xl text-4xl font-bold font-sans z-20">
              Organize & Plan your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                next
              </span>{' '}
              project with Notal 🚀
            </h1>
            <h5 className="dark:text-neutral-500 text-neutral-600 mt-4 text-lg font-semibold">
              {"Developer's solution from an developer. Keep focus on your project, not on your planning."}
            </h5>
            <button className="p-6 relative bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 transition-all ease-in-out rounded-full py-2 text-md mt-4 text-white font-semibold">
              Discover More
            </button>
          </div>
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "tween", stiffness: 100, duration: 0.8, ease: "easeInOut" }}
          >
            <div className="mt-16 flex-row grid gap-4 h-auto grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 z-10 relative">

              {Features.map((feature, index) => <LandingFeatureCard feature={feature} key={index} />)}

              <div className="bg-landing_bg_2 opacity-25 absolute w-[800px] h-[800px] -left-[300px] -bottom-[300px] bg-no-repeat bg-contain -z-50"></div>
              <div className="bg-landing_bg_3 opacity-20 absolute w-[800px] h-[800px] -right-[350px] -bottom-[300px] bg-no-repeat bg-contain -z-50"></div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Landing;

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;
  let validate = {};

  if (req) {
    const authCookie = req.cookies.auth;
    validate = await ValidateToken({ token: authCookie });
  }
  return { props: { validate } }
}