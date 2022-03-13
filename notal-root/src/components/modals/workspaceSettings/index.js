import { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Input,
    Select,
    HomeWorkspaceCard
} from "@components";
import {
    EditIcon,
    CrossIcon,
    CheckIcon,
    SettingsIcon
} from "@icons";

const WorkspaceSettingsModal = ({ open, onClose, onSubmit, workspace }) => {
    const [editWorkspace, setEditWorkspace] = useState({ title: "", desc: "" });

    useEffect(() => {
        setEditWorkspace({
            title: workspace?.title,
            desc: workspace?.desc,
        })
    }, [workspace]);

    const close = () => {
        onClose();
        setEditWorkspace({
            title: workspace?.title,
            desc: workspace?.desc
        });
    }

    const submit = () => {
        onSubmit({
            title: editWorkspace.title,
            desc: editWorkspace.desc
        });
        onClose();
    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <SettingsIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium"> Workspace Settings</span>
        </Modal.Title>
        <Modal.Body className="grid grid-cols-1 gap-2 pb-2 pt-4">
            <div className="w-full">
                <HomeWorkspaceCard
                    preview
                    workspace={{
                        workspaceVisible: workspace?.workspaceVisible,
                        title: editWorkspace.title,
                        desc: editWorkspace.desc,
                        _id: workspace?._id,
                    }}
                    onStar={() => { }}
                    onDelete={() => { }}
                />
            </div>
            <label htmlFor="workspaceTitle">Workspace Title</label>
            <Input
                fullWidth
                placeholder="Workspace Title"
                onChange={(e) => setEditWorkspace({ ...editWorkspace, title: e.target.value })}
                value={editWorkspace.title}
                id="workspaceTitle"
            />
            <label htmlFor="workspaceTitle">Workspace Description</label>
            <Input
                fullWidth
                placeholder="Workspace Description"
                onChange={(e) => setEditWorkspace({ ...editWorkspace, desc: e.target.value })}
                value={editWorkspace.desc}
                id="workspaceDesc"
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
                Edit Workspace
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default WorkspaceSettingsModal;