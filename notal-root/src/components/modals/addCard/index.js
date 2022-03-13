import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import {
    Modal,
    Button,
    Input,
    WorkspaceFieldCard,
    Select,
    Tooltip,
    Checkbox
} from "@components";
import {
    AddIcon,
    CrossIcon,
    CheckIcon
} from "@icons";

import { CardColors } from "@utils/constants";

const AddCardModal = ({ open, onClose, onAdd, fieldTitle }) => {
    const [addCard, setAddCard] = useState({ title: "", desc: "", color: "#ffffff", tag: { tag: "", tagColor: "" } })
    const [addCardErrors, setAddCardErrors] = useState({ title: false, desc: false, color: false, tag: false });
    //const [colorPicker, setColorPicker] = useState({visible: false})
    const [useColor, setUseColor] = useState(true);

    const close = () => {
        onClose();
        setAddCardErrors({ title: false, desc: false, color: false, tag: false });
        setAddCard({ ...addCard, title: "", desc: "", /*color: "",*/ tag: { tag: "", tagColor: "" } });
    }

    const submit = () => {
        if (addCard.title.length < 3) {
            setAddCardErrors({ ...addCardErrors, title: "Card title must be minimum 3 characters long." })
            return;
        }
        onAdd({
            title: addCard.title,
            desc: addCard.desc,
            color: useColor ? addCard.color : "",
            tag: addCard.tag
        });
        close();
    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <div className="flex flex-col w-full justify-center items-center">
                <div className="flex flex-row items-center">
                    <AddIcon size={24} fill="currentColor" />
                    <span className="text-lg font-medium">{`Add card to ${fieldTitle}`}</span>
                </div>
                <WorkspaceFieldCard
                    preview
                    card={{
                        title: addCard.title || "Enter Card Title",
                        desc: addCard.desc,
                        color: useColor ? addCard.color : ""
                    }}
                />
            </div>
        </Modal.Title>
        <Modal.Body className="grid grid-cols-1 gap-2 pb-2 pt-4" animate>
            {/*<Input fullWidth icon={<UserIcon size={24} />} containerClassName="fill-neutral-600" placeholder="Workspace Title" />*/}
            <label htmlFor="cardTitle">Card Title</label>
            <Input
                fullWidth
                placeholder="Card Title"
                onChange={(e) => setAddCard({ ...addCard, title: e.target.value })}
                value={addCard.title}
                id="cardTitle"
            />
            {addCardErrors.title != false && <span className="text-red-500">{addCardErrors.title}</span>}
            <label htmlFor="cardDescription">Card Description</label>
            <Input
                fullWidth
                textarea
                height="h-24"
                className="p-2"
                placeholder="Card Description"
                onChange={(e) => setAddCard({ ...addCard, desc: e.target.value })}
                value={addCard.desc}
                id="cardDescription"
            />
            <label htmlFor="cardColor">Card Color</label>
            <div className="flex items-center">
                {useColor && <Tooltip
                    useFocus
                    blockContent={false}
                    containerClassName="px-0 py-0"
                    direction="top"
                    content={<div className="flex flex-col relative">
                        <HexColorPicker color={addCard.color} onChange={(color) => setAddCard({ ...addCard, color })} />
                        <div className="flex flex-row flex-wrap">
                            {CardColors.map((color, index) => <button
                                key={index}
                                className="w-6 h-6 m-1 rounded-lg"
                                style={{ backgroundColor: color.code }}
                                onClick={() => setAddCard({ ...addCard, color: color.code })}
                            />)}
                        </div>
                    </div>}
                >
                    <input
                        type="text"
                        id="cardColor"
                        value={addCard.color}
                        className="p-0 w-20 h-7 rounded mr-2"
                        style={{ backgroundColor: addCard.color || "gray" }}
                        onChange={(e) => {
                            setAddCard({ ...addCard, color: e.target.value });
                            if (e.target.value == "") {
                                setUseColor(false);
                            }
                        }}
                        maxLength={7}
                    />
                </Tooltip>}
                <Checkbox
                    id="useCardColor"
                    value={!useColor}
                    onChange={(e) => setUseColor(!useColor)}
                >
                    No Color
                </Checkbox>
            </div>
        </Modal.Body>
        <Modal.Footer className="justify-between" animate>
            <Button
                className="w-[49%] bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500 h-10"
                onClick={close}
            >
                <CrossIcon size={24} fill="currentColor" />
                Cancel
            </Button>
            <Button
                className="w-[49%] h-10"
                onClick={submit}
            >
                <CheckIcon size={24} fill="currentColor" />
                Add Card
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddCardModal;