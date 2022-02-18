import {
    Modal,
    Button,
    Input,
    Checkbox
} from "@components";

import {
    AddIcon,
    CrossIcon,
    CheckIcon,
} from "@icons";

const AddWorkspaceModal = ({ open, onClose, }) => {
    return (<Modal open={open} onClose={onClose} className="w-[90%] sm:w-[400px] p-4 py-2 pt-4">
        <Modal.Title animate>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-xl font-medium"> Add Workspace</span>
        </Modal.Title >
        <Modal.Body className="grid grid-cols-1 gap-2 pb-2" animate>
            <Input fullWidth placeholder="Workspace Title" />
            <Input fullWidth placeholder="Workspace Description" />
            <div className="py-4">
                <Checkbox />
            </div>
        </Modal.Body>
        <Modal.Footer className="justify-between" animate>
            <Button
                className="w-[49%] bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500 h-10"
                icon={<CrossIcon size={24} fill="currentColor" />}
                onClick={onClose}
            >
                Cancel
            </Button>
            <Button
                className="w-[49%] h-10"
                icon={<CheckIcon size={24} fill="currentColor" />}
            >
                Add Workspace
            </Button>
        </Modal.Footer>
    </Modal >)
}

export default AddWorkspaceModal;