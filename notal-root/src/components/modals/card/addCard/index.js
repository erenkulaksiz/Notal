import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
    Modal,
    Button,
    Input,
    WorkspaceFieldCard,
    Tooltip,
    Checkbox,
    Tab,
    ColorPicker
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
    const [useColor, setUseColor] = useState(true);

    const [tab, setTab] = useState(0);

    const close = () => {
        onClose();
        setAddCardErrors({ title: false, desc: false, color: false, tag: false });
        setAddCard({ ...addCard, title: "", desc: "", /*color: "",*/ tag: { tag: "", tagColor: "" } });
        setTab(0);
    }

    const submit = () => {
        if (addCard.title.length < 3) {
            setAddCardErrors({ ...addCardErrors, title: "Card title must be minimum 3 characters long." });
            return;
        }
        if (addCard.color.length > 7 && useColor) {
            setAddCardErrors({ ...addCardErrors, color: "Color length must be between 1 and 7." });
            return;
        }
        if (addCard.desc.length > 356) {
            setAddCardErrors({ ...addCardErrors, title: "Card title must be maximum 356 characters long." });
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
                    <span className="text-lg font-medium ml-1">{`Add card to ${fieldTitle}`}</span>
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
        <Modal.Body className="flex flex-col pb-2 pt-2" animate>
            {/*<Input fullWidth icon={<UserIcon size={24} />} containerClassName="fill-neutral-600" placeholder="Workspace Title" />*/}
            <Tab
                selected={tab}
                onSelect={({ index }) => setTab(index)}
                id="workspaceTab"
                views={[
                    { title: "Card", id: "card" },
                    { title: "Tag", id: "Tag" },
                    /*{ title: "Subtasks", id: "subtasks" },
                    { title: "Image", id: "image" },
                    { title: "Notes", id: "notes" },
                    { title: "Details", id: "details" },*/
                ]}>
                <Tab.TabView index={0} className="pt-4 grid grid-cols-1 gap-2">
                    <label htmlFor="cardTitle">Card Title</label>
                    <Input
                        fullWidth
                        placeholder="Card Title"
                        onChange={(e) => setAddCard({ ...addCard, title: e.target.value })}
                        value={addCard.title}
                        id="cardTitle"
                        maxLength={40}
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
                        maxLength={356}
                    />
                    <label htmlFor="cardColor">Card Color</label>
                    <div className="flex items-center">
                        {useColor && <ColorPicker
                            color={addCard.color}
                            onColorChange={(color) => {
                                if (color?.length == 0) setUseColor(false);
                                setAddCard({ ...addCard, color });
                            }}
                            id="cardColor"
                        />}
                        <Checkbox
                            id="useCardColor"
                            value={!useColor}
                            onChange={(e) => setUseColor(!useColor)}
                        >
                            No Color
                        </Checkbox>
                    </div>
                    {addCardErrors.color != false && <span className="text-red-500">{addCardErrors.color}</span>}
                </Tab.TabView>
                <Tab.TabView index={1} className="pt-4 grid grid-cols-1 gap-2">
                    <label>Card Tag</label>
                </Tab.TabView>
                <Tab.TabView index={2} className="pt-4 grid grid-cols-1 gap-2">
                    sdfds
                </Tab.TabView>
                <Tab.TabView index={3} className="pt-4 grid grid-cols-1 gap-2">
                    sdfds
                </Tab.TabView>
                <Tab.TabView index={4} className="pt-4 grid grid-cols-1 gap-2">
                    sdfds
                </Tab.TabView>
            </Tab>
        </Modal.Body>
        <Modal.Footer className="justify-between" animate>
            <Button
                className="w-[49%] h-10"
                light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
                onClick={close}
                fullWidth="w-[49%]"
            >
                <CrossIcon size={24} fill="currentColor" />
                Cancel
            </Button>
            <Button
                className="w-[49%] h-10"
                onClick={submit}
                fullWidth="w-[49%]"
            >
                <CheckIcon size={24} fill="currentColor" />
                Add Card
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddCardModal;