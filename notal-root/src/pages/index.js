import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from "framer-motion";
import Image from 'next/image';

import LandingBackground from '../../public/landing_bg_banner_1.webp';

import useAuth from '@hooks/auth';

import {
  Navbar,
  LandingFeatureCard,
  Button,
  Footer,
  AcceptCookies
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
    console.log("home props: ", props);
    WorkboxInit();
    (async () => {
      const token = await auth.users.getIdToken();
      const res = await CheckToken({ token: token.res, props });
      if (!res) {
        setTimeout(() => router.replace(router.asPath), 1000);
      }
    })();
  }, []);

  return (
    <div className="mx-auto min-h-screen flex flex-col transition-colors duration-100 dark:bg-black bg-white">
      <Head>
        <title>Notal</title>
        <meta name='twitter:description' content='Take your notes to next level with Notal' />
        <meta property='og:description' content='Take your notes to next level with Notal' />
        <meta name='description' content='Take your notes to next level with Notal' />
      </Head>

      <Navbar user={props?.validate?.data} showHomeButton />

      <div className="flex flex-1 flex-col items-center dark:bg-black bg-white relative overflow-hidden">
        <div className="absolute w-full z-0">
          <div className="absolute block bg-gradient-to-t dark:from-black from-white w-full h-[800px] z-10" />
          <div className="relative z-0 dark:opacity-30 opacity-40 w-full h-[800px]">
            <Image
              src={LandingBackground}
              alt="Banner image of Notal"
              priority
              placeholder="blur"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        <div className="sm:container px-8 md:px-1 lg:px-2 xl:px-32 pt-40 z-10">
          <div className="relative z-50">
            <h1 className="text-black drop-shadow-xl dark:text-white sm:text-5xl text-4xl font-bold font-sans">
              Organize & Plan your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                next
              </span>{' '}
              project with Notal 🚀
            </h1>
            <h5 className="dark:text-neutral-400 text-gray-600 drop-shadow-lg mt-4 text-lg font-semibold">
              {"Developer's solution from an developer. Keep focus on your project, not on your planning."}
            </h5>
            <Button rounded className="w-32 mt-4" aria-label="Discover more button">
              Discover More
            </Button>
          </div>
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.15,
                }
              }
            }}
            initial="hidden"
            animate="show"
            transition={{ type: "spring", stiffness: 600, damping: 100 }}
            className="mt-16 flex-row grid gap-4 h-auto grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative"
          >
            {Features.map((feature, index) => <LandingFeatureCard feature={feature} key={index} />)}

            <div className="bg-landing_bg_2 opacity-25 absolute w-[800px] h-[800px] -left-[300px] -bottom-[300px] bg-no-repeat bg-contain -z-50"></div>
            <div className="bg-landing_bg_3 opacity-20 absolute w-[800px] h-[800px] -right-[350px] -bottom-[300px] bg-no-repeat bg-contain -z-50"></div>
          </motion.div>
          <Footer />
        </div>
      </div>

      <AcceptCookies />
    </div>
  )
}

export default Landing;

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;
  let validate = {};

  if (req) {
    const authCookie = req.cookies.auth;

    [validate] = await Promise.all([
      ValidateToken({ token: authCookie })
    ]);
  }
  return { props: { validate } }
}