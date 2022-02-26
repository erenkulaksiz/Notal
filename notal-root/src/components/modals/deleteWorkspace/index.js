import {
    Modal,
    Button
} from "@components";

import {
    DeleteIcon,
    CrossIcon,
    CheckIcon
} from "@icons";

const DeleteWorkspaceModal = ({ open, onClose, onDelete }) => {
    return (<Modal open={open} onClose={onClose} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <DeleteIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium"> Delete Workspace</span>
        </Modal.Title>
        <Modal.Body className="pt-2 pb-5" animate>
            <h1 className="text-lg text-center">
                Are you sure want to delete this workspace?
            </h1>
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
                onClick={onDelete}
            >
                Delete
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default DeleteWorkspaceModal;