import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import { Modal, Button, Loading } from "@components";
import { GoogleIcon, GithubIcon, EmailIcon } from "@icons";
import { Log } from "@utils/logger";
import { useAuth } from "@hooks";
import type { PlatformLoginTypes } from "@types";
import type { LoginModalProps } from "./LoginModal.d";

const PlatformLogins = {
  google: {
    icon: (
      <GoogleIcon width={24} height={24} fill="currentColor" className="ml-2" />
    ),
    text: "Google",
    id: "google",
  },
  github: {
    icon: <GithubIcon size={24} fill="currentColor" className="ml-2" />,
    text: "Github",
    id: "github",
  },
  /*
  email: {
    icon: <EmailIcon size={24} fill="currentColor" className="ml-2" />,
    text: "E-mail",
    id: "email",
  },
  */
} as PlatformLoginTypes;

export function LoginModal({ open, onClose, onLoginSuccess }: LoginModalProps) {
  const { resolvedTheme } = useTheme();
  const [oauthError, setOauthError] = useState<string | boolean>("");
  const auth = useAuth();

  useEffect(() => {
    if (auth?.authUser && open) {
      close();
    }
  }, [auth?.authUser]);

  const onLoginWithPlatform = async (platform: string) => {
    Log.debug(`trying to login with platform ${platform}`);
    const login = await auth?.login?.platform(platform);
    if (
      login?.authError?.errorCode ==
      "auth/account-exists-with-different-credential"
    ) {
      setOauthError(
        `This account exist with different credentials. Please try another method.`
      );
      return;
    } else if (login?.authError?.errorCode == "auth/user-disabled") {
      setOauthError(
        `Your account has been disabled. Sorry for the inconvenience.`
      );
      return;
    }
    onLoginSuccess();
  };

  const close = () => {
    setOauthError(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => !auth?.authLoading && close()}
      animate
      className="w-[90%] sm:w-[440px]"
      closeBtn={!auth?.authLoading}
    >
      {auth?.authLoading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <Loading size="xl" />
          <span className="mt-4 text-lg">Signing in...</span>
          <span className="text-sm dark:text-neutral-600 text-neutral-400">
            complete sign-in process inside the popup
          </span>
        </div>
      ) : (
        <>
          <Modal.Title animate>
            <div className="w-full flex flex-col justify-center items-center pt-6">
              {typeof resolvedTheme != "undefined" && (
                <div className="w-40 h-8 object-contain">
                  <Image
                    src={resolvedTheme == "dark" ? IconWhite : IconGalactic}
                    alt="Logo of Notal"
                    priority
                    placeholder="blur"
                  />
                </div>
              )}
              <span className="text-lg sm:text-2xl text-center font-medium mt-6 text-black dark:text-white">
                Sign up on Notal using...
              </span>
            </div>
          </Modal.Title>
          <Modal.Body className="px-4 pt-6 items-center sm:px-8" animate>
            <div className="flex flex-col gap-2 pb-2 w-full">
              {Object.keys(PlatformLogins).map((platform) => {
                const currPlatform =
                  PlatformLogins[platform as keyof PlatformLoginTypes];
                return (
                  <Button
                    onClick={() => onLoginWithPlatform(currPlatform.id)}
                    size="lg"
                    className="text-[1.2em]"
                    gradient
                    fullWidth
                    icon={currPlatform.icon}
                    key={currPlatform.id}
                    aria-label={`Sign in with ${currPlatform.text}`}
                  >
                    {currPlatform.text}
                  </Button>
                );
              })}
            </div>
            {oauthError && (
              <span className="text-red-600 text-center">{oauthError}</span>
            )}
          </Modal.Body>
          <Modal.Footer className="items-center pb-2 px-4 sm:px-8" animate>
            <span className="text-neutral-500 text-sm text-center">
              {
                "We'll never post to any of your accounts without your permission. More info on"
              }{" "}
              <Link href="/privacy-policy" passHref>
                <a className="text-blue-600 underline underline-offset-2">
                  Privacy Policy
                </a>
              </Link>
            </span>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
