import {
    Modal,
    Button
} from "@components";

import {
    AddIcon,
    CrossIcon,
    CheckIcon,
} from "@icons";

const AddWorkspaceModal = ({ open, onClose, }) => {
    return (<Modal open={open} onClose={onClose} className="w-[96%] sm:w-[400px] p-4 py-2">
        <Modal.Title>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-xl font-medium"> Add Workspace</span>
        </Modal.Title >
        <Modal.Body>
            content
        </Modal.Body>
        <Modal.Footer className="justify-between">
            <Button
                className="w-[49%] bg-red-500 hover:bg-red-600 active:bg-red-700"
                icon={<CrossIcon size={24} fill="currentColor" />}
                onClick={onClose}
            >
                Cancel
            </Button>
            <Button
                className="w-[49%]"
                icon={<CheckIcon size={24} fill="currentColor" />}
            >
                Add Workspace
            </Button>
        </Modal.Footer>
    </Modal >)
}

export default AddWorkspaceModal;