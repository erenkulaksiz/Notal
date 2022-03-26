import { Modal, Button } from "@components";
import { CheckIcon } from "@icons";

const AlertModal = ({ open, title, desc, onClose }) => {
    return (<Modal open={open} onClose={onClose} className="w-[90%] sm:w-[400px] p-4 px-5">
        <Modal.Title animate>
            <span className="text-lg font-medium">{title}</span>
        </Modal.Title>
        <Modal.Body className="pt-2 pb-5" animate>
            <h1 className="text-lg text-center">
                {desc}
            </h1>
        </Modal.Body>
        <Modal.Footer className="justify-end" animate>
            <Button
                className="w-[49%] h-10"
                onClick={onClose}
            >
                <CheckIcon size={24} fill="currentColor" />
                Close
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default AlertModal;