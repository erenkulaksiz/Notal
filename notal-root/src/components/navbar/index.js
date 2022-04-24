import { useState, useEffect } from "react";
import { useTheme } from 'next-themes';
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";

import BuildComponent from "@utils/buildComponent";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import IconWhiteMobile from "@public/logo_white_mobile.webp";
import IconGalacticMobile from "@public/logo_galactic_mobile.webp";

import { isClient } from "@utils";

import {
    UserIcon,
    LogoutIcon,
    DarkIcon,
    LightIcon,
    LoginIcon,
    HomeFilledIcon,
    ArrowDownIcon
} from "@icons";
import {
    Button,
    LoginModal,
    Switch,
    Loading,
    Tooltip,
    Checkbox
} from "@components";
import useAuth from "@hooks/auth";
import LocalSettings from "@utils/localstorage";
import Log from "@utils/logger";

const Navbar = ({
    user,
    showHomeButton = false,
    validating = false,
    workspace,
    showCollapse = false,
}) => {
    const { isOwner, _workspace, loadingWorkspace, } = workspace ?? {};

    const { resolvedTheme, setTheme } = useTheme();
    const router = useRouter();
    const auth = useAuth();

    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [navbarCollapse, setNavbarCollapse] = useState(undefined);

    const onNavbarCollapse = () => {
        LocalSettings.set("navbarCollapsed", !navbarCollapse);
        setNavbarCollapse(!navbarCollapse);
    }

    const BuildWorkspaceOwnerProfileContainer = BuildComponent({
        name: "Workspace Owner Profile Container",
        defaultClasses: "flex flex-row ml-2 z-40 rounded-lg p-2 dark:bg-neutral-800/80 bg-neutral-200/80",
        conditionalClasses: [{ true: "left-[4.3rem]", false: "left-4" }],
        selectedClasses: [isOwner]
    });

    useEffect(() => {
        if (!showCollapse) return setNavbarCollapse(false);

        const navbarCollapsed = LocalSettings.get("navbarCollapsed");
        if (typeof navbarCollapsed == "undefined") {
            LocalSettings.set("navbarCollapsed", false);
            setNavbarCollapse(false);
        } else {
            setNavbarCollapse(navbarCollapsed);
        }
    }, []);

    const WorkspaceOwnerProfile = () => !workspace?.notFound && !loadingWorkspace && _workspace?.data?.ownerUser?.username ? <div className={BuildWorkspaceOwnerProfileContainer.classes}>
        <div className="flex flex-col w-full">
            <span className="text-sm break-words w-full">
                {_workspace?.data?.title}
            </span>
            {_workspace?.data?.desc && <span className="text-xs text-neutral-600 dark:text-neutral-400 break-words w-full">
                {_workspace?.data?.desc}
            </span>}
        </div>
        {!isOwner && <Link href="/profile/[username]" as={`/profile/${_workspace?.data?.ownerUser?.username || "not-found"}`} passHref>
            <a className="flex flex-row items-center ml-2 min-w-max">
                <div className="p-[2px] w-7 h-7 rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
                    <img
                        src={_workspace?.data?.ownerUser?.avatar}
                        className="w-7 h-6 rounded-full border-[2px] dark:border-black border-white"
                    />
                </div>
                <div className="flex flex-col ml-1">
                    <span className="text-md h-4">
                        {_workspace?.data?.ownerUser?.fullname ? `${_workspace?.data?.ownerUser?.fullname}` : `@${_workspace?.data?.ownerUser?.username}`}
                    </span>
                    {_workspace?.data?.ownerUser?.fullname && <span className="text-sm text-neutral-600">
                        {`@${_workspace?.data?.ownerUser?.username}`}
                    </span>}
                </div>
            </a>
        </Link>}
    </div> : null;

    return (typeof navbarCollapse == "undefined" && showCollapse ? null : <motion.nav
        variants={{
            hidden: { height: 0, y: -60, paddingTop: 0, paddingBottom: 0 },
            show: { height: 60, y: 0, },
        }}
        initial={navbarCollapse ? "hidden" : "show"}
        animate={navbarCollapse ? "hidden" : "show"}
        transition={{ type: "sticky", stifness: 500 }}
        className="flex sticky flex-row p-4 top-0 z-50 max-h-16 w-full"
    >
        <div className="absolute left-0 right-0 top-0 bottom-0 dark:bg-black/30 bg-white/30 backdrop-blur-md -z-10 shadow-none dark:shadow-md" />
        <div className="w-1/2 flex items-center">
            {typeof resolvedTheme != "undefined" && <Link href={auth?.authUser ? "/home" : "/"} passHref>
                <a className="">
                    <div className="h-10 sm:flex w-40 hidden">
                        <Image
                            src={resolvedTheme == "dark" ? IconWhite : IconGalactic}
                            alt="Logo of Notal"
                            priority
                            placeholder="blur"
                            className="object-contain"
                        />
                    </div>
                    <div className="h-10 w-12 sm:hidden flex">
                        <Image
                            src={resolvedTheme == "dark" ? IconWhiteMobile : IconGalacticMobile}
                            alt="Logo of Notal"
                            priority
                            placeholder="blur"
                            className="object-contain"
                        />
                    </div>
                </a>
            </Link>}
            <WorkspaceOwnerProfile />
            {showCollapse && <motion.div
                variants={{
                    hidden: { y: 70, },
                    show: { y: 0, zIndex: 100 },
                }}
                animate={navbarCollapse ? "hidden" : "show"}
                transition={{ type: "tween", }}
                className="ml-2"
            >
                <Tooltip content={navbarCollapse ? "Show Navbar" : "Hide Navbar"} direction="bottom">
                    <motion.div
                        variants={{
                            hidden: { rotate: 0, },
                            show: { rotate: 180 },
                        }}
                        initial={navbarCollapse ? "hidden" : "show"}
                        animate={navbarCollapse ? "hidden" : "show"}
                        transition={{ type: "tween" }}
                    >
                        <Button
                            className="px-0 h-6 w-6 dark:bg-neutral-800 bg-neutral-100 fill-black dark:fill-white shadow-xl"
                            onClick={() => onNavbarCollapse()}
                            light="hover:bg-neutral-300 hover:dark:bg-neutral-700 focus:dark:bg-neutral-600 focus:bg-neutral-400"
                        >
                            <ArrowDownIcon size={24} fill="currentFill" />
                        </Button>
                    </motion.div>
                </Tooltip>
            </motion.div>}
            {showHomeButton && <motion.div
                variants={{
                    hidden: { y: 70, opacity: 1, display: "flex", },
                    show: { y: 0, opacity: 0, transitionEnd: { display: "none" } },
                }}
                initial={navbarCollapse ? "hidden" : "show"}
                animate={navbarCollapse ? "hidden" : "show"}
                transition={{ type: "tween" }}
            >
                <Link href="/home" passHref>
                    <Button
                        className="ml-1 px-0 h-6 w-6 dark:bg-neutral-800 bg-neutral-100 fill-black dark:fill-white shadow-xl"
                        light="hover:bg-neutral-300 hover:dark:bg-neutral-700 focus:dark:bg-neutral-600 focus:bg-neutral-400"
                        as="a"
                        title="Home"
                        aria-label="Home"
                    >
                        <HomeFilledIcon size={24} fill="currentFill" style={{ transform: "scale(.7)" }} />
                    </Button>
                </Link>
            </motion.div>}
        </div >
        <div className="w-1/2 flex items-center justify-end">
            {(validating) && <div className="flex flex-row items-center justify-center p-1 dark:bg-neutral-800 bg-neutral-100 shadow rounded-lg mr-2 px-3">
                <Loading size="md" />
                <span className="ml-2 text-sm sm:flex hidden">Loading...</span>
            </div>}
            {(showHomeButton && (auth.authUser/* || user*/)) && !validating && <Link href="/home" passHref>
                <Button
                    light
                    size="sm"
                    className="mr-2"
                    as="a"
                    title="Home"
                    aria-label="Home"
                >
                    <span className="w-full justify-end flex items-center dark:text-white text-black">
                        <HomeFilledIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />
                        Home
                    </span>
                </Button>
            </Link>}
            {(!auth.authUser && isClient) && <Tooltip
                content="Change Theme"
                direction="bottom"
                allContainerClassName="mr-2"
            >
                <Switch
                    onChange={e => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    value={resolvedTheme == "dark"}
                    icon={resolvedTheme == "dark" ? <LightIcon size={24} fill="black" style={{ transform: "scale(0.7)" }} /> : <DarkIcon size={24} fill="black" style={{ transform: "scale(0.7)" }} />}
                    role="switch"
                    id="changeTheme"
                />
            </Tooltip>}
            {(!auth.authLoading && auth?.authUser) || user ? <details className="relative inline-block bg-transparent">
                <summary
                    style={{
                        userSelect: "none",
                        listStyle: "none"
                    }}
                >
                    <div className="p-[2px] w-10 h-10 rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
                        <img
                            src={user?.avatar}
                            className="w-10 h-9 rounded-full border-[2px] dark:border-black border-white"
                            alt="Avatar"
                        />
                    </div>
                </summary>
                <div className="p-4 absolute top-full rounded-lg right-0 dark:bg-neutral-900/70 filter backdrop-blur-sm bg-white/70 shadow-2xl w-60" style={{ zIndex: 999 }}>
                    {isClient && <div className="flex flex-row items-center">
                        <Switch
                            onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            value={resolvedTheme == "dark"}
                            icon={resolvedTheme == "dark" ? <LightIcon size={24} fill="black" style={{ transform: "scale(0.7)" }} /> : <DarkIcon size={24} fill="black" style={{ transform: "scale(0.7)" }} />}
                            role="switch"
                            id="changeTheme"
                        />
                        <span className="ml-2 text-xs dark:text-neutral-600 text-neutral-300">{`v${process.env.NEXT_PUBLIC_APP_VERSION}`}</span>
                    </div>}
                    <h2 className="text-current font-bold text-xl mt-1" title={user?.uid}>
                        {user?.fullname ? user?.fullname : user?.username ? "@" + user?.username : "..."}
                    </h2>
                    {user?.fullname && <h3 className="dark:text-neutral-400 text-neutral-500" title={user?.uid}>@{user?.username}</h3>}
                    <h4 className="text-current text-md">{user?.email}</h4>
                    <Button
                        fullWidth
                        className="mt-2"
                        icon={<UserIcon size={24} fill="white" className="ml-2" />}
                        gradient
                        aria-label="Profile Button"
                    >
                        <span>Profile</span>
                    </Button>
                    <Button
                        fullWidth
                        className="mt-2"
                        icon={<LogoutIcon size={24} fill="white" className="ml-2" />}
                        gradient
                        aria-label="Sign Out Button"
                        onClick={async () => {
                            await auth.users.logout();
                            setTimeout(() => {
                                router.replace(router.asPath);
                            }, 1000);
                        }}
                    >
                        <span>Sign Out</span>
                    </Button>
                </div>
            </details> : <div className="flex flex-row">
                <Button
                    light
                    className="w-16 px-0 mr-2"
                    size="sm"
                    onClick={() => setLoginModalVisible(true)}
                    aria-label="Sign up button"
                >
                    <span className="dark:text-neutral-400 text-neutral-600 font-medium">Sign Up</span>
                </Button>
                <Button
                    gradient
                    className="w-14 sm:w-32"
                    size="sm"
                    onClick={() => setLoginModalVisible(true)}
                    aria-label="Sign in button"
                >
                    <LoginIcon size={24} fill="currentColor" style={{ display: "flex", transform: "scale(0.8)" }} />
                    <span className="hidden sm:flex">Sign In</span>
                </Button>
            </div>}
            <style jsx>{`
            details[open] > summary:before {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 40;
                display: block;
                cursor: default;
                content: " ";
            }
            details > summary {
                list-style: none;
            }
            details > summary::-webkit-details-marker {
                display: none;
            }
            details > summary:first-of-type {
                list-style-type: none;
            }
            details > summary::marker {
                display: none;
            }
            `}</style>
        </div>
        {
            !auth.authUser && <LoginModal
                open={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
                onLoginSuccess={() => {
                    setTimeout(() => {
                        setLoginModalVisible(false);
                        router.replace(router.asPath);
                    }, 1000);
                }}
            />
        }
    </motion.nav >)
}

export default Navbar;