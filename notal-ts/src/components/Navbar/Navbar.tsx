import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import IconWhiteMobile from "@public/logo_white_mobile.webp";
import IconGalacticMobile from "@public/logo_galactic_mobile.webp";
import { Button, Tooltip, Loading } from "@components";
import { UserIcon, LogoutIcon, LoginIcon, ArrowDownIcon } from "@icons";
import { LocalSettings } from "@utils/localStorage";
import { useAuth, useWorkspace } from "@hooks";
import { ThemeSwitcher, WorkspaceOwnerProfile, Dropdown } from "./components";
import type { NavbarProps } from "./Navbar.d";
import type { LoginModalProps } from "@components/Modals/LoginModal/LoginModal.d";

const LoginModal = dynamic<LoginModalProps>(() =>
  import("../Modals/LoginModal").then((mod) => mod.LoginModal)
);

export function Navbar({
  showCollapse = false,
  disableRightSide,
}: NavbarProps) {
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
    <>
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
        <div className="navbar-bg" />
        <div className="w-1/2 flex gap-2 items-center">
          {mounted ? (
            <Link href="/" passHref>
              <a>
                <div className="h-10 sm:flex hidden">
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
        {!disableRightSide && (
          <div className="w-1/2 gap-2 flex items-center justify-end">
            {workspaceLoading && (
              <div className="flex flex-row items-center justify-center p-1 dark:bg-neutral-800 bg-neutral-100 shadow rounded-lg px-3">
                <Loading size="md" />
                <span className="ml-2 text-sm sm:flex hidden">Loading...</span>
              </div>
            )}
            {auth?.authLoading || (auth?.authUser && !auth.validatedUser) ? (
              <Loading size="lg" />
            ) : auth?.authUser ? (
              <Dropdown />
            ) : (
              <>
                <div className="flex flex-row gap-2">
                  <ThemeSwitcher />
                  <div className="hidden sm:flex">
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
                  </div>
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
        )}
      </motion.nav>
      <LoginModal
        open={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onLoginSuccess={() => {
          setLoginModalVisible(false);
          setTimeout(() => router.replace(router.asPath), 1000);
        }}
      />
    </>
  );
}
