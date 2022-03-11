import { Modal, Button } from "@components";
import { AddIcon, CrossIcon, CheckIcon } from "@icons";

const AddFieldModal = ({ open, onClose, onAdd }) => {

    const close = () => {
        onClose();
    }

    const submit = () => {

    }

    return (<Modal open={open} onClose={close} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <AddIcon size={24} fill="currentColor" />
            <span className="text-lg font-medium"> Add Field</span>
        </Modal.Title>
        <Modal.Body animate>
            selam!
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