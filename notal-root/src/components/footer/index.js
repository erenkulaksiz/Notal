import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { CodeIcon, HeartIcon, TwitterIcon } from '@icons';

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import HeliosLogo from "@public/helios_logo.png"
import BuildComponent from '@utils/buildComponent';

import { isClient } from '@utils';
import { Tooltip } from '@components';

const Footer = ({ className }) => {
    const { resolvedTheme } = useTheme();
    const [isInView, setInView] = useState(false);

    const BuildFooter = BuildComponent({
        name: "Footer",
        defaultClasses: "w-full pb-8 flex flex-col z-20",
        extraClasses: className
    });

    return (<motion.footer
        className={BuildFooter.classes}
        animate={isInView ? "show" : "hidden"}
        /*variants={{
            hidden: { y: isClient ? 50 : 0 },
            show: { y: 0 },
        }}*/
        onViewportEnter={(e) => setInView(true)}
    //onViewportLeave={(e) => setInView(false)}
    >
        <div className="h-0.5 dark:bg-neutral-700/70 bg-neutral-300/70 w-full rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-3 mt-8 gap-8 sm:gap-4">
            <motion.div
                variants={{
                    hidden: { y: isClient ? -50 : 0, opacity: isClient ? 0 : 1 },
                    show: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, mass: .50 } },
                }}
                className="flex flex-col"
            >
                {typeof resolvedTheme != "undefined" && <div className="w-32 h-8 object-contain">
                    <Image
                        src={resolvedTheme == "dark" ? IconWhite : IconGalactic}
                        alt="Logo of Notal"
                        priority
                        placeholder="blur"
                    />
                </div>}
                <span className="mt-4 text-sm dark:text-neutral-300 text-neutral-500">Create workspaces, manage your projects.</span>
                <span className="flex flex-row text-xs items-center mt-2 dark:text-neutral-400 text-neutral-400">
                    <CodeIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />
                    <span>with</span>
                    <HeartIcon size={24} className="fill-red-500" style={{ transform: "scale(0.8)" }} />
                    <span>by</span>
                    <Tooltip direction="right" content={<span className="text-xs">GitHub</span>}>
                        <Link href="https://github.com/erenkulaksiz" passHref>
                            <a target="_blank" rel="noreferrer" className="ml-1">
                                @Eren Kulaksiz
                            </a>
                        </Link>
                    </Tooltip>
                </span>

                <Link href="https://github.com/erenkulaksiz/Helios" passHref>
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
                </Link>
            </motion.div>
            <motion.div
                variants={{
                    hidden: { y: isClient ? -50 : 0, opacity: isClient ? 0 : 1 },
                    show: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, mass: .50, delay: .2 } },
                }}
                className="flex flex-col dark:text-white text-neutral-600"
            >
                <span className="uppercase dark:text-neutral-400 text-black font-bold">
                    Pages
                </span>
                <Link href="/" passHref>
                    <a href="#" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                        Home
                    </a>
                </Link>
                {/*<a href="#" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                    Tutorial
                </a>*/}
                {/*<a href="#" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                    Behind The Scenes
                </a>*/}
            </motion.div>
            <motion.div
                variants={{
                    hidden: { y: isClient ? -50 : 0, opacity: isClient ? 0 : 1 },
                    show: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, mass: .50, delay: .4 } },
                }}
                className="flex flex-col dark:text-white text-neutral-600"
            >
                <span className="uppercase dark:text-neutral-400 text-black font-bold">
                    Legal
                </span>
                <Link href="/privacy-policy" passHref>
                    <a className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                        Privacy Policy
                    </a>
                </Link>
                <a href="mailto:erenkulaksz@gmail.com" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                    Contact
                </a>
            </motion.div>
        </div>
        <div className="w-full mt-10 flex flex-row justify-between">
            <div className="flex items-center">
                <Tooltip content="Twitter @notalapp" direction="right">
                    <a href="https://twitter.com/notalapp" target="_blank" rel="noreferrer">
                        <TwitterIcon width={18} height={18} style={{ color: "currentColor" }} />
                    </a>
                </Tooltip>
            </div>
            <div className="flex items-center text-neutral-400">
                © 2022 notal.app, All Rights Reserved.
            </div>
        </div>
    </motion.footer>)
}

export default Footer;