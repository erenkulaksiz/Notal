import { Modal, Button } from "@components";

const LoginModal = ({ open, onClose }) => {
    return (<Modal
        open={open}
        onClose={onClose}
        className="w-[96%] sm:w-[460px]"
        blur
    >
        asdasd
        <Button onClick={onClose} size="sm">
            close
        </Button>
    </Modal>)
}

export default LoginModal;