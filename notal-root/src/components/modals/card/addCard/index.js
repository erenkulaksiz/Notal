import { useState, useEffect } from "react";
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
    CheckIcon,
    CloudUploadIcon
} from "@icons";

const AddCardModal = ({ open, onClose, onAdd, fieldTitle }) => {
    const [addCard, setAddCard] = useState({ title: "", desc: "", color: "#ffffff", tag: { tag: "", tagColor: "" } })
    const [addCardErrors, setAddCardErrors] = useState({ title: false, desc: false, color: false, tag: false });

    const [useColor, setUseColor] = useState(true);
    const [useTagColor, setUseTagColor] = useState(true);

    const [cardNewTag, setCardNewTag] = useState({ title: "", color: "#ff0000" });

    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (useColor) {
            setAddCard({ ...addCard, color: "#ffffff" });
        }
    }, [useColor]);

    const close = () => {
        onClose();
        setAddCardErrors({ title: false, desc: false, color: false, tag: false });
        setAddCard({ ...addCard, title: "", desc: "", /*color: "",*/ tags: [] });
        setCardNewTag({ title: "", color: "#ff0000" });
        setUseTagColor(true);
        setUseColor(true);
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
        if (useColor && addCard.color.charAt(0) !== "#") {
            setAddCardErrors({ ...addCardErrors, color: "Please enter a valid color value." });
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
            tags: addCard.tags,
        });
        close();
    }

    const CardTag = ({ color, title, onRemove }) => {
        return (<div className="px-1 border-2 flex items-center text-xs rounded-lg dark:border-neutral-800 border-neutral-200" style={{ borderColor: color, }}>
            {title}
            <button className="hover:opacity-70" onClick={onRemove}>
                <CrossIcon size={24} className="fill-neutral-800 dark:fill-white" style={{ transform: "scale(.8)" }} />
            </button>
        </div>)
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
                        color: useColor ? addCard.color : "",
                        tags: addCard.tags,
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
                    { title: "Tags", id: "Tags" },
                    { title: "Image", id: "image" },
                    /*{ title: "Subtasks", id: "subtasks" },
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
                    {addCard?.tags?.length > 0 && <label>Card Tags</label>}
                    {addCard?.tags?.length > 0 && <div className="w-full flex flex-row flex-wrap border-2 border-solid border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-2 gap-2">
                        {addCard?.tags?.map((card, index) => <CardTag
                            title={card.title}
                            color={card.color}
                            key={index}
                            onRemove={() => {
                                const newTags = addCard.tags.filter((tag, i) => i != index);
                                setAddCard({ ...addCard, tags: newTags });
                            }}
                        />)}
                    </div>}
                    <label htmlFor="newCardTagColor">Card Tag Color</label>
                    <div className="w-full flex">
                        {useTagColor && <ColorPicker
                            id="newCardTagColor"
                            color={cardNewTag.color}
                            onColorChange={(color) => {
                                setCardNewTag({ ...cardNewTag, color });
                            }}
                        />}
                        <Checkbox
                            id="useCardTagColor"
                            value={!useTagColor}
                            onChange={(e) => setUseTagColor(!useTagColor)}
                        >
                            No Tag Color
                        </Checkbox>
                    </div>
                    <label htmlFor="newCardTagTitle">Card Tag Title</label>
                    <div className="flex flex-row gap-2">
                        <Input
                            containerClassName="flex-1"
                            placeholder="New Card Tag"
                            onChange={(e) => setCardNewTag({ ...cardNewTag, title: e.target.value })}
                            value={cardNewTag.title}
                            id="cardNewTag"
                            maxLength={16}
                        />
                        <Button
                            onClick={() => {
                                if (cardNewTag.title.length < 3) {
                                    setAddCardErrors({ ...addCardErrors, tag: "Tag must be minimum 3 characters long." });
                                    return;
                                }
                                setAddCardErrors({ ...addCardErrors, tag: false });
                                const newAddCard = addCard?.tags ?? [];
                                newAddCard.push({ title: cardNewTag.title, color: useTagColor ? cardNewTag.color : "" });
                                setAddCard({ ...addCard, tags: newAddCard });
                                setCardNewTag({ ...cardNewTag, title: "" });
                            }}
                        >
                            <AddIcon size={24} fill="currentColor" />
                            Add Tag
                        </Button>
                    </div>
                    {addCardErrors.tag != false && <span className="text-red-500">{addCardErrors.tag}</span>}
                </Tab.TabView>
                <Tab.TabView index={2} className="pt-4 grid grid-cols-1 gap-2">
                    <label>Card Image</label>
                    <div
                        className="flex flex-col text-blue-400 items-center justify-center w-full h-16 border-2 border-solid border-blue-400 group hover:border-blue-300 hover:text-blue-300 rounded-xl cursor-pointer"
                        onClick={() => {

                        }}
                    >
                        <CloudUploadIcon size={24} fill="currentColor" />
                        Upload Card Image
                        <input type="file" style={{ display: "none" }} accept="image/png, image/jpeg" />
                    </div>
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