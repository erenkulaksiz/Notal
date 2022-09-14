import { HexColorPicker } from "react-colorful";

import { Tooltip } from "@components";
import { CardColors } from "@constants/cardcolors";
import { formatString } from "@utils";
import type { CardColorTypes } from "@constants/cardcolors";
import type { ColorpickerProps } from "./Colorpicker.d";

export function Colorpicker({ color, onChange, id }: ColorpickerProps) {
  return (
    <Tooltip
      useFocus
      noPadding
      blockContent={false}
      containerClassName="px-0"
      direction="right"
      content={
        <div className="flex flex-col relative">
          <HexColorPicker
            color={color}
            onChange={(color) => onChange(color.toUpperCase())}
          />
          <div className="flex flex-row flex-wrap">
            {CardColors.map((color: CardColorTypes, index: number) => (
              <button
                key={index}
                className="w-6 h-6 m-1 rounded-lg"
                style={{ backgroundColor: color.code }}
                onClick={() => onChange(color.code.toUpperCase())}
              />
            ))}
          </div>
        </div>
      }
    >
      <button className="w-7 h-7 mr-1 p-[2px] rounded border-2 dark:border-neutral-800 border-neutral-500/40 bg-transparent">
        <div
          className="w-full h-full rounded-sm"
          style={{ backgroundColor: color || "gray" }}
        />
      </button>
      <input
        type="text"
        id={id}
        value={color}
        className="p-0 w-20 h-7 bg-transparent rounded border-2 dark:border-neutral-800 border-neutral-500/40"
        onChange={(e) =>
          onChange(`#${formatString(e.target.value).toUpperCase()}`)
        }
        maxLength={7}
      />
    </Tooltip>
  );
}
