import Image from 'next/image';
import { useTheme } from 'next-themes';
import { CodeIcon, HeartIcon, TwitterIcon } from '@icons';

const LandingFooter = () => {
    const { resolvedTheme } = useTheme();

    return (<footer className="w-full pb-8 flex mt-24 flex-col z-20">
        <div className="h-0.5 dark:bg-neutral-700 bg-neutral-200 w-full rounded-full" />
        <div className="grid grid-cols-2 sm:grid-cols-3 mt-8 gap-4">
            <div className="flex flex-col">
                {typeof resolvedTheme != "undefined" && <img
                    src={resolvedTheme == "dark" ? "./icon_white.png" : "./icon_galactic.png"}
                    alt="Logo of Notal"
                    style={{ width: 80, height: 20, objectFit: "contain" }}
                />}
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