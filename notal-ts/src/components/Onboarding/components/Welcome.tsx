import { ReactNode } from "react";
import Image from "next/image";

import IconWhite from "@public/icon_white.webp";
import IconGalactic from "@public/icon_galactic.webp";
import { BoltIcon } from "@icons";

export function Welcome() {
  return (
    <div className="flex flex-col">
      <div className="sm:text-4xl font-bold flex flex-row items-center">
        Welcome to
        <div className="h-4 sm:h-10 ml-2 dark:hidden flex">
          <Image
            src={IconGalactic}
            alt="Logo of Notal"
            priority
            placeholder="blur"
            className="object-contain"
            width={140}
            height={30}
          />
        </div>
        <div className="h-4 sm:h-10 ml-2 dark:flex hidden">
          <Image
            src={IconWhite}
            alt="Logo of Notal"
            priority
            placeholder="blur"
            className="object-contain"
            width={140}
            height={30}
          />
        </div>
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
      <img
        src="/onboarding_thumb_light.png"
        className="object-contain w-full h-[200px] sm:h-[400px] dark:flex hidden"
      />
      <img
        src="/onboarding_thumb_dark.png"
        className="object-contain w-full h-[200px] sm:h-[400px] dark:hidden flex"
      />
      <span>
        Lets go trough about how to create workspace and then adding things to
        that workspace.
      </span>
    </div>
  );
}
