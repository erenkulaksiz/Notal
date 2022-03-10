import Image from 'next/image';
import { useTheme } from 'next-themes';
import { CodeIcon, HeartIcon, TwitterIcon } from '@icons';
import Link from 'next/link';

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";

const LandingFooter = () => {
    const { resolvedTheme } = useTheme();

    return (<footer className="w-full pb-8 flex mt-24 flex-col z-20">
        <div className="h-0.5 dark:bg-neutral-700 bg-neutral-300 w-full rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-3 mt-8 gap-8 sm:gap-4">
            <div className="flex flex-col">
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
                    <a href="https://github.com/erenkulaksiz" target="_blank" rel="noreferrer" className="ml-1">
                        @Eren Kulaksiz
                    </a>
                </span>
            </div>
            <div className="flex flex-col">
                <span className="uppercase dark:text-neutral-400 font-bold">Pages</span>
                <a href="#" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                    Home
                </a>
                <a href="#" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                    Tutorial
                </a>
                <a href="#" className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                    Behind The Scenes
                </a>
            </div>
            <div className="flex flex-col">
                <span className="uppercase dark:text-neutral-400 font-bold">Legal</span>
                <Link href="/cookies" passHref>
                    <a className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                        Cookies
                    </a>
                </Link>
                <Link href="/privacy-policy" passHref>
                    <a className="uppercase mt-2 text-sm cursor-pointer hover:opacity-60 transition-opacity ease-in-out">
                        Privacy Policy
                    </a>
                </Link>
            </div>
        </div>
        <div className="w-full mt-10 flex flex-row justify-between">
            <div className="flex items-center">
                <a href="https://twitter.com/notalapp" target="_blank" rel="noreferrer">
                    <TwitterIcon width={18} height={18} style={{ color: "currentColor" }} />
                </a>
            </div>
            <div className="flex items-center text-neutral-400">
                © 2022 notal.app, All Rights Reserved.
            </div>
        </div>
    </footer>)
}

export default LandingFooter;