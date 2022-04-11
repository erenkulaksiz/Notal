import { Tooltip } from "@components";
import { HexColorPicker } from "react-colorful";
import { CardColors } from "@utils/constants";

const ColorPicker = ({ color, onColorChange, id }) => {
    return (<Tooltip
        useFocus
        noPadding
        blockContent={false}
        containerClassName="px-0"
        direction="right"
        content={<div className="flex flex-col relative">
            <HexColorPicker color={color} onChange={(color) => onColorChange(color)} />
            <div className="flex flex-row flex-wrap">
                {CardColors.map((color, index) => <button
                    key={index}
                    className="w-6 h-6 m-1 rounded-lg"
                    style={{ backgroundColor: color.code }}
                    onClick={() => onColorChange(color.code)}
                />)}
            </div>
        </div>}
    >
        <input
            type="text"
            id={id}
            value={color}
            className="p-0 w-20 h-7 rounded mr-2"
            style={{ backgroundColor: color || "gray" }}
            onChange={(e) => onColorChange(e.target.value)}
            maxLength={7}
        />
    </Tooltip>)
}

export default ColorPicker;