import { useState } from "react";
import { useTheme } from 'next-themes';
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";

import { isClient } from "@utils";

import {
    UserIcon,
    LogoutIcon,
    DarkIcon,
    LightIcon,
    LoginIcon,
    HomeFilledIcon
} from "@icons";
import {
    Button,
    LoginModal,
    Switch,
    Loading,
} from "@components";
import useAuth from "@hooks/auth";

const Navbar = ({
    user,
    showHomeButton = false,
    validating = false
}) => {
    const { resolvedTheme, setTheme } = useTheme();
    const router = useRouter();
    const auth = useAuth();

    const [modalVisible, setModalVisible] = useState(false);

    return (<nav className="p-3 flex flex-row sticky top-0 z-40">
        <div className="absolute top-0 bottom-0 right-0 left-0 dark:bg-black/50 bg-white/50 backdrop-blur-md -z-10 shadow-none dark:shadow-md" />
        <div className="w-1/2 flex items-start">
            {typeof resolvedTheme != "undefined" && <Link href={auth?.authUser ? "/home" : "/"} passHref>
                <a className="w-auto">
                    <div className="object-contain max-h-max w-40">
                        <Image
                            src={resolvedTheme == "dark" ? IconWhite : IconGalactic}
                            alt="Logo of Notal"
                            priority
                            placeholder="blur"
                        />
                    </div>
                </a>
            </Link>}
        </div>
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
                >
                    <span className="w-full justify-end flex items-center dark:text-white text-black">
                        <HomeFilledIcon size={24} fill="currentColor" style={{ transform: "scale(0.8)" }} />
                        Home
                    </span>
                </Button>
            </Link>}
            {(!auth.authUser && !auth.authLoading && isClient) && <Switch
                onChange={e => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                value={resolvedTheme == "dark"}
                icon={resolvedTheme == "dark" ? <LightIcon size={24} fill="black" style={{ transform: "scale(0.7)" }} /> : <DarkIcon size={24} fill="black" style={{ transform: "scale(0.7)" }} />}
                className="mr-2"
                role="switch"
                id="changeTheme"
            />}
            {(!auth.authLoading && auth?.authUser) || user ? <details className="relative inline-block bg-transparent">
                <summary
                    style={{
                        userSelect: "none",
                        listStyle: "none"
                    }}>
                    <div className="p-[2px] w-10 h-10 rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
                        <img
                            src={user?.avatar}
                            className="w-10 h-9 rounded-full border-[2px] dark:border-black border-white"
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
                        <span className="ml-2 text-xs dark:text-neutral-600 text-neutral-300">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
                    </div>}
                    <h2 className="text-current font-bold text-xl">{user?.fullname ? user?.fullname : user?.username ? "@" + user?.username : "..."}</h2>
                    <h4 className="text-current text-md">{user?.email}</h4>
                    <Button fullWidth className="mt-2" icon={<UserIcon size={24} fill="white" />} gradient aria-label="Profile Button">
                        <span>Profile</span>
                    </Button>
                    <Button fullWidth className="mt-2" icon={<LogoutIcon size={24} fill="white" />} gradient aria-label="Sign Out Button"
                        onClick={async () => {
                            await auth.users.logout();
                            router.replace(router.asPath);
                        }}
                    >
                        <span>Sign Out</span>
                    </Button>
                </div>
            </details> : <Button gradient className="w-14 sm:w-32" size="sm" onClick={() => setModalVisible(true)} aria-label="Sign up or sign in button">
                <LoginIcon size={24} fill="currentColor" style={{ display: "flex", transform: "scale(0.8)" }} />
                <span className="hidden sm:flex">Sign Up/In</span>
            </Button>}
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
        {!auth.authUser && <LoginModal
            open={modalVisible}
            onClose={() => setModalVisible(false)}
            onLoginSuccess={() => {
                setTimeout(() => {
                    setModalVisible(false);
                    router.replace(router.asPath);
                }, 1000);
            }}
        />}
    </nav>)
}

export default Navbar;