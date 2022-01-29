import { Button, Text, Grid, Modal, } from '@nextui-org/react';

import DeleteIcon from '../../../public/icons/delete.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import CheckIcon from '../../../public/icons/check.svg';

const DeleteWorkspaceModal = ({ visible, setDeleteModal, deleteModal, onDelete }) => {
    return (<Modal
        closeButton
        aria-labelledby="delete-workspace"
        open={visible}
        onClose={() => setDeleteModal({ ...deleteModal, visible: false })}
    >
        <Modal.Header>
            <DeleteIcon height={24} width={24} style={{ fill: "currentColor" }} />
            <Text b id="delete-workspace" size={18} css={{ ml: 4 }}>
                Delete Workspace
            </Text>
        </Modal.Header>
        <Modal.Body>
            <Text size={18}>Are you sure want to delete this workspace?</Text>
        </Modal.Body>
        <Modal.Footer>
            <Grid.Container gap={2}>
                <Grid xs={6} justify='center'>
                    <Button auto css={{ width: "100%" }} flat color="error" onClick={() => setDeleteModal({ ...deleteModal, visible: false })}>
                        <CrossIcon height={24} width={24} style={{ fill: "currentColor" }} />
                        Cancel
                    </Button>
                </Grid>
                <Grid xs={6} justify='center'>
                    <Button auto css={{ width: "100%" }} onClick={() => {
                        onDelete();
                        setDeleteModal({ ...deleteModal, visible: false });
                    }}>
                        <CheckIcon height={24} width={24} style={{ fill: "currentColor" }} />
                        Delete
                    </Button>
                </Grid>
            </Grid.Container>
        </Modal.Footer>
    </Modal>)
}

export default DeleteWorkspaceModal;