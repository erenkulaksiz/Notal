import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import { Modal, Button, Loading } from "@components";
import { GoogleIcon, GithubIcon } from "@icons";
import { Log } from "@utils/logger";
import { useAuth } from "@hooks";
import type { LoginModalProps } from "./LoginModal.d";

export function LoginModal({ open, onClose, onLoginSuccess }: LoginModalProps) {
  const { resolvedTheme } = useTheme();
  const [oauthError, setOauthError] = useState("");
  const auth = useAuth();

  useEffect(() => {
    if (auth?.authUser && open) {
      onClose();
    }
  }, [auth?.authUser]);

  const onLoginWithGoogle = async () => {
    Log.debug("trying to login with google");
    const login = await auth?.login?.google();
    if (
      login?.authError?.errorCode ==
      "auth/account-exists-with-different-credential"
    ) {
      setOauthError(
        `This account exist with different credential. Please try another method.`
      );
      return;
    } else if (login?.authError?.errorCode == "auth/user-disabled") {
      setOauthError(
        `Your account has been disabled. Sorry for the inconvenience.`
      );
      return;
    } /*else if (login?.authError?.errorCode == "auth/popup-closed-by-user") {

      return;
    }*/
    onLoginSuccess();
  };

  const onLoginWithGithub = async () => {
    /*
    const login = await auth.login.github();
    Log.debug("github login errors:", login.authError);
    if (
      login?.authError?.errorCode ==
      "auth/account-exists-with-different-credential"
    ) {
      setOauthError(
        `This account exist with different credential. Please try another method.`
      );
      return;
    } else if (login?.authError?.errorCode == "auth/user-disabled") {
      setOauthError(
        `Your account has been disabled. Sorry for the inconvenience.`
      );
      return;
    }
    onLoginSuccess();
    */
  };

  return (
    <Modal
      open={open}
      onClose={() => !auth?.authLoading && onClose()}
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
              <span className="text-2xl font-medium mt-8 text-black dark:text-white">
                Sign up on Notal
              </span>
            </div>
          </Modal.Title>
          <Modal.Body className="p-4 items-center" animate>
            <div className="flex flex-col gap-2 pb-2 w-full sm:px-8">
              <Button
                onClick={() => onLoginWithGoogle()}
                size="lg"
                className="text-[1.2em]"
                gradient
                fullWidth
                icon={
                  <GoogleIcon
                    width={24}
                    height={24}
                    fill="currentColor"
                    className="ml-2"
                  />
                }
                aria-label="Sign in with Google"
              >
                Google
              </Button>
              <Button
                onClick={() => {}}
                size="lg"
                className="text-[1.2em]"
                gradient
                fullWidth
                icon={
                  <GithubIcon size={24} fill="currentColor" className="ml-2" />
                }
                aria-label="Sign in with GitHub"
              >
                GitHub
              </Button>
            </div>
            <span className="text-neutral-500 text-sm text-center mt-2">
              {
                "We'll never post to any of your accounts without your permission. More info on"
              }{" "}
              <Link href="/privacy-policy" passHref>
                <a className="text-blue-600 underline underline-offset-2">
                  Privacy Policy
                </a>
              </Link>
            </span>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
}
