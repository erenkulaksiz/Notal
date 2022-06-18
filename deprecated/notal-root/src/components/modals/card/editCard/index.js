import { useEffect, useState } from "react";

import {
    Modal,
    Input,
    Button
} from "@components";
import {
    EditIcon,
    CrossIcon,
    CheckIcon
} from "@icons";

const EditCardModal = ({ open, onClose, card, onEdit }) => {
    const [editCard, setEditCard] = useState({ title: "", desc: "" });
    const [editCardErr, setEditCardErr] = useState({ title: false, desc: false });

    useEffect(() => {
        setEditCard({
            title: card.title,
            desc: card.desc,
            image: card.image,
        });
    }, [card]);

    const close = () => {
        onClose();
        setEditCard({
            title: card.title,
            desc: card.desc,
            image: card.image,
        });
        setEditCardErr({ title: false, desc: false });
    }

    const submit = () => {
        if (editCard.title.length < 3 && !editCard.image && !editCard.image.file) {
            setEditCardErr({ ...editCardErr, title: "Card title must be minimum 3 characters long." });
            return;
        }
        onEdit({ title: editCard.title, desc: editCard.desc, id: card._id });
        close();
    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <EditIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium ml-1">{`Card ${card?.title} Settings`}</span>
        </Modal.Title>
        <Modal.Body animate className="grid grid-cols-1 gap-2 pb-2">
            <label htmlFor="editCardTitle">Card Title</label>
            <Input
                fullWidth
                placeholder="Card Title"
                onChange={(e) => setEditCard({ ...editCard, title: e.target.value })}
                value={editCard.title}
                id="editCardTitle"
                maxLength={32}
                onEnterPress={submit}
            />
            {editCardErr.title != false && <span className="text-red-500">{editCardErr.title}</span>}
            <label htmlFor="editCardDescription">Card Description</label>
            <Input
                fullWidth
                textarea
                height="h-24"
                className="p-2"
                placeholder="Card Description"
                onChange={(e) => setEditCard({ ...editCard, desc: e.target.value })}
                value={editCard.desc}
                id="editCardDescription"
                maxLength={356}
                onEnterPress={submit}
            />
        </Modal.Body>
        <Modal.Footer animate className="justify-between">
            <Button
                light="bg-red-500 h-10 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
                onClick={close}
                fullWidth="w-[49%]"
            >
                <CrossIcon size={24} fill="currentColor" />
                Cancel
            </Button>
            <Button
                fullWidth="w-[49%]"
                onClick={submit}
            >
                <CheckIcon size={24} fill="currentColor" />
                Edit Card
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default EditCardModal;