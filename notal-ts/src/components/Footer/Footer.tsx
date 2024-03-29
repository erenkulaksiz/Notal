import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion } from "framer-motion";

import { CodeIcon, Github2Icon, HeartIcon, TwitterIcon } from "@icons";
import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import { BuildComponent } from "@utils/style/buildComponent";
import StorybookLogo from "@public/storybook_logo.png";
import { isClient } from "@utils";
import { Tooltip } from "@components";
import { CONSTANTS } from "@constants";

export function Footer({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [isInView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const BuildFooter = BuildComponent({
    name: "Footer",
    defaultClasses: "w-full pb-8 flex flex-col z-20",
    extraClasses: className,
  });

  const FooterAnimVariant = {
    hidden: { y: isClient() ? -50 : 0, opacity: isClient() ? 0 : 1 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        mass: 0.5,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.footer
      className={BuildFooter.classes}
      animate={isInView ? "show" : "hidden"}
      variants={FooterAnimVariant}
      onViewportEnter={() => setInView(true)}
    >
      <div className="h-0.5 dark:bg-neutral-700/70 bg-neutral-300/70 w-full rounded-full" />
      <div className="grid grid-cols-1 sm:grid-cols-3 mt-8 gap-8 sm:gap-4">
        <div className="flex flex-col hover:-translate-y-1 ease-in-out transition-all">
          {typeof resolvedTheme != "undefined" && mounted && (
            <div className="w-32 h-8 object-contain">
              <Image
                src={resolvedTheme == "dark" ? IconWhite : IconGalactic}
                alt="Logo of Notal"
                priority
                placeholder="blur"
              />
            </div>
          )}
          <span className="mt-4 text-sm dark:text-neutral-300 text-neutral-500">
            Create workspaces, manage your projects.
          </span>
          <span className="flex flex-row text-xs items-center mt-2 dark:text-neutral-400 text-neutral-400">
            <CodeIcon
              size={24}
              fill="currentColor"
              style={{ transform: "scale(0.8)" }}
            />
            <span>with</span>
            <HeartIcon
              size={24}
              className="fill-red-500"
              style={{ transform: "scale(0.8)" }}
            />
            <span>by</span>
            <Link href="https://erenk.dev" passHref>
              <a target="_blank" rel="noreferrer" className="ml-1">
                @Eren Kulaksiz
              </a>
            </Link>
          </span>
          {/*<Link href="https://github.com/erenkulaksiz/Helios" passHref>
                  <a target="_blank" className="mt-2 flex flex-row items-center text-sm dark:text-white text-black">
                      powered by
                      <div className="flex items-center object-contain h-6 w-14 ml-1">
                          <Image
                              src={HeliosLogo}
                              alt="Logo of Helios"
                              priority
                              placeholder="blur"
                          />
                      </div>
                  </a>
            </Link>*/}
        </div>
        <div className="flex flex-col dark:text-white text-neutral-600 hover:-translate-y-1 ease-in-out transition-all">
          <span className="uppercase dark:text-neutral-400 text-black font-bold">
            Pages
          </span>
          <Link href="/" passHref>
            <a
              href="#"
              className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out"
            >
              Home
            </a>
          </Link>
          <Link href="http://ui.notal.app/?path=/docs/changelog--page" passHref>
            <a
              className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out"
              about="_blank"
              rel="noreferrer"
            >
              Changelog
            </a>
          </Link>
          {/*<a href="#" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
              Tutorial
          </a>*/}
          {/*<a href="#" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
              Behind The Scenes
          </a>*/}
        </div>
        <div className="flex flex-col dark:text-white text-neutral-600  hover:-translate-y-1 ease-in-out transition-all">
          <span className="uppercase dark:text-neutral-400 text-black font-bold">
            Legal
          </span>
          <Link href="/privacy-policy" passHref>
            <a className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
              Privacy Policy
            </a>
          </Link>
          <a
            href="mailto:erenkulaksz@gmail.com"
            className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out"
          >
            Contact
          </a>
        </div>
      </div>
      <div className="w-full mt-10 flex flex-row justify-between hover:-translate-y-1 ease-in-out transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 align-center">
          <Tooltip content="Twitter" direction="right">
            <a
              href="https://twitter.com/notalapp"
              target="_blank"
              rel="noreferrer"
              className="flex flex-row gap-2 items-center"
            >
              <TwitterIcon
                width={18}
                height={18}
                style={{ color: "currentColor" }}
              />
              <span className="dark:text-white text-neutral-500 flex sm:hidden text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                Twitter
              </span>
            </a>
          </Tooltip>
          <Tooltip content="Github" direction="right">
            <a
              href="https://github.com/erenkulaksiz/notal"
              target="_blank"
              rel="noreferrer"
              className="flex flex-row gap-2 items-center"
            >
              <Github2Icon
                width={18}
                height={18}
                style={{ color: "currentColor" }}
              />
              <span className="dark:text-white text-neutral-500 flex sm:hidden text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                Github
              </span>
            </a>
          </Tooltip>
          <Tooltip content="Storybook" direction="right">
            <a
              href="https://ui.notal.app"
              target="_blank"
              rel="noreferrer"
              className="flex flex-row gap-2 items-center"
            >
              <Image
                src={StorybookLogo}
                width={18}
                height={18}
                alt="Storybook Logo"
                className="dark:bg-white"
              />
              <span className="dark:text-white text-neutral-500 flex sm:hidden text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                Storybook
              </span>
            </a>
          </Tooltip>
          {process.env.NEXT_PUBLIC_DEBUG_LOG == "true" && (
            <span className="uppercase mt-8 sm:mt-0 text-xs text-neutral-400 text-left">
              Development build {CONSTANTS.APP_VERSION.toString()}
            </span>
          )}
        </div>
        <div className="flex items-end text-neutral-400 sm:text-md text-xs text-right">
          © 2022 notal.app, All Rights Reserved.
        </div>
      </div>
    </motion.footer>
  );
}
