import { useEffect, useState } from 'react';
import { Button, Text, Modal, Input, Row } from '@nextui-org/react';

import {
    EditIcon,
    CrossIcon,
    CheckIcon
} from '../../../icons';

const EditWorkspaceModal = ({ visible, onClose, onEdit, title, desc }) => {

    const [titleError, setTitleError] = useState("");
    const [descError, setDescError] = useState("");

    const [editTitle, setEditTitle] = useState(title);
    const [editDesc, setEditDesc] = useState(desc);

    useEffect(() => { // #TODO: remove this useeffect
        setEditTitle(title);
        setEditDesc(desc);
    }, [title, desc])

    const edit = () => {
        if (editTitle.length < 3 || editTitle.length > 20) {
            setTitleError("Title must be between 3 and 20 characters long.");
            return;
        }
        if (editDesc.lenght > 20) {
            setDescError("Maximum 20 characters allowed.");
            return;
        }
        onEdit({ title: editTitle, desc: editDesc });
    }

    const close = () => {
        setTitleError("");
        setDescError("");
        onClose();
    }

    return (<Modal
        closeButton
        aria-labelledby="edit-field"
        open={visible}
        onClose={close}
    >
        <Modal.Header>
            <EditIcon height={24} width={24} style={{ fill: "currentColor", marginRight: 4 }} />
            <Text b id="edit-field" size={18} css={{ ml: 4 }}>
                Edit Workspace
            </Text>
        </Modal.Header>
        <Modal.Body>
            <Row css={{ fd: "column", m: 0, mb: 8 }}>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Workspace Title</Text>}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={20}
                />
                {titleError != false && <Text color={"$error"}>{titleError}</Text>}
            </Row>
            <Row css={{ fd: "column", m: 0, }}>
                <Input
                    bordered
                    fullWidth
                    color="primary"
                    label={<Text css={{ color: "$gray700", fontWeight: "500" }}>Workspace Description</Text>}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    maxLength={20}
                />
                {descError != false && <Text color={"$error"}>{descError}</Text>}
            </Row>
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={close}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }} onClick={edit}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Edit
            </Button>
        </Modal.Footer>
    </Modal >)
}

export default EditWorkspaceModal;