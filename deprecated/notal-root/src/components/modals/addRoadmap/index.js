import { useState } from "react";
import {
    Modal,
    Button,
    Input
} from "@components";
import {
    AddIcon,
    CrossIcon,
    CheckIcon,
} from "@icons";

const AddRoadmapModal = ({ open, onClose, onAdd }) => {
    const [newRoadmap, setNewRoadmap] = useState({ title: "Untitled", desc: "" });

    const submit = () => {
        onAdd({
            title: newRoadmap.title,
            desc: newRoadmap.desc,
        });
        onClose();
    }

    const close = () => {
        onClose();
    }

    return (<Modal open={open} onClose={onClose} className="w-[90%] sm:w-[400px] p-4 px-5 relative">
        <Modal.Title animate>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium ml-1">Add Roadmap</span>
        </Modal.Title>
        <Modal.Body className="flex flex-col pb-2" animate>
            <label htmlFor="roadmapTitle">Roadmap Title</label>
            <Input
                fullWidth
                placeholder="Roadmap Title"
                onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                value={newRoadmap.title}
                id="roadmapTitle"
                maxLength={32}
                onEnterPress={submit}
            />
        </Modal.Body>
        <Modal.Footer className="justify-between" animate>
            <Button
                light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
                onClick={close}
                fullWidth="w-[49%]"
            >
                <CrossIcon size={24} fill="currentColor" />
                Cancel
            </Button>
            <Button
                onClick={submit}
                fullWidth="w-[49%]"
            >
                <CheckIcon size={24} fill="currentColor" />
                Add Workspace
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AddRoadmapModal;