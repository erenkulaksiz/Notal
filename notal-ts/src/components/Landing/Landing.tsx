import Typewriter from "typewriter-effect";
import Image from "next/image";
import { motion } from "framer-motion";

import LandingBackground from "@public/landing_bg_banner_1.webp";
import { Container, Footer, LandingFeatureCard } from "@components";
import { Features } from "@constants/features";
import { CONSTANTS } from "@constants";
import type { LandingFeatureCardProps } from "./components/FeatureCard";
import { BoltIcon, ArrowDownIcon } from "@icons";

export function Landing() {
  return (
    <>
      <Container>
        <div className="flex flex-col h-full sm:h-screen pt-14 sm:p-0 justify-center -z-20 overflow-hidden">
          <div className="absolute left-0 right-0 top-0 bottom-4 sm:flex hidden justify-center items-end z-40">
            <div className="flex flex-col items-center animate-[landingBounce_5s_ease-in-out_infinite]">
              <span className="text-sm">Scroll to discover more</span>
              <ArrowDownIcon width={20} height={20} fill="currentColor" />
            </div>
          </div>
          <div className="absolute left-0 right-0 -top-20">
            <div className="absolute bg-gradient-to-t dark:from-black from-white w-full h-[800px] z-20 transition-all ease-in-out duration-500" />
            <div className="relative z-10 dark:opacity-30 opacity-40 w-full h-[800px]">
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
          <h1 className="dark:text-white text-black px-4 mr-2 z-50 relative flex flex-col drop-shadow-xl sm:text-4xl text-xl font-bold font-sans">
            <Typewriter
              options={{
                strings: CONSTANTS.LANDING_PAGE_STRINGS,
                //pauseFor: 2500,
                autoStart: true,
                loop: true,
                delay: 70,
                skipAddStyles: true,
                wrapperClassName: "notal-writer",
                cursorClassName: "notal-cursor",
              }}
            />
          </h1>
          <h5 className="dark:text-neutral-400 px-4 text-gray-600 z-50 drop-shadow-lg text-md sm:text-lg font-semibold">
            {CONSTANTS.LANDING_PAGE_SUBDESC}
          </h5>
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.35,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="mb-16 mt-16 z-40 px-4 relative flex-row grid gap-4 h-auto grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          >
            {Features.map((feature: LandingFeatureCardProps, index: number) => (
              <LandingFeatureCard feature={feature} key={index} />
            ))}
          </motion.div>
          <div className="bg-landing_bg_2 opacity-25 absolute w-[800px] h-[800px] -left-[5%] bottom-0 bg-no-repeat bg-contain z-30"></div>
          <div className="bg-landing_bg_3 opacity-20 absolute w-[800px] h-[800px] right-0 -bottom-[10%] bg-no-repeat bg-contain z-30"></div>
        </div>
        {/*<div className="w-full z-50 flex relative">
          <div className="flex flex-row">
            <BoltIcon
              size={20}
              fill="currentColor"
              style={{ transform: "scale(.8)" }}
            />
            <h1 className="text-4xl font-light">
              Add workspace to start quickly
            </h1>
          </div>
            </div>*/}
      </Container>
      <Container>
        <Footer />
      </Container>
    </>
  );
}
