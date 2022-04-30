import {
    Modal,
    Button
} from "@components";
import {
    AddIcon,
    CrossIcon,
    CheckIcon,
} from "@icons";

const AddRoadmapModal = ({ open, onClose, onAdd }) => {

    const submit = () => {
        onAdd();
    }

    const close = () => {
        onClose();
    }

    return (<Modal open={open} onClose={onClose} className="w-[90%] sm:w-[400px] p-4 px-5 relative">
        <Modal.Title animate>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium ml-1">Add Roadmap</span>
        </Modal.Title>
        <Modal.Body animate>

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