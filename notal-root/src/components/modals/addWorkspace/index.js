import { useState } from "react";

import {
    Modal,
    Button,
    Input,
    Checkbox
} from "@components";

import {
    AddIcon,
    CrossIcon,
    CheckIcon
} from "@icons";

const AddWorkspaceModal = ({ open, onClose, onAdd }) => {
    const [newWorkspace, setNewWorkspace] = useState({ title: "", desc: "", starred: false });
    const [newWorkspaceErr, setNewWorkspaceErr] = useState({ title: false, desc: false });

    const close = () => {
        setNewWorkspaceErr({ ...newWorkspace, title: false, desc: false });
        setNewWorkspace({ title: "", desc: "", starred: false });
        onClose();
    }

    const submit = () => {
        if (newWorkspace.title.length < 3) {
            setNewWorkspaceErr({ ...newWorkspaceErr, title: "Title must be minimum 3 characters long." });
            return;
        }
        onAdd({ title: newWorkspace.title, desc: newWorkspace.desc, starred: newWorkspace.starred });
        close();
    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium"> Add Workspace</span>
        </Modal.Title >
        <Modal.Body className="grid grid-cols-1 gap-2 pb-2" animate>
            {/*<Input fullWidth icon={<UserIcon size={24} />} containerClassName="fill-neutral-600" placeholder="Workspace Title" />*/}
            <Input fullWidth placeholder="Workspace Title" onChange={(e) => setNewWorkspace({ ...newWorkspace, title: e.target.value })} />
            <Input fullWidth placeholder="Workspace Description" onChange={(e) => setNewWorkspace({ ...newWorkspace, desc: e.target.value })} />
            <div className="py-4">
                <Checkbox content="Add to favorites" value={newWorkspace.starred} onChange={(e) => setNewWorkspace({ ...newWorkspace, starred: !newWorkspace.starred })} />
            </div>
        </Modal.Body>
        <Modal.Footer className="justify-between" animate>
            <Button
                className="w-[49%] bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500 h-10"
                icon={<CrossIcon size={24} fill="currentColor" />}
                onClick={close}
            >
                Cancel
            </Button>
            <Button
                className="w-[49%] h-10"
                icon={<CheckIcon size={24} fill="currentColor" />}
                onClick={submit}
            >
                Add Workspace
            </Button>
        </Modal.Footer>
    </Modal >)
}

export default AddWorkspaceModal;