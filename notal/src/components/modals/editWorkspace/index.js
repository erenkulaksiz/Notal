import { useState } from 'react';
import { Button, Text, Modal, Input, Grid, Row } from '@nextui-org/react';

import EditIcon from '../../../../public/icons/edit.svg';
import CrossIcon from '../../../../public/icons/cross.svg';
import CheckIcon from '../../../../public/icons/check.svg';

const EditWorkspaceModal = ({ visible, onClose, onEdit, title, desc }) => {

    const [editTitle, setEditTitle] = useState(title);
    const [editDesc, setEditDesc] = useState(desc);

    return (<Modal
        closeButton
        aria-labelledby="edit-field"
        open={visible}
        onClose={onClose}
    >
        <Modal.Header>
            <EditIcon height={24} width={24} style={{ fill: "currentColor", marginRight: 4 }} />
            <Text b id="edit-field" size={18} css={{ ml: 4 }}>
                Edit Workspace
            </Text>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    placeholder="Workspace title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                />
            </Row>
            <Row>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    placeholder="Workspace description"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                />
            </Row>
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={onClose}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }} onClick={() => onEdit({ title: editTitle, desc: editDesc, })}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Edit
            </Button>
        </Modal.Footer>
    </Modal >)
}

export default EditWorkspaceModal;