import { useState } from "react";
import { BuildComponent } from "@utils/style/buildComponent";
import type { InputProps } from "./Input.d";

import { VisibleIcon, VisibleOffIcon } from "@icons";

export function Input({
  onChange,
  onEnterPress,
  value,
  fullWidth = false,
  placeholder,
  containerClassName,
  className,
  height = "h-11",
  textarea = false,
  rounded = true,
  autoFocus = false,
  icon,
  id,
  maxLength,
  passwordVisibility = false,
  type = "text",
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const InputElement = textarea ? "textarea" : "input";

  const BuildInputContainer = BuildComponent({
    name: "Input Container",
    defaultClasses: "h-11 flex flex-row relative items-center dark:text-white",
    extraClasses: containerClassName,
    conditionalClasses: [
      {
        true: "w-full",
      },
      {
        true: "h-11",
        default: height,
      },
      {
        true: "rounded-xl",
        false: rounded,
      },
    ],
    selectedClasses: [
      fullWidth,
      height == "h-11" && true,
      rounded == true ? true : false,
    ],
  });

  const BuildInput = BuildComponent({
    name: "Input",
    defaultClasses:
      "outline-none focus:outline-2 focus:outline-blue-500/50 w-full h-full px-4 border-2 border-neutral-500/40 dark:border-neutral-700 dark:bg-neutral-900 placeholder:text-neutral-400 placeholder:text-sm",
    extraClasses: className,
    conditionalClasses: [
      {
        true: "rounded-xl",
        false: rounded,
      },
      {
        true: "pl-8",
      },
      {
        true: "resize-none",
      },
      {
        true: "pr-8",
      },
    ],
    selectedClasses: [
      rounded == true ? true : false,
      icon ? true : false,
      textarea,
      passwordVisibility,
    ],
  });

  return (
    <div className={BuildInputContainer.classes}>
      {icon && (
        <span
          className="z-20 absolute left-2 fill-inherit"
          style={{ transform: "scale(0.8)" }}
        >
          {icon}
        </span>
      )}
      <InputElement
        id={id}
        value={value}
        type={passwordVisible ? "text" : type}
        key={id}
        autoFocus={autoFocus}
        onChange={(e) => typeof onChange == "function" && onChange(e)}
        className={BuildInput.classes}
        placeholder={placeholder}
        maxLength={maxLength}
        onKeyDown={(e) => {
          if (e.key != "Enter") return;

          if (typeof onEnterPress === "function") {
            onEnterPress();
          }
        }}
      />
      {passwordVisibility && (
        <button
          className="z-20 absolute -right-2 p-4 fill-inherit"
          style={{ transform: "scale(0.7)" }}
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? (
            <VisibleOffIcon
              width={24}
              height={24}
              className="fill-neutral-600/60 dark:fill-neutral-600"
            />
          ) : (
            <VisibleIcon
              width={24}
              height={24}
              className="fill-neutral-600/60 dark:fill-neutral-600"
            />
          )}
        </button>
      )}
    </div>
  );
}
