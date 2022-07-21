import { BuildComponent } from "@utils/style/buildComponent";
import type { SelectProps } from "./Select.d";

export function Select({
  options,
  onChange,
  value,
  className,
  id,
}: SelectProps) {
  const BuildSelect = BuildComponent({
    name: "Select",
    defaultClasses:
      "h-11 outline-none focus:outline-2 focus:outline-blue-500/50 border-2 border-solid border-neutral-200 dark:border-neutral-700 appearance-none flex w-full px-3 py-1.5 text-base font-normal text-gray-700 dark:text-white bg-white dark:bg-neutral-900 bg-clip-padding bg-no-repeat rounded-xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
    extraClasses: className,
  });

  return (
    <select
      onChange={(e) => onChange(e)}
      value={value}
      className={BuildSelect.classes}
      id={id}
    >
      {options &&
        options.map((element, index) => (
          <option key={index} value={element.id} disabled={element.disabled}>
            {element.text}
          </option>
        ))}
    </select>
  );
}
