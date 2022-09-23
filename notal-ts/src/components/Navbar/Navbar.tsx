import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import IconWhiteMobile from "@public/logo_white_mobile.webp";
import IconGalacticMobile from "@public/logo_galactic_mobile.webp";
import { Button, Tooltip, Loading, LoginModal } from "@components";
import { UserIcon, LogoutIcon, LoginIcon, ArrowDownIcon } from "@icons";
import { LocalSettings } from "@utils/localStorage";
import { useAuth, useWorkspace } from "@hooks";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { WorkspaceOwnerProfile } from "./components/WorkspaceOwnerProfile";
import type { NavbarProps } from "./Navbar.d";

export function Navbar({ showCollapse = false }: NavbarProps) {
  const { workspaceLoading } = useWorkspace();
  const auth = useAuth();
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState<boolean>(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [navbarCollapse, setNavbarCollapse] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!showCollapse) return setNavbarCollapse(false);
      const navbarCollapsed = LocalSettings.get("navbarCollapsed");
      setNavbarCollapse(navbarCollapsed);
    }
  }, [mounted]);

  function onNavbarCollapse() {
    LocalSettings.set("navbarCollapsed", !navbarCollapse);
    setNavbarCollapse(!navbarCollapse);
  }

  return (
    <motion.nav
      variants={{
        hidden: { height: 0, y: -60, paddingTop: 0, paddingBottom: 0 },
        show: { height: 60, y: 0 },
      }}
      initial={navbarCollapse ? "hidden" : "show"}
      animate={navbarCollapse ? "hidden" : "show"}
      transition={{ type: "sticky", stifness: 500 }}
      className="flex sticky flex-row p-4 top-0 z-50 max-h-16 w-full"
    >
      <div className="absolute left-0 right-0 top-0 bottom-0 dark:bg-black/30 bg-white/30 backdrop-blur-md -z-10 shadow-none dark:shadow-md" />
      <div className="w-1/2 flex items-center">
        {mounted ? (
          <Link href="/" passHref>
            <a className="">
              <div className="h-10 sm:flex w-40 hidden">
                <Image
                  src={resolvedTheme == "dark" ? IconWhite : IconGalactic}
                  alt="Logo of Notal"
                  priority
                  placeholder="blur"
                  className="object-contain"
                  width={150}
                  height={50}
                />
              </div>
              <div className="h-10 w-12 sm:hidden flex">
                <Image
                  src={
                    resolvedTheme == "dark"
                      ? IconWhiteMobile
                      : IconGalacticMobile
                  }
                  alt="Logo of Notal"
                  priority
                  placeholder="blur"
                  className="object-contain"
                  width={100}
                  height={50}
                />
              </div>
            </a>
          </Link>
        ) : (
          <div className="w-40 h-10 dark:bg-neutral-800 bg-neutral-200 animate-pulse" />
        )}
        <WorkspaceOwnerProfile />
        {showCollapse && (
          <motion.div
            variants={{
              hidden: { y: 70 },
              show: { y: 0, zIndex: 100 },
            }}
            animate={navbarCollapse ? "hidden" : "show"}
            transition={{ type: "tween" }}
            className="ml-2"
          >
            <Tooltip
              outline
              content={navbarCollapse ? "Show Navbar" : "Hide Navbar"}
              direction="bottom"
            >
              <motion.div
                variants={{
                  hidden: { rotate: 0 },
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
          </motion.div>
        )}
      </div>
      <div className="w-1/2 flex items-center justify-end">
        {workspaceLoading && (
          <div className="flex flex-row items-center justify-center p-1 dark:bg-neutral-800 bg-neutral-100 shadow rounded-lg mr-2 px-3">
            <Loading size="md" />
            <span className="ml-2 text-sm sm:flex hidden">Loading...</span>
          </div>
        )}
        {auth?.authLoading || (auth?.authUser && !auth.validatedUser) ? (
          <Loading size="lg" />
        ) : auth?.authUser ? (
          <details className="relative inline-block bg-transparent">
            <summary
              style={{
                userSelect: "none",
                listStyle: "none",
              }}
            >
              <div className="p-[2px] w-10 h-10 rounded-full cursor-pointer bg-gradient-to-tr from-blue-700 to-pink-700">
                <img
                  src={
                    auth.validatedUser
                      ? auth.validatedUser.avatar
                      : "http://cdn.onlinewebfonts.com/svg/img_258083.png"
                  }
                  className="w-10 h-9 rounded-full border-[2px] dark:border-black border-white"
                  alt="Avatar"
                />
              </div>
            </summary>
            <div
              className="p-4 absolute top-full rounded-lg right-0 dark:bg-neutral-900/70 filter backdrop-blur-sm bg-white/70 border-2 border-neutral-400/30 dark:border-neutral-800/50 shadow-2xl w-60"
              style={{ zIndex: 999 }}
            >
              <div className="flex flex-row items-center">
                <ThemeSwitcher />
                <span className="ml-1 text-xs dark:text-neutral-600 text-neutral-400 break-words">{`v${process.env.NEXT_PUBLIC_APP_VERSION}`}</span>
              </div>
              <h2
                className="text-current font-bold text-xl mt-1 break-words"
                title="uid"
              >
                {auth.validatedUser && auth.validatedUser.fullname}
              </h2>
              <h3
                className="dark:text-neutral-400 text-neutral-500 w-full break-words"
                title="uid"
              >
                @{auth.validatedUser && auth.validatedUser.username}
              </h3>
              <h4 className="text-current text-md break-words">
                {auth.validatedUser && auth.validatedUser.email}
              </h4>
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
                onClick={() => auth?.login?.logout()}
              >
                <span>Sign Out</span>
              </Button>
            </div>
          </details>
        ) : (
          <>
            <ThemeSwitcher />
            <div className="flex flex-row ml-2 gap-2">
              <Button
                light
                className="w-16 px-0"
                size="sm"
                onClick={() => setLoginModalVisible(true)}
                aria-label="Sign up button"
              >
                <span className="dark:text-neutral-400 text-neutral-600 font-medium">
                  Sign Up
                </span>
              </Button>
              <Button
                gradient
                className="w-14 sm:w-32"
                size="sm"
                onClick={() => setLoginModalVisible(true)}
                aria-label="Sign in button"
              >
                <LoginIcon
                  size={24}
                  fill="currentColor"
                  style={{ display: "flex", transform: "scale(0.8)" }}
                />
                <span className="hidden sm:flex">Sign In</span>
              </Button>
            </div>
          </>
        )}
      </div>
      <LoginModal
        open={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onLoginSuccess={() => {
          setLoginModalVisible(false);
          setTimeout(() => router.replace(router.asPath), 1000);
        }}
      />
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
    </motion.nav>
  );
}
