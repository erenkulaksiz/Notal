import { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@components";
import { CheckIcon, CookieIcon } from "@icons";
import { LocalSettings } from "@utils/localStorage";

export function AcceptCookies() {
  const [renderCookies, setRenderCookies] = useState(false);

  useEffect(() => {
    setRenderCookies(LocalSettings.get("cookies") != true);
  }, []);

  function onAccept() {
    //Cookies.set('cookies', 'true');
    setRenderCookies(false);
    LocalSettings.set("cookies", true);
  }

  if (!renderCookies) return null;

  return (
    <div
      className="fixed bottom-4 left-4 flex flex-col items-start w-64 bg-white/50 dark:bg-neutral-900/50 text-black dark:text-white backdrop-blur-md p-4 rounded-xl drop-shadow-2xl"
      style={{ zIndex: 500 }}
    >
      <div className="text-xl mb-1 font-semibold flex flex-row items-center">
        <CookieIcon size={24} fill="currentColor" />
        <h1 className="ml-1">Cookies</h1>
      </div>
      <p className="text-sm">
        {
          "We use cookies to authenticate, analyze traffic and show personalized content. By clicking 'Accept Cookies' or continuing using this website you accept our use of cookies."
        }
        <Link href="/privacy-policy" passHref>
          <a className="ml-1 text-blue-600">More Information</a>
        </Link>
      </p>
      <Button
        fullWidth
        gradient
        icon={<CheckIcon size={24} fill="currentColor" className="ml-2" />}
        className="mt-2"
        onClick={() => onAccept()}
      >
        Accept Cookies
      </Button>
    </div>
  );
}
