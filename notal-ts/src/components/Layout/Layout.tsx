import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { useAuth } from "@hooks";
import { CheckToken } from "@utils/api/checkToken";
import type { NotalRootProps } from "@types";

/**
 * Layout is a component that features in all pages root.
 * It is used to check if the user is logged in or not.
 */
export function Layout(props: NotalRootProps) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.authLoading) {
      (async () => {
        const token = await auth?.user?.getIdToken();
        const res = await CheckToken({
          token: token?.res,
          props,
          user: auth?.authUser,
        });
        if (!res) {
          setTimeout(() => router.replace(router.asPath), 1000);
        }
      })();
    }
  }, [auth?.authLoading]);

  useEffect(() => {
    if (props.validate && Cookies.get("auth")) {
      if (props.validate.success)
        auth && auth.setValidatedUser(props.validate.data);
    }
  }, [props.validate]);

  if (props.withoutLayout) return <>{props.children}</>;

  return (
    <main className="mx-auto transition-all overflow-x-hidden ease-in-out duration-300 overflow-auto dark:bg-black/50 bg-white h-full items-center w-full flex flex-col dark:text-white relative text-black">
      {props.children}
    </main>
  );
}
