import { CheckIcon } from "@icons";
import { BuildComponent } from "@utils/style";
import type { CheckboxProps } from "./Checkbox.d";

export function Checkbox({
  checked,
  onChange,
  className,
  children,
  id,
}: CheckboxProps) {
  const BuildCheckbox = BuildComponent({
    name: "Checkbox",
    defaultClasses: "flex flex-row",
    extraClasses: className,
  });

  const BuildCheckboxInner = BuildComponent({
    name: "Checkbox Inner",
    defaultClasses:
      "relative h-4 w-4 outline-none group-focus:outline-2 group-focus:outline-blue-500/50 transition-colors ease-in-out flex items-center text-xs justify-center rounded-md border-2 dark:border-neutral-600",
    extraClasses: className,
    conditionalClasses: [
      {
        true: "bg-green-500 dark:bg-green-800",
      },
      { true: "mr-2" },
    ],
    selectedClasses: [checked, children ? true : false],
  });

  return (
    <div className={BuildCheckbox.classes}>
      <input
        className="hidden"
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        id={id}
      />
      {children && (
        <label
          className="flex flex-row items-center cursor-pointer group"
          htmlFor={id}
        >
          <div className={BuildCheckboxInner.classes}>
            {checked && (
              <CheckIcon
                size={24}
                fill="white"
                style={{ transform: "scale(0.5)" }}
                className="absolute"
              />
            )}
          </div>
          {children}
        </label>
      )}
    </div>
  );
}
