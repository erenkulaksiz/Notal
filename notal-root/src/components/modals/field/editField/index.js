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

const EditFieldModal = ({ open, onClose, title, onEdit }) => {
    const [editField, setEditField] = useState({ title: "" });
    const [editFieldErr, setEditFieldErr] = useState({ title: false });

    useEffect(() => {
        setEditField({ title, });
    }, [title]);

    const close = () => {
        onClose();
        setEditField({ title }); // set back to default
        setEditFieldErr({ title: false });
    }

    const submit = () => {
        if (editField.title.length < 2) {
            setEditFieldErr({ ...editFieldErr, title: "Field title must be minimum 2 characters." });
            return;
        }
        if (editField.title.length > 28) {
            setEditFieldErr({ ...editFieldErr, title: "Field title must be maximum 28 characters." });
            return;
        }
        onEdit({ title: editField.title });
        close();
    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <EditIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium ml-1">{`${title} Field Settings`}</span>
        </Modal.Title>
        <Modal.Body animate className="grid grid-cols-1 gap-2 pb-2">
            <label htmlFor="editTitle">Field Title</label>
            <Input
                fullWidth
                placeholder="Field Title"
                onChange={(e) => setEditField({ ...editField, title: e.target.value })}
                value={editField.title}
                id="editTitle"
                maxLength={32}
            />
            {/*<label htmlFor="sortBy">Sort By</label>*/}
            {editFieldErr.title != false && <span className="text-red-500">{editFieldErr.title}</span>}
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
                Edit Field
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default EditFieldModal;