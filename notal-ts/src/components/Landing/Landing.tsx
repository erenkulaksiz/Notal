import Typewriter from "typewriter-effect";
import Image from "next/image";
import { motion } from "framer-motion";

import { Container, Footer, Button } from "@components";

import { Features } from "@constants/features";

import { LandingFeatureCard } from "./FeatureCard";
import type { LandingFeatureCardProps } from "./FeatureCard";

import LandingBackground from "@public/landing_bg_banner_1.webp";

export function Landing() {
  return (
    <>
      <Container>
        <div className="flex flex-col pt-56 pb-64 justify-center -z-20 overflow-hidden">
          <div className="absolute left-0 right-0 -top-20">
            <div className="absolute bg-gradient-to-t dark:from-black from-white w-full h-[800px] z-10 transition-all ease-in-out duration-500" />
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
          <h1 className="dark:text-white text-black mr-2 z-20 relative flex flex-col drop-shadow-xl sm:text-4xl text-xl font-bold font-sans">
            <Typewriter
              options={{
                strings: [
                  "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Empowering</span> user and developer relations",
                  "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>New way of</span> planning to your projects",
                  "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Empowering</span> user feedbacks",
                  "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Featuring</span> roadmaps to your users",
                  "<span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'>Empowering</span> collaborating with your team to develop together",
                ],
                //pauseFor: 2500,
                autoStart: true,
                loop: true,
                delay: 80,
                skipAddStyles: true,
                wrapperClassName: "notal-writer",
                cursorClassName: "notal-cursor",
              }}
            />
          </h1>
          <h5 className="dark:text-neutral-400 text-gray-600 z-20 drop-shadow-lg text-md sm:text-lg font-semibold">
            {
              "Data between users and developers is important. Notal is the solution."
            }
          </h5>
          <Button
            rounded
            className="w-40 z-20 mt-4"
            aria-label="Discover more button"
            //onClick={() => alert("hey")}
          >
            Discover More
          </Button>
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="mb-16 mt-16 z-10 flex-row grid gap-4 h-auto grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          >
            {Features.map((feature: LandingFeatureCardProps, index: number) => (
              <LandingFeatureCard feature={feature} key={index} />
            ))}
            <div className="bg-landing_bg_2 opacity-25 absolute w-[800px] h-[800px] -left-[300px] -bottom-[100px] bg-no-repeat bg-contain -z-20"></div>
            <div className="bg-landing_bg_3 opacity-20 absolute w-[800px] h-[800px] -right-[350px] -bottom-[200px] bg-no-repeat bg-contain -z-20"></div>
          </motion.div>
        </div>
      </Container>
      <Container>
        <Footer />
      </Container>
    </>
  );
}
