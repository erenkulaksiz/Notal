import { Button, Text, Modal, Row } from '@nextui-org/react';

//import DeleteIcon from '../../../../public/icons/delete.svg';

const VisibilityWorkspaceModal = ({ visible, onClose, desc }) => {

    return (<Modal
        closeButton
        aria-labelledby="private-modal"
        open={visible}
        onClose={onClose}
    >
        <Modal.Header>
            <Text id="private-modal" b size={18}>
                Workspace Visibility
            </Text>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Text>
                    {desc}
                </Text>
            </Row>
        </Modal.Body>
        <Modal.Footer>
            <Button auto onClick={onClose}>
                Okay
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default VisibilityWorkspaceModal;