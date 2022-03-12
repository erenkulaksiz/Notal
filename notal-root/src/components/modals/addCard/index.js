import { useState } from "react";
import {
    Modal,
    Button,
    Input,
    WorkspaceFieldCard,
    Select
} from "@components";
import {
    AddIcon,
    CrossIcon,
    CheckIcon
} from "@icons";

import { CardColors } from "@utils/constants";

const AddCardModal = ({ open, onClose, onAdd }) => {
    const [addCard, setAddCard] = useState({ title: "", desc: "", color: "", tag: { tag: "asd", tagColor: "#baa30f" } })

    const close = () => {
        onClose();
        setAddCard({ title: "", desc: "", color: "", tag: { tag: "asd", tagColor: "#baa30f" } });
    }

    const submit = () => {
        onAdd({ title: addCard.title, desc: addCard.desc, color: addCard.color, tag: addCard.tag });
        close();
    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <WorkspaceFieldCard
                preview
                card={{ title: addCard.title || "Enter Card Title", desc: addCard.desc, color: addCard.color }}
            />
        </Modal.Title>
        <Modal.Body className="grid grid-cols-1 gap-2 pb-2 pt-4" animate>
            {/*<Input fullWidth icon={<UserIcon size={24} />} containerClassName="fill-neutral-600" placeholder="Workspace Title" />*/}
            <label for="cardTitle">Card Title</label>
            <Input
                fullWidth
                placeholder="Card Title"
                onChange={(e) => setAddCard({ ...addCard, title: e.target.value })}
                value={addCard.title}
                id="cardTitle"
            />
            <label for="cardDescription">Card Description</label>
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
            <label for="cardColor">Card Color</label>
            <Select
                onChange={e => setAddCard({ ...addCard, color: e.target.value })}
                className="w-full"
                options={[...CardColors.map(el => {
                    return { id: el.code, text: el.name || "Select Color", disabled: el.selectable == false }
                })]}
                id="cardColor"
            />
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