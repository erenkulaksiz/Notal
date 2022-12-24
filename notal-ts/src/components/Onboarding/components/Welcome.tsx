import { ReactNode } from "react";
import Image from "next/image";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import { BoltIcon } from "@icons";

export function Welcome() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="sm:text-4xl text-2xl font-bold flex flex-row items-center">
        <span>Welcome to Notal.</span>
      </div>
      <div className="flex flex-row items-center mt-2">
        <div>
          <BoltIcon
            width={24}
            height={24}
            viewBox="0 0 50 50"
            fill="currentColor"
          />
        </div>
        <div>
          <p className="sm:text-lg">
            Notal is a simple, open source task management and devrels platform
            from the future.
          </p>
        </div>
      </div>
      <p className="sm:text-lg">
        Im taking Notal each day far away in terms of features and design.
      </p>
      <p className="sm:text-lg">
        You can track your projects, tasks, and notes in one place.
      </p>
      <div className="flex h-full items-center justify-center">
        <img
          src="/onboarding_thumb_light.png"
          className="object-contain w-full h-[200px] sm:h-[300px] dark:flex hidden"
        />
        <img
          src="/onboarding_thumb_dark.png"
          className="object-contain w-full h-[200px] sm:h-[300px] dark:hidden flex"
        />
      </div>
      <span>
        Lets go trough about how to create a workspace and then adding things to
        it.
      </span>
    </div>
  );
}
