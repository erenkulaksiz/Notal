import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
    Modal,
    Button,
    Input,
    WorkspaceFieldCard,
    Tooltip,
    Checkbox,
    Tab
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

    const submit = (e) => {
        e.preventDefault();
        if (addCard.title.length < 3) {
            setAddCardErrors({ ...addCardErrors, title: "Card title must be minimum 3 characters long." });
            return;
        }
        if (addCard.color.length > 7 && useColor) {
            setAddCardErrors({ ...addCardErrors, color: "Color length must be between 1 and 7." });
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
        <Modal.Body className="flex flex-col pb-2 pt-2" animate>
            {/*<Input fullWidth icon={<UserIcon size={24} />} containerClassName="fill-neutral-600" placeholder="Workspace Title" />*/}
            <form className="w-full h-full" id="addCardForm" onSubmit={submit}>
                <Tab
                    selected={tab}
                    onSelect={({ index }) => setTab(index)}
                    id="workspaceTab"
                    views={[
                        { title: "Card", id: "card" },
                        { title: "Subtasks", id: "subtasks" },
                        { title: "Image", id: "image" },
                        { title: "Notes", id: "notes" },
                        { title: "Details", id: "details" },
                    ]}>
                    <Tab.TabView index={0} className="pt-4 grid grid-cols-1 gap-2">
                        <label htmlFor="cardTitle">Card Title</label>
                        <Input
                            fullWidth
                            placeholder="Card Title"
                            onChange={(e) => setAddCard({ ...addCard, title: e.target.value })}
                            value={addCard.title}
                            autoFocus
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
                                direction="right"
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
                        {addCardErrors.color != false && <span className="text-red-500">{addCardErrors.color}</span>}
                    </Tab.TabView>
                    <Tab.TabView index={1} className="pt-4 grid grid-cols-1 gap-2">
                        sdfds
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
            </form>
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
                type="submit"
                form="addCardForm"
            >
                <CheckIcon size={24} fill="currentColor" />
                Add Card
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddCardModal;