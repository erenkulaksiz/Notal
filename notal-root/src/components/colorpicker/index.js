import { Tooltip } from "@components";
import { HexColorPicker } from "react-colorful";
import { CardColors } from "@utils/constants";
import { formatString } from "@utils";

const ColorPicker = ({ color, onColorChange, id }) => {
    return (<Tooltip
        useFocus
        noPadding
        blockContent={false}
        containerClassName="px-0"
        direction="right"
        content={<div className="flex flex-col relative">
            <HexColorPicker color={color} onChange={(color) => onColorChange(color.toUpperCase())} />
            <div className="flex flex-row flex-wrap">
                {CardColors.map((color, index) => <button
                    key={index}
                    className="w-6 h-6 m-1 rounded-lg"
                    style={{ backgroundColor: color.code }}
                    onClick={() => onColorChange(color.code.toUpperCase())}
                />)}
            </div>
        </div>}
    >
        <button className="w-7 h-7 mr-1 p-[2px] rounded border-2 dark:border-neutral-800 bg-transparent">
            <div className="w-full h-full rounded-sm" style={{ backgroundColor: color || "gray" }} />
        </button>
        <input
            type="text"
            id={id}
            value={color}
            className="p-0 w-20 h-7 bg-transparent rounded mr-2 border-2 dark:border-neutral-800"
            onChange={(e) => onColorChange(`#${formatString(e.target.value).toUpperCase()}`)}
            maxLength={7}
        />
    </Tooltip>)
}

export default ColorPicker;