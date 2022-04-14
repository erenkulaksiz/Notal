import { useEffect, useState, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";
import Typewriter from 'typewriter-effect';

import LandingBackground from "@public/landing_bg_banner_1.webp";

import useAuth from '@hooks/auth';

import {
  Navbar,
  LandingFeatureCard,
  Button,
  Footer,
  AcceptCookies,
  LandingSection
} from '@components';

import {
  CheckToken,
  isClient,
  ValidateToken
} from '@utils';

import {
  Features
} from '@utils/constants';

import { withPublic } from "@hooks/route";

import { Log } from "@utils";

const Landing = (props) => {
  const router = useRouter();
  const auth = useAuth();

  const [featureHovered, setFeatureHovered] = useState(-1);

  /*
  const [_validate, _setValidate] = useState(null);

  const validateData = useSWR(
    ["api/validate", Cookies.get("auth")],
    (url, token) => fetchValidate({ url, token })
  );

  useEffect(() => {
    if (props?.validate?.success) {
      _setValidate(props?.validate);
    }
  }, [props.validate]);

  useEffect(() => {
    if (validateData.data) {
      Log.debug("validate res: ", validateData.data);
      if (!_validate) {
        _setValidate(validateData.data);
      }
    }
    if (validateData.error) {
      console.error("Validate error swr: ", validateData);
    }
  }, [validateData]);
  */

  useEffect(() => {
    Log.debug("home props: ", props);
    (async () => {
      const token = await auth.users.getIdToken();
      const res = await CheckToken({ token: token.res, props, user: auth?.authUser });
      if (!res) {
        setTimeout(() => router.replace(router.asPath), 1000);
      }
    })();
  }, []);

  return (
    <div className="mx-auto flex flex-col transition-colors duration-100 overflow-y-auto overflow-x-hidden">
      <Head>
        <title>Notal</title>
        <meta name='twitter:description' content='Take your notes to next level with Notal' />
        <meta property='og:description' content='Take your notes to next level with Notal' />
        <meta name='description' content='Take your notes to next level with Notal' />
        <meta name='twitter:image' content='https://notal.app/icon_big.png' />
        <meta property='og:image' content='https://notal.app/icon_big.png' />
        <meta name='apple-mobile-web-app-title' content='Notal' />
        <meta name='twitter:title' content='Notal' />
        <meta property='og:title' content='Notal' />
        <meta property='og:url' content='https://notal.app' />
      </Head>

      <Navbar
        user={props?.validate?.data}
        showHomeButton
      />

      <main className="flex flex-1 flex-col items-center relative">
        <div className="absolute w-full z-0 -top-20">
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
        <div className="container px-8 sm:px-8 md:px-8 lg:px-8 xl:px-32 pt-56 z-10">
          <div className="relative z-50">
            <h1 className="dark:text-white text-black mr-2 relative flex flex-col drop-shadow-xl sm:text-4xl text-3xl font-bold font-sans">
              <Typewriter
                options={{
                  strings: [
                    "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Empowering</span> user and developer relations",
                    "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Empowering</span> planning to your projects",
                    "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Empowering</span> user feedbacks",
                    "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Empowering</span> roadmaps to your users",
                    "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Empowering</span> collaborating with your team to develop together",
                  ],
                  pauseFor: 2500,
                  autoStart: true,
                  loop: true,
                  delay: 80,
                  skipAddStyles: true,
                  wrapperClassName: "notal-writer",
                  cursorClassName: "notal-cursor",
                }}
              />
              {!isClient && <>
                Organize & Plan your
                <span className="text-transparent ml-2 mr-2 bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                  next
                </span>
                project with Notal 🚀
              </>}
            </h1>
            <h5 className="dark:text-neutral-400 text-gray-600 drop-shadow-lg mt-4 text-lg font-semibold">
              {"Data between users and developers is important. Notal is the solution."}
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
            className="mb-16 mt-16 flex-row grid gap-4 h-auto grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative"
          >
            {Features.map((feature, index) => <LandingFeatureCard
              feature={feature}
              key={index}
            />)}

            <div className="bg-landing_bg_2 opacity-25 absolute w-[800px] h-[800px] -left-[300px] -bottom-[300px] bg-no-repeat bg-contain -z-50"></div>
            <div className="bg-landing_bg_3 opacity-20 absolute w-[800px] h-[800px] -right-[350px] -bottom-[300px] bg-no-repeat bg-contain -z-50"></div>
          </motion.div>

          {/*[1, 2, 3, 4].map(el => <LandingSection />)*/}

          <Footer />
        </div>
      </main>
    </div>
  )
}

export default withPublic(Landing);

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;
  let validate = {};

  if (req) {
    const authCookie = req.cookies.auth;

    [validate] = await Promise.all([
      ValidateToken({ token: authCookie })
    ]);

    Log.debug("validate:", validate?.success, validate?.data?.uid, validate?.error);
  }
  return { props: { validate } }
}