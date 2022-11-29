import { useRouter } from "next/router";

import { LogoutIcon } from "@icons";
import { useAuth } from "@hooks";
import { Button } from "@components";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { CONSTANTS } from "@constants";

export function Dropdown() {
  const auth = useAuth();
  const router = useRouter();

  return (
    <>
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
                auth?.validatedUser
                  ? auth.validatedUser.avatar
                  : "http://cdn.onlinewebfonts.com/svg/img_258083.png"
              }
              className="w-10 h-9 rounded-full border-[2px] dark:border-black border-white"
              alt="Avatar"
            />
          </div>
        </summary>
        <div
          className="flex flex-col p-4 absolute top-full rounded-xl right-0 dark:bg-neutral-900/70 filter backdrop-blur-sm bg-white/70 border-2 border-neutral-400/30 dark:border-neutral-800/50 shadow-2xl w-60"
          style={{ zIndex: 999 }}
        >
          <div className="flex flex-row items-center">
            <ThemeSwitcher />
            <span className="ml-1 text-xs dark:text-neutral-600 text-neutral-400 break-words">{`v${CONSTANTS.APP_VERSION}`}</span>
          </div>
          <span
            className="text-current font-bold text-xl break-words"
            title={auth?.validatedUser?.uid}
          >
            {auth?.validatedUser && auth.validatedUser.fullname}
          </span>
          <span
            className="dark:text-neutral-400 text-neutral-500 w-full break-words"
            title={auth?.validatedUser?.uid}
          >
            @{auth?.validatedUser && auth.validatedUser.username}
          </span>
          <span className="text-current text-md break-words">
            {auth?.validatedUser && auth.validatedUser.email}
          </span>
          <div className="mt-2 flex flex-col gap-2">
            {/*<Button
              fullWidth
              icon={<UserIcon size={24} fill="white" className="ml-2" />}
              gradient
              aria-label="Profile Button"
            >
              <span>Profile</span>
            </Button>*/}
            <Button
              fullWidth
              icon={<LogoutIcon size={24} fill="white" className="ml-2" />}
              gradient
              aria-label="Sign Out Button"
              onClick={() => {
                auth?.login?.logout();
                router.reload();
              }}
            >
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </details>
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
    </>
  );
}
