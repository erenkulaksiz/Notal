import { BuildComponent } from "@utils/style/buildComponent";
import type { InputProps } from "./Input.d";

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
}: InputProps) {
  const InputElement = textarea ? "textarea" : "input";

  const BuildInputContainer = BuildComponent({
    name: "Input Container",
    defaultClasses: "h-11 flex flex-row relative items-center",
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
      height == "h-11" ? true : false,
      rounded == true ? true : false,
    ],
  });

  const BuildInput = BuildComponent({
    name: "Input",
    defaultClasses:
      "outline-none focus:outline-2 focus:outline-blue-500/50 w-full h-full px-4 border-2 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 placeholder:text-neutral-400 placeholder:text-sm",
    extraClasses: className,
    conditionalClasses: [
      {
        true: "rounded-xl",
        false: rounded,
      },
      {
        true: "absolute pl-8",
      },
      {
        true: "resize-none",
      },
    ],
    selectedClasses: [
      rounded == true ? true : false,
      icon ? true : false,
      textarea,
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
        type={!textarea ? "text" : ""}
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
    </div>
  );
}
