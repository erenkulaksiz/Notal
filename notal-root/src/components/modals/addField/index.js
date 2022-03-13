import { useState } from "react";
import { Modal, Button, Input } from "@components";
import { AddIcon, CrossIcon, CheckIcon } from "@icons";

const AddFieldModal = ({ open, onClose, onAdd, workspaceTitle }) => {
    const [newField, setNewField] = useState({ title: "Untitled" });

    const close = () => {
        onClose();
        setNewField({ title: "Untitled" });
    }

    const submit = () => {
        onAdd(newField);
        close();
    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium"> {`Add field to ${workspaceTitle}`}</span>
        </Modal.Title>
        <Modal.Body className="grid grid-cols-1 gap-2 pb-2" animate>
            <label htmlFor="fieldTitle">Field Title</label>
            <Input
                fullWidth
                placeholder="Field Title"
                onChange={(e) => setNewField({ ...newField, title: e.target.value })}
                value={newField.title}
                id="fieldTitle"
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
                Add Field
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddFieldModal;